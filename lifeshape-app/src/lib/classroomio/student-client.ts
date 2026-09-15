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

// --- Etapa 4: avaliações/exercícios + estágio (horas complementares) ---

// Only the question types this app knows how to render (see exercise-panel.tsx).
// The exercise engine itself (classroomiols) supports more — an exercise mixing
// in one of those still loads fine, that one question just falls back to a
// "tipo não suportado" notice instead of blocking the rest.
export type SupportedQuestionType =
  | "RADIO"
  | "CHECKBOX"
  | "TRUE_FALSE"
  | "SHORT_ANSWER"
  | "NUMERIC"
  | "TEXTAREA"
  | "FILE_UPLOAD";

export type ExerciseOption = { id: number; label: string };

export type ExerciseQuestion = {
  id: number;
  title: string;
  questionTypeId: number;
  questionType: string;
  points: number;
  order: number | null;
  options: ExerciseOption[];
};

export type ExerciseAnswerData =
  | { type: "RADIO"; optionId: number }
  | { type: "CHECKBOX"; optionIds: number[] }
  | { type: "TRUE_FALSE"; value: boolean }
  | { type: "SHORT_ANSWER"; text: string }
  | { type: "NUMERIC"; value: number }
  | { type: "TEXTAREA"; text: string }
  | { type: "FILE_UPLOAD"; fileKey: string; fileName: string; mimeType?: string; size?: number }
  | { type: string; [key: string]: unknown };

export type ExerciseSubmission = {
  id: string;
  gradingState: "queued" | "processing" | "awaiting_manual" | "completed" | "failed";
  overallStatus: "auto_graded" | "manual_required" | "hybrid";
  total: number | null;
  approvedWeeks: number | null;
  feedback: string | null;
  createdAt: string | null;
  answers: { questionId: number; answerData: ExerciseAnswerData | null; point: number | null }[];
};

export type LessonExercise = {
  id: string;
  title: string;
  description: string | null;
  dueBy: string | null;
  allowMultipleAttempts: boolean;
  passThreshold: number | null;
  questions: ExerciseQuestion[];
  submissions: ExerciseSubmission[];
};

// Wire shape the backend expects for one answer — see
// packages/utils/src/validation/exercise/exercise.ts ZPublicExerciseAnswer
// (classroomiols) and answer-codecs.ts, which this mirrors client-side since
// this app can't import that internal package directly.
export type ExerciseAnswerInput = { questionId: number; optionId?: number; answer?: string };

/** Encodes one answer into the flat wire shape the submit endpoint expects — mirrors classroomiols' answer-codecs.ts for the question types this app renders. */
export function encodeExerciseAnswer(
  questionId: number,
  data:
    | { type: "RADIO"; optionId: number }
    | { type: "CHECKBOX"; optionIds: number[] }
    | { type: "TRUE_FALSE"; value: boolean }
    | { type: "SHORT_ANSWER" | "TEXTAREA"; text: string }
    | { type: "NUMERIC"; value: number }
    | { type: "FILE_UPLOAD"; fileKey: string; fileName: string; mimeType?: string; size?: number },
): ExerciseAnswerInput {
  switch (data.type) {
    case "RADIO":
      return { questionId, optionId: data.optionId };
    case "CHECKBOX":
      return { questionId, answer: JSON.stringify({ type: "CHECKBOX", optionIds: data.optionIds }) };
    case "TRUE_FALSE":
      return { questionId, answer: String(data.value) };
    case "SHORT_ANSWER":
    case "TEXTAREA":
      return { questionId, answer: data.text };
    case "NUMERIC":
      return { questionId, answer: JSON.stringify({ type: "NUMERIC", value: data.value }) };
    case "FILE_UPLOAD":
      return {
        questionId,
        answer: JSON.stringify({
          fileKey: data.fileKey,
          fileName: data.fileName,
          mimeType: data.mimeType,
          size: data.size,
        }),
      };
  }
}

/** This lesson's (non-internship) exercises, sanitized, with the current student's own submission history. */
export function getMyLessonExercises(token: string, lessonId: string) {
  return request<LessonExercise[]>(`/public-api/student/lessons/${encodeURIComponent(lessonId)}/exercises`, token);
}

/** Submits the current student's answers to a lesson exercise. */
export function submitMyExercise(token: string, exerciseId: string, answers: ExerciseAnswerInput[]) {
  return request<ExerciseSubmission>(`/public-api/student/exercises/${encodeURIComponent(exerciseId)}/submit`, token, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
}

export type InternshipOverview =
  | { configured: false }
  | {
      configured: true;
      exercise: { id: string; title: string; description: string | null };
      submissions: ExerciseSubmission[];
      totalApprovedWeeks: number;
    };

/** Internship (horas complementares) submissions and approved-weeks total for the current student in a course. */
export function getMyInternship(token: string, courseId: string) {
  return request<InternshipOverview>(`/public-api/student/courses/${encodeURIComponent(courseId)}/internship`, token);
}

/** Submits an internship report (text + proof document already uploaded via requestDocumentUploadUrl) for the current student. */
export function submitMyInternshipReport(
  token: string,
  courseId: string,
  input: { reportText: string; fileKey: string; fileName: string; mimeType?: string; size?: number },
) {
  return request<ExerciseSubmission>(
    `/public-api/student/courses/${encodeURIComponent(courseId)}/internship/submit`,
    token,
    { method: "POST", body: JSON.stringify(input) },
  );
}

/** Presigned upload URL for a document the student is about to submit (e.g. comprovante de estágio). The browser then PUTs the file bytes straight to that URL. */
export function requestDocumentUploadUrl(token: string, fileName: string, fileType: string, fileSize?: number) {
  return request<{ url: string; fileKey: string }>("/public-api/student/uploads/document", token, {
    method: "POST",
    body: JSON.stringify({ fileName, fileType, fileSize }),
  });
}
