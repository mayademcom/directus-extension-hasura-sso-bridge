import { COOKIE_OPTIONS, SESSION_DURATION_SECONDS } from "../utils/constants";
import { CookieError, TokenGenerationError } from "../types/errors";

import type { DirectusJWTPayload } from "../types/directus";
import type { Response } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";
import { randomBytes } from "crypto";

/**
 * Signs a Directus JWT token with user and session information
 */
export function signDirectusToken(
  userId: string,
  roleId: string,
  sessionToken: string
): string {
  try {
    if (!process.env.SECRET) {
      throw new TokenGenerationError("Directus SECRET not configured");
    }

    const payload: DirectusJWTPayload = {
      id: userId,
      role: roleId,
      app_access: true,
      admin_access: true,
      session: sessionToken,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
      iss: "directus",
    };

    const token = jwt.sign(payload, process.env.SECRET);
    logger.success("Directus JWT token signed");

    return token;
  } catch (error) {
    logger.error("Directus JWT signing failed", error);

    if (error instanceof TokenGenerationError) {
      throw error;
    }

    throw new TokenGenerationError("JWT signing failed");
  }
}

/**
 * Generates a cryptographically secure session token
 */
export function generateSessionToken(): string {
  try {
    return randomBytes(32).toString("base64url");
  } catch (error) {
    logger.error("Session token generation failed", error);
    throw new TokenGenerationError("Session token generation failed");
  }
}

/**
 * Saves Directus session token as HTTP-only cookie
 */
export function saveDirectusToken(res: Response, directusToken: string): void {
  try {
    res.cookie("directus_session_token", directusToken, COOKIE_OPTIONS);
  } catch (error) {
    logger.error("Cookie save failed", error);
    throw new CookieError("Cookie save operation failed");
  }
}

/**
 * Generates a random password for auto-created users
 */
export function generateRandomPassword(): string {
  return (
    Math.random().toString(36).slice(-12) +
    Math.random().toString(36).slice(-12)
  );
}
