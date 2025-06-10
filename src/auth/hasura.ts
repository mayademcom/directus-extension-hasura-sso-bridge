import type { HasuraJWTPayload, HasuraUserInfo } from "../types/hasura";

import { HasuraAuthError } from "../types/errors";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";

/**
 * Processes and validates Hasura JWT token, extracts user information
 */
export function processHasuraToken(token: string): HasuraUserInfo {
  if (!token) {
    throw new HasuraAuthError("Token is required");
  }

  if (!process.env.HASURA_ADMIN_JWT_SECRET) {
    logger.error("Hasura JWT secret not configured");
    throw new HasuraAuthError("Hasura authentication not configured");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.HASURA_ADMIN_JWT_SECRET
    ) as HasuraJWTPayload;

    return extractUserInfo(decoded);
  } catch (error) {
    logger.error("Hasura token verification failed", error);
    throw new HasuraAuthError("Invalid or expired Hasura token");
  }
}

/**
 * Extracts user information from decoded Hasura JWT payload
 */
export function extractUserInfo(decoded: HasuraJWTPayload): HasuraUserInfo {
  try {
    const hasuraClaims = decoded["https://hasura.io/jwt/claims"];

    if (!hasuraClaims) {
      throw new HasuraAuthError("Missing Hasura claims in token");
    }

    const userId = hasuraClaims["x-hasura-user-id"];
    const hasuraRole =
      hasuraClaims["x-hasura-role"] ?? hasuraClaims["x-hasura-default-role"];
    const email = decoded.email;
    const firstName = decoded.first_name;
    const lastName = decoded.last_name;

    if (!userId || !hasuraRole) {
      throw new HasuraAuthError("Missing required user claims");
    }

    return {
      userId,
      hasuraRole,
      email,
      firstName,
      lastName,
    };
  } catch (error) {
    if (error instanceof HasuraAuthError) {
      throw error;
    }

    logger.error("User info extraction failed", error);
    throw new HasuraAuthError("Failed to extract user information");
  }
}

/**
 * Validates Hasura token without extracting user info
 */
export function validateHasuraToken(token: string): boolean {
  try {
    if (!process.env.HASURA_ADMIN_JWT_SECRET) {
      return false;
    }

    jwt.verify(token, process.env.HASURA_ADMIN_JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}
