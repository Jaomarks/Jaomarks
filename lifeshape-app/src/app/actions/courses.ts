"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/lib/dal";
import { ClassroomIOStudentError, setLessonCompletion } from "@/lib/classroomio/student-client";

export type SetLessonCompletionResult = { isComplete: boolean } | { error: string };

export async function setLessonCompletionAction(
  courseSlug: string,
  lessonId: string,
  isComplete: boolean,
): Promise<SetLessonCompletionResult> {
  const { token } = await requireSession();

  try {
    const completion = await setLessonCompletion(token, lessonId, isComplete);

    // Every place progress/completion can be visible.
    revalidatePath(`/cursos/${courseSlug}`);
    revalidatePath(`/cursos/${courseSlug}/${lessonId}`);
    revalidatePath("/cursos");
    revalidatePath("/home");

    return completion;
  } catch (error) {
    const message =
      error instanceof ClassroomIOStudentError ? error.message : "Não foi possível atualizar a aula.";
    return { error: message };
  }
}
