import "server-only";

import { EncryptJWT, jwtDecrypt } from "jose";
import { cookies } from "next/headers";

// This app's own session cookie. Holds only the ClassroomIO bearer token
// (see PROJECT_PLAN.md — Etapa 1) — never the student's e-mail, name, or
// any other detail, per Next.js's own session guidance (keep the payload
// minimal). A JWE (genuinely encrypted, not just signed) with a secret that
// is NEVER shared with ClassroomIO: this cookie only makes sense to this
// app. httpOnly already keeps browser JS out and `secure` keeps it off
// plain HTTP in production, but the payload is a live bearer credential —
// encrypting it too means a copy of the raw cookie value on its own
// (a logging proxy, a cookie-reading browser extension, a DevTools
// screenshot) isn't enough to read that token back out.
const COOKIE_NAME = "lifeshape_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days — matches ClassroomIO's own session.expiresIn (auth.ts)
const JWE_ALG = "dir"; // direct use of the key below — no per-token key wrapping needed for a symmetric secret
const JWE_ENC = "A256GCM"; // needs a 32-byte key, exactly what SESSION_SECRET decodes to

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET?.trim();
  if (!secret) {
    throw new Error("SESSION_SECRET must be set (see .env.example).");
  }
  // SESSION_SECRET is base64 (see .env.example: `openssl rand -base64 32`)
  // — decode it back to the 32 raw bytes A256GCM requires, rather than
  // encoding the base64 *text* itself (which would be the wrong length and
  // throw at encrypt() time).
  const key = new Uint8Array(Buffer.from(secret, "base64"));
  if (key.byteLength !== 32) {
    throw new Error("SESSION_SECRET must decode (from base64) to exactly 32 bytes — generate with: openssl rand -base64 32");
  }
  return key;
}

export type SessionPayload = {
  classroomioToken: string;
};

async function encrypt(payload: SessionPayload): Promise<string> {
  return new EncryptJWT(payload)
    .setProtectedHeader({ alg: JWE_ALG, enc: JWE_ENC })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .encrypt(getSecretKey());
}

/**
 * Returns null for anything invalid or expired — every caller treats that
 * the same as "not logged in", never as an error to surface.
 */
export async function decryptSessionCookie(cookieValue: string | undefined): Promise<SessionPayload | null> {
  if (!cookieValue) return null;

  try {
    const { payload } = await jwtDecrypt(cookieValue, getSecretKey());
    if (typeof payload.classroomioToken !== "string" || !payload.classroomioToken) {
      return null;
    }
    return { classroomioToken: payload.classroomioToken };
  } catch {
    return null;
  }
}

/** Server Actions only — HTTP doesn't allow setting cookies after a page has started streaming. */
export async function createSession(classroomioToken: string): Promise<void> {
  const value = await encrypt({ classroomioToken });
  const store = await cookies();

  store.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function deleteSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Reads and decrypts the cookie from within a Server Component/Action. */
export async function readSessionCookie(): Promise<SessionPayload | null> {
  const store = await cookies();
  return decryptSessionCookie(store.get(COOKIE_NAME)?.value);
}

export { COOKIE_NAME as SESSION_COOKIE_NAME };
