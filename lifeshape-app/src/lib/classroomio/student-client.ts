import "server-only";

// Server-only client for ClassroomIO's student-facing course API
// (/public-api/student/*, apps/api/src/routes/public-student.ts) —
// sibling to auth-client.ts, same access posture (bearer session token,
// no organization API key). See PROJECT_PLAN.md — Etapa 2.

const BASE_URL = process.env.CLASSROOMIO_API_URL;

export class ClassroomIOStudentError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ClassroomIOStudentError";
  }
}

type Envelope<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

async function request<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  if (!BASE_URL) {
    throw new Error("CLASSROOMIO_API_URL must be set (see .env.example).");
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
    cache: "no-store",
  });

  const body = (await res.json().catch(() => null)) as Envelope<T> | null;

  if (!res.ok || !body || !body.success) {
    const message = body && !body.success ? body.error : `Erro inesperado (HTTP ${res.status}).`;
    const code = body && !body.success ? body.code : undefined;
    throw new ClassroomIOStudentError(message, res.status, code);
  }

  return body.data;
}

export type StudentCourseSummary = {
  id: string;
  title: string;
  description: string;
  slug: string | null;
  lessonCount: number;
  progressPercent: number;
  certificateEarnedAt: string | null;
};

// Mirrors ContentType in classroomiols (packages/utils/src/constants/content.ts).
export type CourseContentItemType = "SECTION" | "LESSON" | "EXERCISE";

export type CourseContentItem = {
  id: string;
  type: CourseContentItemType;
  title: string;
  order: number | null;
  sectionId: string | null;
  isUnlocked: boolean | null;
  isComplete: boolean | null;
};

export type CourseContentSection = {
  id: string;
  title: string;
  order: number | null;
  items: CourseContentItem[];
};

export type StudentCourseDetail = {
  id: string;
  title: string;
  description: string;
  slug: string | null;
  grouped: boolean;
  sections: CourseContentSection[];
  items: CourseContentItem[];
};

export type LessonVideo = {
  type: "youtube" | "vimeo" | "generic" | "upload" | "google_drive";
  link: string;
  fileName?: string;
  metadata?: { duration?: number; thumbnailUrl?: string };
};

export type LessonDocument = {
  type: string;
  name: string;
  link: string;
  size?: number;
};

export type StudentLesson = {
  id: string;
  courseId: string;
  sectionId: string | null;
  title: string;
  note: string | null;
  videoUrl: string | null;
  videos: LessonVideo[] | null;
  documents: LessonDocument[] | null;
  completionPolicy: string;
  order: number | null;
  completion: { isComplete: boolean } | null;
  watchProgress: unknown | null;
};

export type LessonCompletion = { isComplete: boolean };

// --- Etapa 3: presença ---

export type CheckinMethod = "self_button" | "qr_code" | "manual_desk";

export type AttendanceRecord = {
  id: number;
  lessonId: string;
  isPresent: boolean;
  status: "pending" | "confirmed" | "rejected";
  method: CheckinMethod | null;
};

export type AttendanceSummary = {
  checkinMethods: CheckinMethod[];
  requiresApproval: boolean;
  currentStreak: number;
  longestStreak: number;
  lessons: {
    lessonId: string;
    title: string;
    lessonAt: string | null;
    status: "pending" | "confirmed" | "rejected" | null;
    isPresent: boolean;
    method: CheckinMethod | null;
  }[];
};

/** Courses the current student is enrolled in. */
export function listMyCourses(token: string) {
  return request<StudentCourseSummary[]>("/public-api/student/courses", token);
}

/** Course detail: sections, lessons, and completion for the current student. */
export function getMyCourseDetail(token: string, courseId: string) {
  return request<StudentCourseDetail>(`/public-api/student/courses/${encodeURIComponent(courseId)}`, token);
}

/** Lesson detail, completion, and watch progress for the current student. */
export function getMyLesson(token: string, lessonId: string) {
  return request<StudentLesson>(`/public-api/student/lessons/${encodeURIComponent(lessonId)}`, token);
}

/** Marks a lesson complete or incomplete for the current student. */
export function setLessonCompletion(token: string, lessonId: string, isComplete: boolean) {
  return request<LessonCompletion>(`/public-api/student/lessons/${encodeURIComponent(lessonId)}/completion`, token, {
    method: "POST",
    body: JSON.stringify({ isComplete }),
  });
}

/** Attendance config, streak, and per-lesson status for the current student in a course. */
export function getMyAttendance(token: string, courseId: string) {
  return request<AttendanceSummary>(`/public-api/student/courses/${encodeURIComponent(courseId)}/attendance`, token);
}

/** Confirms the current student's own presence at a lesson (self_button or qr_code — never manual_desk, that's staff-only). */
export function confirmMyAttendance(
  token: string,
  courseId: string,
  lessonId: string,
  method: "self_button" | "qr_code",
  qrPayload?: string,
) {
  return request<AttendanceRecord>(
    `/public-api/student/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}/attendance`,
    token,
    { method: "POST", body: JSON.stringify({ method, qrPayload }) },
  );
}
