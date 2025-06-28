import * as client from "openid-client";
import { config } from "../config.js";

// Type definition for our OAuth providers
export type OAuthProvider = "google";

// Cache for OAuth clients
const clients: Record<OAuthProvider, client.Configuration | null> = {
    google: null,
};

/**
 * Initialize Google OAuth client
 */
export async function initializeGoogleClient(): Promise<client.Configuration> {
    if (clients.google) {
        return clients.google;
    }

    try {
        const configuration = await client.discovery(
            new URL("https://accounts.google.com"),
            config.auth.google.clientId,
            config.auth.google.clientSecret
        );
        clients.google = configuration;
        return configuration;
    } catch (error) {
        console.error("Failed to initialize Google OAuth client:", error);
        throw new Error("Failed to initialize Google OAuth client");
    }
}

/**
 * Get an OAuth client for the specified provider
 */
export async function getOAuthClient(provider: OAuthProvider): Promise<client.Configuration> {
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
export async function generatePKCE() {
    const codeVerifier = client.randomPKCECodeVerifier();
    const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);
    return { codeVerifier, codeChallenge };
}