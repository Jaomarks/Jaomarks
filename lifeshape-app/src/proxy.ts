import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { decryptSessionCookie, SESSION_COOKIE_NAME } from "@/lib/session";

// Optimistic-only check (cookie decrypt, no ClassroomIO call) — see Next.js's
// authentication guide. The real, server-verified check lives in
// src/lib/dal.ts (requireSession) and runs in the pages/actions themselves;
// this only pre-filters the obvious case (no cookie at all) so a logged-out
// visitor doesn't even reach a protected page. Never trust this alone.
const PROTECTED_PREFIXES = ["/home", "/cursos", "/jornada", "/conquistas", "/comunidade", "/loja"];

// The persona picker (root) also requires a session, but has its own exact
// match (no sub-paths).
function isProtected(pathname: string): boolean {
  if (pathname === "/") return true;
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

// Already-logged-in visitors shouldn't see the login screen again.
const REDIRECT_IF_AUTHED = ["/entrar"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await decryptSessionCookie(cookie);

  if (isProtected(pathname) && !session) {
    return NextResponse.redirect(new URL("/entrar", request.url));
  }

  if (REDIRECT_IF_AUTHED.includes(pathname) && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon).*)"],
};
