import type {
  DirectusServicesContext,
  DirectusUser,
  DirectusUserData,
} from "../types/directus";

import { UserManagementError } from "../types/errors";
import { generateRandomPassword } from "../auth/directus";
import { logger } from "../utils/logger";

/**
 * Ensures user exists in Directus, creates if necessary
 */
export async function ensureDirectusUser(
  userData: DirectusUserData,
  services: DirectusServicesContext
): Promise<DirectusUser> {
  try {
    const existingUser = await getUserById(userData.userId, services);
    if (existingUser) {
      return existingUser;
    }

    logger.info("Creating new Directus user");
    const newUser = await createDirectusUser(userData, services);
    logger.success("Directus user created successfully");
    return newUser;
  } catch (error) {
    logger.error("User management failed", error);
    throw new UserManagementError("Failed to ensure user exists");
  }
}

/**
 * Retrieves user by ID from Directus
 */
export async function getUserById(
  userId: string,
  services: DirectusServicesContext
): Promise<DirectusUser | null> {
  try {
    const user = await services.usersService.readOne(userId);
    return user;
  } catch {
    return null;
  }
}

/**
 * Creates a new user in Directus
 */
export async function createDirectusUser(
  userData: DirectusUserData,
  services: DirectusServicesContext
): Promise<DirectusUser> {
  try {
    const newUserData = {
      id: userData.userId,
      email: userData.email,
      first_name: userData.firstName,
      last_name: userData.lastName,
      role: userData.roleId,
      status: "active" as const,
      password: generateRandomPassword(),
      external_identifier: userData.userId,
    };

    return await services.usersService.createOne(newUserData);
  } catch (error) {
    logger.error("Directus User creation failed", error);
    throw new UserManagementError("Failed to create user in Directus");
  }
}

/**
 * Gets Directus role ID by role name
 */
export async function getDirectusRoleId(
  roleName: string,
  services: DirectusServicesContext
): Promise<string> {
  try {
    const roles = await services.rolesService.readByQuery({
      filter: {
        name: {
          _eq: roleName,
        },
      },
    });

    const roleId: string | undefined = roles[0]?.id;
    if (!roleId) {
      logger.error("Directus role not found", { roleName });
      throw new UserManagementError(`Role '${roleName}' not found`);
    }

    return roleId;
  } catch (error) {
    if (error instanceof UserManagementError) {
      throw error;
    }

    logger.error("Role lookup failed", error);
    throw new UserManagementError("Failed to lookup role");
  }
}
