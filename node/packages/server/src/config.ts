import dotenv from "dotenv";

dotenv.config();

// Define the application configuration interface
interface Config {
  port: number;
  baseUrl: string;
  frontendUrl: string;
  environment: string;
  auth: {
    google: {
      clientId: string;
      clientSecret: string;
      redirectUri: string;
    };
    jwt: {
      secret: string;
      expiresIn: string;
    };
    cookies: {
      accessToken: string;
      refreshToken: string;
      options: {
        httpOnly: boolean;
        secure: boolean;
        sameSite: boolean | "lax" | "strict" | "none";
        maxAge: number;
        domain?: string;
        path: string;
      };
    };
  };
}

// Check if we're in development mode
const environment = process.env.NODE_ENV || "development";
const isDevelopment = environment !== "production";

// Read config from environment variables with sensible defaults
export const config: Config = {
  port: parseInt(process.env.PORT || "3001", 10),
  baseUrl: process.env.BASE_URL || (isDevelopment 
    ? "http://localhost:3001" 
    : "https://api.gamefinder.org"),
  frontendUrl: process.env.FRONTEND_URL || (isDevelopment 
    ? "http://localhost:3000" 
    : "https://www.gamefinder.org"),
  environment,
  auth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirectUri:
        process.env.GOOGLE_REDIRECT_URI ||
        (isDevelopment 
          ? "http://localhost:3001/auth/google/callback" 
          : "https://www.gamefinder.org/auth/google/callback"),
    },
    jwt: {
      secret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
    cookies: {
      accessToken: "access_token",
      refreshToken: "refresh_token",
      options: {
        httpOnly: true,
        secure: !isDevelopment, // Only use secure in production
        sameSite: isDevelopment ? "lax" : "none", // Use lax in development, none in production
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        domain: process.env.COOKIE_DOMAIN || (isDevelopment ? "localhost" : undefined),
        path: "/", // Cookie available for all paths
      },
    },
  },
};

// Validate critical configuration
if (!config.auth.google.clientId || !config.auth.google.clientSecret) {
  console.warn(
    "Google OAuth credentials not configured. Authentication will not work properly."
  );
}

if (
  config.auth.jwt.secret === "your-secret-key-change-in-production" &&
  process.env.NODE_ENV === "production"
) {
  console.error(
    "WARNING: You are using the default JWT secret in production mode!"
  );
}