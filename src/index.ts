import type { DirectusUserData, HasuraUserInfo, SessionInfo } from "./types";
import type { Request, Response, Router } from "express";
import { ensureDirectusUser, getDirectusRoleId } from "./services/user";
import {
  generateSessionToken,
  saveDirectusToken,
  signDirectusToken,
} from "./auth/directus";
import { getClientIP, getOrigin } from "./utils/request";

import { ROLE_MAPPING } from "./config/roles";
import { createSession } from "./services/session";
import { getDirectusServices } from "./services/directus";
import { logger } from "./utils/logger";
import { processHasuraToken } from "./auth/hasura";
import { validateAndMapRole } from "./services/role";

export default {
  id: "hasura-sso-bridge",
  handler: (router: Router, context: any) => {
    // Main SSO authentication endpoint
    router.get("/", async (req: Request, res: Response): Promise<void> => {
      try {
        logger.info("SSO authentication initiated");

        // Initialize services
        const services = await getDirectusServices(context);

        // Process Hasura authentication
        const userInfo: HasuraUserInfo = processHasuraToken(
          req.query.token as string
        );

        // Validate and map role
        const roleValidation = validateAndMapRole(userInfo.hasuraRole);
        if (!roleValidation.isValid || !roleValidation.mappedRole) {
          throw new Error(
            roleValidation.error ||
              `Invalid Directus role: ${userInfo.hasuraRole}`
          );
        }

        // Get Directus role ID
        const directusRoleId = await getDirectusRoleId(
          roleValidation.mappedRole,
          services
        );

        // Prepare user data
        const userData: DirectusUserData = {
          userId: userInfo.userId,
          email: userInfo.email,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          roleId: directusRoleId,
        };

        // Ensure user exists in Directus
        await ensureDirectusUser(userData, services);

        // Generate session token
        const sessionToken = generateSessionToken();

        // Prepare session info
        const sessionInfo: SessionInfo = {
          userId: userInfo.userId,
          sessionToken,
          ip: getClientIP(req),
          origin: getOrigin(req),
        };

        // Create session in database
        await createSession(sessionInfo, services.database);

        // Sign Directus JWT token
        const directusToken = signDirectusToken(
          userInfo.userId,
          directusRoleId,
          sessionToken
        );

        // Save token as cookie
        saveDirectusToken(res, directusToken);

        // Redirect to admin panel
        logger.success("SSO authentication completed, redirecting to admin");
        res.redirect("/admin/content");
      } catch (error) {
        logger.error("SSO authentication failed", error);
        res.status(403).json({
          error: "Access denied",
        });
      }
    });

    // Health check endpoint
    router.get(
      "/health",
      async (_req: Request, res: Response): Promise<void> => {
        try {
          res.json({
            status: "healthy",
            service: "hasura-sso-bridge",
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          logger.error("Health check failed", error);
          if (!res.headersSent) {
            res.status(500).json({ error: "Health check failed" });
          }
        }
      }
    );

    // Configuration endpoint
    router.get(
      "/config",
      async (_req: Request, res: Response): Promise<void> => {
        try {
          res.json({
            supportedRoles: Object.keys(ROLE_MAPPING),
            environment: process.env.NODE_ENV,
            features: ["jwt-auth", "role-mapping", "auto-provisioning"],
          });
        } catch (error) {
          logger.error("Config endpoint failed", error);
          res.status(500).json({ error: "Configuration unavailable" });
        }
      }
    );
  },
};
