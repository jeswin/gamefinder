import crypto from 'crypto';
import { Express, Request, Response } from "express";
import * as oidc from "openid-client";
import { config } from "../config.js";
import { authenticate, requireAuth } from "./auth-middleware.js";
import { generatePKCE, getOAuthClient } from "./oauth-client.js";
import { generateAccessToken, User } from "./token-service.js";
import { createOrUpdateUser } from "./user-service.js";

const codeVerifiers = new Map<string, string>();

function generateUUID() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function setupAuthRoutes(app: Express) {
  app.use(authenticate);

  app.get("/auth/google", async (req: Request, res: Response) => {
    try {
      const client = await getOAuthClient("google");
      const redirect = req.query.redirect ? String(req.query.redirect) : "/";
      const state = generateUUID();
      const { codeVerifier, codeChallenge } = await generatePKCE();
      
      codeVerifiers.set(state, JSON.stringify({ codeVerifier, redirect }));
      setTimeout(() => codeVerifiers.delete(state), 10 * 60 * 1000);

      const authUrl = oidc.buildAuthorizationUrl(client, {
        scope: "openid email profile",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        state,
        redirect_uri: config.auth.google.redirectUri,
      });

      res.redirect(authUrl.href);
    } catch (error) {
      console.error("Google OAuth initialization error:", error);
      res.status(500).json({ error: "Authentication service unavailable" });
    }
  });

  app.get("/auth/google/callback", async (req: Request, res: Response): Promise<void> => {
    try {
      const client = await getOAuthClient("google");
      const callbackUrl = new URL(req.originalUrl, `${req.protocol}://${req.get('host')}`);
      
      // Manual validation since validateAuthResponse doesn't exist
      const urlParams = new URLSearchParams(callbackUrl.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');

      if (!code || !state || !codeVerifiers.has(state)) {
          res.status(400).json({ error: "Invalid request parameters" });
          return;
      }

      const storedData = JSON.parse(codeVerifiers.get(state)!);
      codeVerifiers.delete(state);

      const { codeVerifier, redirect } = storedData;

      const tokenSet = await oidc.authorizationCodeGrant(client, callbackUrl, {
          pkceCodeVerifier: codeVerifier,
          expectedState: state
      });

      const userInfo = await processGoogleCallback(tokenSet);
      const accessToken = await generateAccessToken(userInfo);

      res.cookie(
        config.auth.cookies.accessToken,
        accessToken,
        config.auth.cookies.options
      );

      res.redirect(`${config.frontendUrl}${redirect}`);
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      res.status(500).json({
        error: "Authentication failed", 
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.get("/auth/logout", (req: Request, res: Response) => {
    res.clearCookie(config.auth.cookies.accessToken);
    res.redirect(config.frontendUrl);
  });

  app.get("/auth/me", requireAuth, (req: Request, res: Response) => {
    const publicUserData = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      picture: req.user.picture,
    };
    res.json(publicUserData);
  });
}

async function processGoogleCallback(tokenSet: any): Promise<User> {
  if (!tokenSet.id_token) {
    throw new Error("Invalid token set");
  }

  // For now, we'll parse the JWT manually or use the userinfo endpoint
  // Since claims() is not working as expected
  const client = await getOAuthClient("google");
  const userinfo = await oidc.fetchUserInfo(client, tokenSet.access_token, tokenSet.id_token);

  const userData = {
    email: userinfo.email as string || "",
    name: userinfo.name as string || "",
    picture: userinfo.picture as string,
    provider: "google" as const,
    providerUserId: userinfo.sub as string,
  };

  if (!userData.email) {
    throw new Error("Email is required");
  }

  return createOrUpdateUser(userData);
}