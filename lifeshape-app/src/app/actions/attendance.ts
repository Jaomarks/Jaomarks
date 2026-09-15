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
