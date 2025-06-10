export class SSOBridgeError extends Error {
  constructor(message: string, public code: string, public context?: any) {
    super(message);
    this.name = "SSOBridgeError";
  }
}

export class TokenGenerationError extends SSOBridgeError {
  constructor(message: string, context?: any) {
    super(message, "TOKEN_GENERATION_FAILED", context);
    this.name = "TokenGenerationError";
  }
}

export class CookieError extends SSOBridgeError {
  constructor(message: string, context?: any) {
    super(message, "COOKIE_OPERATION_FAILED", context);
    this.name = "CookieError";
  }
}

export class HasuraAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HasuraAuthError";
  }
}

export class RoleValidationError extends Error {
  constructor(message: string, public hasuraRole: string) {
    super(message);
    this.name = "RoleValidationError";
  }
}

export class SessionError extends SSOBridgeError {
  constructor(message: string, context?: any) {
    super(message, "SESSION_OPERATION_FAILED", context);
    this.name = "SessionError";
  }
}

export class UserManagementError extends SSOBridgeError {
  constructor(message: string, context?: any) {
    super(message, "USER_MANAGEMENT_FAILED", context);
    this.name = "UserManagementError";
  }
}
