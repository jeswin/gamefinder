import { Issuer, Client, generators } from "openid-client";
import { config } from "../config.js";

// Type definition for our OAuth providers
export type OAuthProvider = "google";

// Cache for OAuth clients
const clients: Record<OAuthProvider, Client | null> = {
  google: null,
};

/**
 * Initialize Google OAuth client
 */
export async function initializeGoogleClient(): Promise<Client> {
  if (clients.google) {
    return clients.google;
  }

  try {
    const googleIssuer = await Issuer.discover("https://accounts.google.com");

    const client = new googleIssuer.Client({
      client_id: config.auth.google.clientId,
      client_secret: config.auth.google.clientSecret,
      redirect_uris: [config.auth.google.redirectUri],
      response_types: ["code"],
    });

    clients.google = client;
    return client;
  } catch (error) {
    console.error("Failed to initialize Google OAuth client:", error);
    throw new Error("Failed to initialize Google OAuth client");
  }
}

/**
 * Get an OAuth client for the specified provider
 */
export async function getOAuthClient(provider: OAuthProvider): Promise<Client> {
  switch (provider) {
    case "google":
      return initializeGoogleClient();
    default:
      throw new Error(`Unsupported OAuth provider: ${provider}`);
  }
}

/**
 * Generate a PKCE code verifier and challenge pair
 */
export function generatePKCE() {
  const codeVerifier = generators.codeVerifier();
  const codeChallenge = generators.codeChallenge(codeVerifier);
  return { codeVerifier, codeChallenge };
}
