"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/lib/dal";
import { ClassroomIOStudentError, confirmMyAttendance } from "@/lib/classroomio/student-client";
import type { AttendanceRecord } from "@/lib/classroomio/student-client";

export type ConfirmAttendanceResult = AttendanceRecord | { error: string };

export async function confirmAttendanceAction(
  courseSlug: string,
  courseId: string,
  lessonId: string,
  method: "self_button" | "qr_code",
  qrPayload?: string,
): Promise<ConfirmAttendanceResult> {
  const { token } = await requireSession();

  // A Server Action compiles to a public POST endpoint reachable directly
  // (devtools/fetch), not just through this file's own call sites — the
  // "self_button" | "qr_code" TS union is erased at runtime and enforces
  // nothing on its own. manual_desk is staff-only (the backend already
  // rejects it independently — see student-attendance.ts — but this stays
  // correct even if that ever changes, and fails closed for any other
  // unexpected value too).
  if (method !== "self_button" && method !== "qr_code") {
    return { error: "Método de confirmação inválido." };
  }

  try {
    const record = await confirmMyAttendance(token, courseId, lessonId, method, qrPayload);

    revalidatePath(`/cursos/${courseSlug}/${lessonId}`);
    revalidatePath(`/cursos/${courseSlug}`);
    revalidatePath("/home");

    return record;
  } catch (error) {
    const message =
      error instanceof ClassroomIOStudentError ? error.message : "Não foi possível confirmar sua presença.";
    return { error: message };
  }
}
