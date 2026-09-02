import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "turbe_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

export type AdminSession = {
  expiresAt: number;
  username: string;
};

type AdminAuthConfig = {
  password: string;
  secret: string;
  username: string;
};

function getAdminAuthConfig(): AdminAuthConfig | null {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!username || !password || !secret || secret.length < 32) {
    return null;
  }

  return { password, secret, username };
}

export function isAdminAuthConfigured() {
  return getAdminAuthConfig() !== null;
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createAdminSessionToken(username: string) {
  const config = getAdminAuthConfig();

  if (!config) {
    return null;
  }

  const payload = Buffer.from(
    JSON.stringify({
      expiresAt: Date.now() + ADMIN_SESSION_MAX_AGE * 1000,
      username,
    }),
  ).toString("base64url");

  return `${payload}.${sign(payload, config.secret)}`;
}

export function verifyAdminCredentials(username: string, password: string) {
  const config = getAdminAuthConfig();

  if (!config) {
    return { configured: false, ok: false };
  }

  return {
    configured: true,
    ok:
      safeEqual(username, config.username) &&
      safeEqual(password, config.password),
  };
}

export function readAdminSessionToken(value: string | undefined) {
  const config = getAdminAuthConfig();

  if (!config || !value) {
    return null;
  }

  const [payload, signature, ...extraParts] = value.split(".");

  if (!payload || !signature || extraParts.length > 0) {
    return null;
  }

  if (!safeEqual(signature, sign(payload, config.secret))) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as Partial<AdminSession>;

    if (
      session.username !== config.username ||
      typeof session.expiresAt !== "number" ||
      session.expiresAt <= Date.now()
    ) {
      return null;
    }

    return {
      expiresAt: session.expiresAt,
      username: session.username,
    };
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return readAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}
