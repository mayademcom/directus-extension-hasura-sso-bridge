import { DEFAULT_IP, DEFAULT_ORIGIN } from "./constants";

import type { Request } from "express";

export function getClientIP(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  const forwardedIP = Array.isArray(forwarded) ? forwarded[0] : forwarded;

  return (
    forwardedIP?.split(",")[0]?.trim() ??
    (req.headers["x-real-ip"] as string) ??
    (req.headers["cf-connecting-ip"] as string) ??
    (req as any).connection?.remoteAddress ??
    (req as any).socket?.remoteAddress ??
    req.ip ??
    DEFAULT_IP
  );
}

export function getOrigin(req: Request): string {
  return (
    req.headers.origin ??
    req.headers.referer ??
    `${req.protocol}://${req.get("host")}` ??
    DEFAULT_ORIGIN
  );
}

export function getUserAgent(req: Request): string {
  return req.headers["user-agent"] ?? "unknown";
}
