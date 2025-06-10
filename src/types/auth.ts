import type { DirectusRole } from "./directus";

// Authentication related types
export interface SessionInfo {
  userId: string;
  sessionToken: string;
  ip: string;
  origin: string;
}

export interface AuthenticationContext {
  token: string;
  userAgent: string;
  ipAddress: string;
  origin: string;
}

export interface RoleMapping {
  [key: string]: DirectusRole | null;
}


// Role validation
export interface RoleValidationResult {
  isValid: boolean;
  mappedRole?: DirectusRole;
  error?: string;
}
