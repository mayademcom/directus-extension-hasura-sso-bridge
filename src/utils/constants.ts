export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
export const SESSION_DURATION_SECONDS = 24 * 60 * 60; // 24 hours

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: SESSION_DURATION_MS,
  path: "/",
};

export const USER_AGENT = "hasura-admin-auto-login-extension";

export const DEFAULT_IP = "127.0.0.1";
export const DEFAULT_ORIGIN = "unknown";
