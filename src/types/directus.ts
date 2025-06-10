// Directus JWT Types
export interface DirectusJWTPayload {
  id: string;
  role: string;
  app_access: boolean;
  admin_access: boolean;
  session: string;
  iat: number;
  exp: number;
  iss: string;
}

// Directus Session Types
export interface DirectusSessionData {
  token: string;
  user: string;
  expires: Date;
  ip: string;
  user_agent: string;
  origin: string;
}

export interface DirectusUserData {
  userId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roleId: string;
}

// Directus Service Types
export interface DirectusServicesContext {
  usersService: any; // TODO: Add proper Directus types when available
  rolesService: any;
  database: any;
}

// Directus specific types
export type DirectusRole = "Administrator" | "Editor" | "User";

export interface DirectusUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  external_identifier?: string;
}

export interface DirectusRoleQueryResult {
  id: string;
  name: string;
  description?: string;
}
