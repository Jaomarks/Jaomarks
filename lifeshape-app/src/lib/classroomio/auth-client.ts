import "server-only";

// Server-only client for ClassroomIO's student-facing auth API
// (/public-api/auth/*, apps/api/src/routes/public-auth.ts) — deliberately
// separate from client.ts, which authenticates with the organization API
// key and has nothing to do with a specific student's identity. See
// PROJECT_PLAN.md — Etapa 1.

const BASE_URL = process.env.CLASSROOMIO_API_URL;

export class ClassroomIOAuthError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ClassroomIOAuthError";
  }
}

type Envelope<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

async function request<T>(path: string, init?: RequestInit & { token?: string | null }): Promise<T> {
  if (!BASE_URL) {
    throw new Error("CLASSROOMIO_API_URL must be set (see .env.example).");
  }

  const { token, ...rest } = init ?? {};
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: { ...headers, ...rest.headers },
    cache: "no-store",
  });

  const body = (await res.json().catch(() => null)) as Envelope<T> | null;

  if (!res.ok || !body || !body.success) {
    const message = body && !body.success ? body.error : `Erro inesperado (HTTP ${res.status}).`;
    const code = body && !body.success ? body.code : undefined;
    throw new ClassroomIOAuthError(message, res.status, code);
  }

  return body.data;
}

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
};

export type SessionInfo = { user: AuthUser; persona: string | null } | null;

export type InvitePreview = {
  invite: { status: "ACTIVE" | "EXPIRED" | "USED_UP" | "REVOKED" };
  organization: { name: string };
  course: { title: string; description: string };
  inviteContext: { recipientEmail: string | null; recipientExists: boolean };
};

export function signIn(email: string, password: string) {
  return request<{ token: string }>("/public-api/auth/sign-in", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getSession(token: string) {
  return request<SessionInfo>("/public-api/auth/session", { token });
}

export function signOut(token: string) {
  return request<null>("/public-api/auth/sign-out", { method: "POST", token });
}

export function previewInvite(inviteToken: string) {
  return request<InvitePreview>(`/public-api/auth/invite/${encodeURIComponent(inviteToken)}`);
}

export function acceptInvite(input: { inviteToken: string; name?: string; password?: string; token?: string | null }) {
  const { token, ...body } = input;
  return request<{ token: string | null }>("/public-api/auth/accept-invite", {
    method: "POST",
    body: JSON.stringify(body),
    token,
  });
}

export function requestPasswordReset(email: string) {
  return request<null>("/public-api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(resetToken: string, newPassword: string) {
  return request<null>("/public-api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token: resetToken, newPassword }),
  });
}

export function savePersona(token: string, persona: string) {
  return request<{ persona: string }>("/public-api/auth/persona", {
    method: "POST",
    body: JSON.stringify({ persona }),
    token,
  });
}
