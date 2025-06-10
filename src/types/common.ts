import type { Request } from "express";

export interface CustomRequest extends Request {
  userInfo?: any;
  sessionInfo?: any;
}

export interface ErrorResponse {
  error: string;
  message?: string;
  code?: string;
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
}

// Environment types
export interface EnvironmentConfig {
  NODE_ENV: string;
  SECRET: string;
  HASURA_ADMIN_JWT_SECRET: string;
}

// Cookie configuration
export interface CookieConfig {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "strict" | "lax" | "none";
  maxAge: number;
  path: string;
}

// Request metadata
export interface RequestMetadata {
  ip: string;
  userAgent: string;
  origin: string;
  timestamp: Date;
}
