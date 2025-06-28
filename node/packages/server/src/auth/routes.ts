import crypto from 'crypto';
import { Express, Request, Response } from "express";
import { TokenSet } from "openid-client";
import { config } from "../config.js";
import { authenticate, requireAuth } from "./auth-middleware.js";
import { generatePKCE, getOAuthClient } from "./oauth-client.js";
import { generateAccessToken, User } from "./token-service.js";
import { createOrUpdateUser } from "./user-service.js";

// Store PKCE verifiers temporarily (should use Redis or similar in production)
const codeVerifiers = new Map<string, string>();

// Helper function to generate UUID if crypto.randomUUID is not available
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

export function setupAuthRoutes(app: Express): void {
  // Apply authentication middleware to all routes
  app.use(authenticate);

  // Google OAuth login
  app.get("/auth/google", async (req: Request, res: Response) => {
    try {
      const client = await getOAuthClient("google");

      // Get the redirect URL from query params or use default
      const redirect = req.query.redirect ? String(req.query.redirect) : "/";
      
      // Generate a simple state
      const state = generateUUID();
      const { codeVerifier, codeChallenge } = generatePKCE();
      
      // Store both code verifier and redirect path
      codeVerifiers.set(state, JSON.stringify({
        codeVerifier,
        redirect
      }));

      // Set timeout to clean up stored verifiers
      setTimeout(() => codeVerifiers.delete(state), 10 * 60 * 1000); // 10 minutes

      console.log("Starting OAuth flow with state:", state);
      
      const authUrl = client.authorizationUrl({
        scope: "openid email profile",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        state,
      });

      res.redirect(authUrl);
    } catch (error) {
      console.error("Google OAuth initialization error:", error);
      res.status(500).json({ error: "Authentication service unavailable" });
    }
  });

  // Google OAuth callback
  app.get("/auth/google/callback", async (req: Request, res: Response) => {
    try {
      console.log("Google callback received with query params:", req.query);
      
      const { state, code } = req.query;

      if (
        !state ||
        !code ||
        typeof state !== "string" ||
        typeof code !== "string"
      ) {
        return res.status(400).json({ error: "Invalid request", params: req.query });
      }

      console.log("Looking up stored data for state:", state);
      console.log("All stored states:", Array.from(codeVerifiers.keys()));
      
      // Get the stored data for this state
      const storedData = codeVerifiers.get(state);
      if (!storedData) {
        return res.status(400).json({ 
          error: "Invalid state parameter", 
          state,
          availableStates: Array.from(codeVerifiers.keys())
        });
      }

      // Parse the stored data
      const { codeVerifier, redirect } = JSON.parse(storedData);

      // Clean up
      codeVerifiers.delete(state);

      // Exchange the code for tokens
      const client = await getOAuthClient("google");
      
      // Try a different approach: use a direct tokenset instead of callback
      try {
        console.log("Attempting direct token exchange");
        
        // Build the token request manually
        const tokenRequest = {
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: config.auth.google.redirectUri,
          code_verifier: codeVerifier,
        };
        
        console.log("Token request parameters:", tokenRequest);
        
        const tokenSet = await client.grant(tokenRequest);
        console.log("Token exchange successful");
        
        // Get user info
        const userInfo = await processGoogleCallback(tokenSet);

        // Generate our app's JWT token
        const accessToken = await generateAccessToken(userInfo);

        // Set the cookie
        res.cookie(
          config.auth.cookies.accessToken,
          accessToken,
          config.auth.cookies.options
        );

        // Redirect to the frontend with the stored redirect path
        res.redirect(`${config.frontendUrl}${redirect}`);
      } catch (tokenError) {
        console.error("Direct token exchange failed:", tokenError);
        throw tokenError;
      }
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      res.status(500).json({
        error: "Authentication failed", 
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Logout route
  app.get("/auth/logout", (req: Request, res: Response) => {
    res.clearCookie(config.auth.cookies.accessToken);
    
    // Redirect to the frontend using configured URL
    res.redirect(config.frontendUrl);
  });

  // Get current user info (protected route example)
  app.get("/auth/me", requireAuth, (req: Request, res: Response) => {
    // The user is attached by the authentication middleware
    const publicUserData = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      picture: req.user.picture,
    };

    res.json(publicUserData);
  });
}

/**
 * Process Google OAuth callback and create/update user
 */
async function processGoogleCallback(tokenSet: TokenSet): Promise<User> {
  if (!tokenSet.access_token || !tokenSet.id_token) {
    throw new Error("Invalid token set");
  }

  const client = await getOAuthClient("google");
  const userinfo = await client.userinfo(tokenSet.access_token);

  const userData = {
    email: userinfo.email || "",
    name: userinfo.name || "",
    picture: userinfo.picture,
    provider: "google" as const,
    providerUserId: userinfo.sub,
  };

  if (!userData.email) {
    throw new Error("Email is required");
  }

  // Create or update the user in our database
  return createOrUpdateUser(userData);
}