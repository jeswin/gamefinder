import { SignJWT, jwtVerify } from "jose";
import { config } from "../config.js";

// User interface - expand as needed
export interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  provider: "google" | string;
  providerUserId: string;
}

// Token payload interface
interface TokenPayload {
  sub: string;
  email?: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate a JWT access token for a user
 */
export async function generateAccessToken(user: User): Promise<string> {
  const secretKey = new TextEncoder().encode(config.auth.jwt.secret);

  const token = await new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(config.auth.jwt.expiresIn)
    .sign(secretKey);

  return token;
}

/**
 * Verify a JWT token and return the decoded payload
 */
export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    const secretKey = new TextEncoder().encode(config.auth.jwt.secret);
    const { payload } = await jwtVerify(token, secretKey);

    // Ensure we have at least the subject claim
    if (typeof payload.sub !== "string") {
      throw new Error("Invalid token payload");
    }

    return {
      sub: payload.sub,
      email: payload.email as string | undefined,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Invalid or expired token");
  }
}
