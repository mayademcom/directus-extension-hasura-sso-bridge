// Hasura JWT Types
export interface HasuraJWTClaims {
  "x-hasura-user-id": string;
  "x-hasura-default-role": string;
  "x-hasura-role"?: string;
  "x-hasura-allowed-roles": string[];
}

export interface HasuraJWTPayload {
  sub: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  "https://hasura.io/jwt/claims": HasuraJWTClaims;
  iat: number;
  exp: number;
}

export interface HasuraUserInfo {
  userId: string;
  hasuraRole: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

// Hasura specific types
export type HasuraRole = "super_admin" | "editor" | "user";

export interface HasuraTokenValidationResult {
  isValid: boolean;
  userInfo?: HasuraUserInfo;
  error?: string;
}
