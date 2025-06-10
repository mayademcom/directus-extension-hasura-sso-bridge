import { SESSION_DURATION_MS, USER_AGENT } from "../utils/constants";

import type { DirectusSessionData } from "../types/directus";
import { SessionError } from "../types/errors";
import type { SessionInfo } from "../types";
import { logger } from "../utils/logger";

/**
 * Creates a new session record in Directus database
 */
export async function createSession(
  sessionInfo: SessionInfo,
  database: any
): Promise<void> {
  try {
    const sessionData: Omit<DirectusSessionData, "expires"> & {
      expires: Date;
    } = {
      token: sessionInfo.sessionToken,
      user: sessionInfo.userId,
      expires: new Date(Date.now() + SESSION_DURATION_MS),
      ip: sessionInfo.ip,
      user_agent: USER_AGENT,
      origin: sessionInfo.origin,
    };

    await database("directus_sessions").insert(sessionData);
    logger.success("Session created");
  } catch (error) {
    logger.error("Session creation failed", error);
    throw new SessionError("Failed to create session in database");
  }
}

/**
 * Deletes a session record from Directus database
 */
export async function deleteSession(
  sessionToken: string,
  database: any
): Promise<void> {
  try {
    const deletedCount = await database("directus_sessions")
      .where("token", sessionToken)
      .del();

    if (deletedCount === 0) {
      logger.warning("Session not found for deletion");
    } else {
      logger.success("Session deleted");
    }
  } catch (error) {
    logger.error("Session deletion failed", error);
    throw new SessionError("Failed to delete session from database");
  }
}

/**
 * Cleans up expired sessions from database
 */
export async function cleanExpiredSessions(database: any): Promise<void> {
  try {
    const deletedCount = await database("directus_sessions")
      .where("expires", "<", new Date())
      .del();

    if (deletedCount > 0) {
      logger.info(`Cleaned up ${deletedCount} expired sessions`);
    }
  } catch (error) {
    logger.error("Session cleanup failed", error);
    throw new SessionError("Failed to clean expired sessions");
  }
}
