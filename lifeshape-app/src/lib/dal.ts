import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { readSessionCookie } from "@/lib/session";
import { getSession, type SessionInfo } from "@/lib/classroomio/auth-client";

/**
 * Data Access Layer for the student session — see Next.js's own
 * authentication guide (Server Components / DAL section). Two flavors:
 *
 * - `getOptionalSession()`: never redirects. For routes that behave
 *   differently whether or not someone is logged in (the invite-accept
 *   page, the login page itself), but are valid to visit either way.
 * - `requireSession()`: redirects to /entrar when there's no valid session.
 *   For routes that only make sense while logged in.
 *
 * Both are `cache()`-wrapped so multiple calls within one render pass only
 * hit ClassroomIO once. Etapa 1 scope note: today only these two functions
 * and the auth flows themselves enforce a real (server-verified) session —
 * the rest of the student area (home, cursos, jornada, ...) still renders
 * static mock data (see src/lib/data.ts) and doesn't call this yet. Wire
 * `requireSession()` into each of those as real per-student data replaces
 * the mock data in Etapa 2+, per Next.js's own guidance to check as close
 * to the data source as possible rather than relying on the layout alone.
 */

export const getOptionalSession = cache(async (): Promise<{ token: string; info: SessionInfo } | null> => {
  const cookie = await readSessionCookie();
  if (!cookie) return null;

  const info = await getSession(cookie.classroomioToken).catch(() => null);
  if (!info) return null;

  return { token: cookie.classroomioToken, info };
});

export const requireSession = cache(async (): Promise<{ token: string; info: NonNullable<SessionInfo> }> => {
  const session = await getOptionalSession();
  if (!session || !session.info) {
    redirect("/entrar");
  }

  return { token: session.token, info: session.info };
});
