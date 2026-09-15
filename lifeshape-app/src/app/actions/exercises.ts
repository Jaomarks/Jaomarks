"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/lib/dal";
import {
  ClassroomIOStudentError,
  encodeExerciseAnswer,
  requestDocumentUploadUrl,
  submitMyExercise,
  submitMyInternshipReport,
  type ExerciseAnswerInput,
  type ExerciseSubmission,
} from "@/lib/classroomio/student-client";

export type SubmitExerciseResult = ExerciseSubmission | { error: string };

// Client-side answer shape (see exercise-panel.tsx) — kept close to
// ExerciseAnswerData but always carrying `questionId` alongside `data`,
// since that's what encodeExerciseAnswer needs to build the wire payload.
export type ClientExerciseAnswer =
  | { questionId: number; type: "RADIO"; optionId: number }
  | { questionId: number; type: "CHECKBOX"; optionIds: number[] }
  | { questionId: number; type: "TRUE_FALSE"; value: boolean }
  | { questionId: number; type: "SHORT_ANSWER" | "TEXTAREA"; text: string }
  | { questionId: number; type: "NUMERIC"; value: number }
  | { questionId: number; type: "FILE_UPLOAD"; fileKey: string; fileName: string; mimeType?: string; size?: number };

export async function submitExerciseAction(
  courseSlug: string,
  lessonId: string,
  exerciseId: string,
  answers: ClientExerciseAnswer[],
): Promise<SubmitExerciseResult> {
  const { token } = await requireSession();

  if (answers.length === 0) {
    return { error: "Responda pelo menos uma pergunta antes de enviar." };
  }

  const encoded: ExerciseAnswerInput[] = answers.map((a) => encodeExerciseAnswer(a.questionId, a));

  try {
    const submission = await submitMyExercise(token, exerciseId, encoded);
    revalidatePath(`/cursos/${courseSlug}/${lessonId}`);
    return submission;
  } catch (error) {
    const message =
      error instanceof ClassroomIOStudentError ? error.message : "Não foi possível enviar sua resposta.";
    return { error: message };
  }
}

export type RequestUploadUrlResult = { url: string; fileKey: string } | { error: string };

/** Step 1 of sending a document: get a presigned URL, then the browser PUTs the file bytes to it directly (see estagio-client.tsx). */
export async function requestUploadUrlAction(
  fileName: string,
  fileType: string,
  fileSize?: number,
): Promise<RequestUploadUrlResult> {
  const { token } = await requireSession();
  try {
    return await requestDocumentUploadUrl(token, fileName, fileType, fileSize);
  } catch (error) {
    const message =
      error instanceof ClassroomIOStudentError ? error.message : "Não foi possível preparar o envio do arquivo.";
    return { error: message };
  }
}

export type SubmitInternshipResult = ExerciseSubmission | { error: string };

export async function submitInternshipAction(
  courseSlug: string,
  courseId: string,
  input: { reportText: string; fileKey: string; fileName: string; mimeType?: string; size?: number },
): Promise<SubmitInternshipResult> {
  const { token } = await requireSession();

  try {
    const submission = await submitMyInternshipReport(token, courseId, input);
    revalidatePath(`/cursos/${courseSlug}`);
    revalidatePath(`/cursos/${courseSlug}/estagio`);
    return submission;
  } catch (error) {
    const message =
      error instanceof ClassroomIOStudentError ? error.message : "Não foi possível enviar o relatório de estágio.";
    return { error: message };
  }
}
