const SESSION_DURATION_HOURS = parseInt(
  process.env.SESSION_DURATION_HOURS ?? "24",
  10
);

export const SESSION_DURATION_MS = SESSION_DURATION_HOURS * 60 * 60 * 1000;
export const SESSION_DURATION_SECONDS = SESSION_DURATION_HOURS * 60 * 60;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: SESSION_DURATION_MS,
  path: "/",
};

export const USER_AGENT = "directus-extension-hasura-sso-bridge";

export const DEFAULT_IP = "127.0.0.1";
export const DEFAULT_ORIGIN = "unknown";
