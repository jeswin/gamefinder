import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { verifyToken } from "./token-service.js";
import { findUserById } from "./user-service.js";

// Extend Express Request to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
      isAuthenticated?: boolean;
    }
  }
}

/**
 * Middleware to authenticate requests using JWT token from cookies
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.cookies[config.auth.cookies.accessToken];

    if (!token) {
      req.user = null;
      req.isAuthenticated = false;
      return next();
    }

    // Verify the token
    const payload = await verifyToken(token);

    // Get the user from the database
    const user = await findUserById(payload.sub);

    if (!user) {
      req.user = null;
      req.isAuthenticated = false;
      return next();
    }

    // Attach the user to the request
    req.user = user;
    req.isAuthenticated = true;
    next();
  } catch (error) {
    // Clear the invalid token
    res.clearCookie(config.auth.cookies.accessToken);
    req.user = null;
    req.isAuthenticated = false;
    next();
  }
}

/**
 * Middleware to require authentication for protected routes
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.isAuthenticated || !req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}
