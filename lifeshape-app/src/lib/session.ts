import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// This app's own session cookie. Holds only the ClassroomIO bearer token
// (see PROJECT_PLAN.md — Etapa 1) — never the student's e-mail, name, or
// any other detail, per Next.js's own session guidance (keep the payload
// minimal). Encrypted with a secret that is NEVER shared with ClassroomIO:
// this cookie only makes sense to this app.
const COOKIE_NAME = "lifeshape_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days — matches ClassroomIO's own session.expiresIn (auth.ts)

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET?.trim();
  if (!secret) {
    throw new Error("SESSION_SECRET must be set (see .env.example).");
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  classroomioToken: string;
};

async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

/**
 * Returns null for anything invalid or expired — every caller treats that
 * the same as "not logged in", never as an error to surface.
 */
export async function decryptSessionCookie(cookieValue: string | undefined): Promise<SessionPayload | null> {
  if (!cookieValue) return null;

  try {
    const { payload } = await jwtVerify(cookieValue, getSecretKey(), { algorithms: ["HS256"] });
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
