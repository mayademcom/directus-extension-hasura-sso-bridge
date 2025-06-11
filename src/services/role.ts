import { ROLE_MAPPING } from "../config/roles";
import { RoleValidationError } from "../types/errors";
import type { RoleValidationResult } from "../types/auth";
import { logger } from "../utils/logger";

export const ALLOWED_HASURA_ROLES = Object.keys(ROLE_MAPPING);

/**
 * Validates Hasura role and maps to Directus role
 */
export function validateAndMapRole(hasuraRole: string): RoleValidationResult {
  if (!hasuraRole) {
    logger.error("Role validation failed: empty role");
    return {
      isValid: false,
      mappedRole: undefined,
      error: "Role is required",
    };
  }

  const mappedRole = ROLE_MAPPING[hasuraRole];
  const isValid = mappedRole !== null && mappedRole !== undefined;

  if (!isValid) {
    logger.error("Role mapping failed", {
      hasuraRole,
      allowedRoles: ALLOWED_HASURA_ROLES,
    });
  }

  return {
    isValid,
    mappedRole: mappedRole ?? undefined,
    error: isValid ? undefined : `Unsupported role: ${hasuraRole}`,
  };
}

/**
 * Gets Directus role directly or throws error
 */
export function getDirectusRole(hasuraRole: string): string {
  const result = validateAndMapRole(hasuraRole);

  if (!result.isValid || !result.mappedRole) {
    throw new RoleValidationError(
      result.error ?? "Role validation failed",
      hasuraRole
    );
  }

  return result.mappedRole;
}

/**
 * Checks if Hasura role is supported
 */
export function isValidHasuraRole(hasuraRole: string): boolean {
  return ALLOWED_HASURA_ROLES.includes(hasuraRole);
}

/**
 * Gets list of supported roles for error messages
 */
export function getSupportedRoles(): string[] {
  return [...ALLOWED_HASURA_ROLES];
}
