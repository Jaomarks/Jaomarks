import "server-only";

// Server-only client for ClassroomIO's public API (/public-api/v1). The
// bearer key is an organization-wide credential — it must never reach the
// browser. The `server-only` import above makes any accidental client-side
// import a build error rather than a leaked secret.
//
// Etapa 0: proves the connection works (listCourses/listAudience). Later
// etapas add the endpoints ClassroomIO doesn't expose yet (attendance,
// grading, certificates — see PROJECT_PLAN.md).

const BASE_URL = process.env.CLASSROOMIO_API_URL;
const API_KEY = process.env.CLASSROOMIO_API_KEY;

export class ClassroomIOError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ClassroomIOError";
  }
}

type Envelope<T> =
  | { success: true; data: T; pagination?: unknown }
  | { success: false; error: string; code?: string };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!BASE_URL || !API_KEY) {
    throw new Error(
      "CLASSROOMIO_API_URL and CLASSROOMIO_API_KEY must be set (see .env.example) — " +
        "this client only works from the server.",
    );
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    // Real-time org data — no implicit caching for now. Revisit per etapa
    // once we know which of these responses are safe to cache and for how long.
    cache: "no-store",
  });

  if (res.status === 429) {
    throw new ClassroomIOError("Rate limited by the ClassroomIO API — back off and retry.", 429);
  }

  const body = (await res.json().catch(() => null)) as Envelope<T> | null;

  if (!res.ok || !body || !body.success) {
    const message = body && !body.success ? body.error : `ClassroomIO API error (HTTP ${res.status})`;
    const code = body && !body.success ? body.code : undefined;
    throw new ClassroomIOError(message, res.status, code);
  }

  return body.data;
}

type Pagination = { page?: number; limit?: number };

function toQuery(params?: Pagination): string {
  if (!params) return "";
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  const s = qs.toString();
  return s ? `?${s}` : "";
}

// Shapes are intentionally loose (`unknown`-leaning) until Etapa 2, when we
// wire real course/lesson rendering and can nail down the exact response
// contract against the live API rather than guessing at it here.
export type ClassroomIOCourse = Record<string, unknown>;
export type ClassroomIOAudienceMember = Record<string, unknown>;

export function listCourses(params?: Pagination) {
  return request<ClassroomIOCourse[]>(`/public-api/v1/courses${toQuery(params)}`);
}

export function listAudience(params?: Pagination) {
  return request<ClassroomIOAudienceMember[]>(`/public-api/v1/audience${toQuery(params)}`);
}
