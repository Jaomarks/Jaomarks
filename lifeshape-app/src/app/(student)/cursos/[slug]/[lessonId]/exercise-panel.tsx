"use client";

import { useState, useTransition } from "react";
import { CheckIcon, FileIcon } from "@/components/icons";
import { submitExerciseAction, type ClientExerciseAnswer } from "@/app/actions/exercises";
import { uploadDocument } from "@/lib/upload-document";
import type { ExerciseQuestion, ExerciseSubmission, LessonExercise } from "@/lib/classroomio/student-client";

// Etapa 4 — real quiz/assignment for a lesson (replaces the old "chega em
// uma próxima etapa" placeholder). Renders the question types this app
// knows how to answer; anything else shows a small "não suportado" notice
// instead of blocking the rest (see student-client.ts SupportedQuestionType).

function optionButtonClass(selected: boolean) {
  return selected
    ? "flex items-center gap-2.5 rounded-xl border-[1.5px] border-ink bg-ink/5 px-3.5 py-3 text-left"
    : "flex items-center gap-2.5 rounded-xl border-[1.5px] border-divider px-3.5 py-3 text-left";
}

function QuestionInput({
  question,
  answer,
  onChange,
  disabled,
}: {
  question: ExerciseQuestion;
  answer: ClientExerciseAnswer | undefined;
  onChange: (answer: ClientExerciseAnswer | null) => void;
  disabled: boolean;
}) {
  const [uploadState, setUploadState] = useState<{ status: "idle" | "uploading" | "error"; error?: string }>({
    status: "idle",
  });

  async function handleFileChange(file: File | null) {
    if (!file) return;
    setUploadState({ status: "uploading" });
    try {
      const uploaded = await uploadDocument(file);
      onChange({ questionId: question.id, type: "FILE_UPLOAD", ...uploaded });
      setUploadState({ status: "idle" });
    } catch (error) {
      setUploadState({ status: "error", error: error instanceof Error ? error.message : "Falha no envio." });
    }
  }

  switch (question.questionType) {
    case "RADIO": {
      const selectedId = answer?.type === "RADIO" ? answer.optionId : undefined;
      return (
        <div className="flex flex-col gap-2">
          {question.options.map((option) => (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange({ questionId: question.id, type: "RADIO", optionId: option.id })}
              className={optionButtonClass(selectedId === option.id) + " disabled:opacity-60"}
            >
              <span
                className={
                  selectedId === option.id
                    ? "w-4 h-4 rounded-full border-[1.5px] border-ink flex items-center justify-center shrink-0"
                    : "w-4 h-4 rounded-full border-[1.5px] border-divider shrink-0"
                }
              >
                {selectedId === option.id && <span className="w-2 h-2 rounded-full bg-ink" />}
              </span>
              <span className="text-[13.5px]">{option.label}</span>
            </button>
          ))}
        </div>
      );
    }

    case "CHECKBOX": {
      const selectedIds = answer?.type === "CHECKBOX" ? answer.optionIds : [];
      function toggle(optionId: number) {
        const next = selectedIds.includes(optionId)
          ? selectedIds.filter((id) => id !== optionId)
          : [...selectedIds, optionId];
        onChange(next.length > 0 ? { questionId: question.id, type: "CHECKBOX", optionIds: next } : null);
      }
      return (
        <div className="flex flex-col gap-2">
          {question.options.map((option) => {
            const checked = selectedIds.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                disabled={disabled}
                onClick={() => toggle(option.id)}
                className={optionButtonClass(checked) + " disabled:opacity-60"}
              >
                <span
                  className={
                    checked
                      ? "w-4 h-4 rounded-[5px] bg-ink flex items-center justify-center shrink-0"
                      : "w-4 h-4 rounded-[5px] border-[1.5px] border-divider shrink-0"
                  }
                >
                  {checked && <CheckIcon className="w-2.5 h-2.5 text-white" />}
                </span>
                <span className="text-[13.5px]">{option.label}</span>
              </button>
            );
          })}
        </div>
      );
    }

    case "TRUE_FALSE": {
      // Fixed Portuguese copy, not driven by the authored option labels —
      // the wire format only cares about the literal string "true"/"false"
      // (see encodeExerciseAnswer / classroomiols answer-codecs.ts), so this
      // never depends on however the course creator phrased their options.
      const selected = answer?.type === "TRUE_FALSE" ? answer.value : undefined;
      return (
        <div className="flex gap-2.5">
          {[
            { label: "Verdadeiro", value: true },
            { label: "Falso", value: false },
          ].map((opt) => (
            <button
              key={opt.label}
              type="button"
              disabled={disabled}
              onClick={() => onChange({ questionId: question.id, type: "TRUE_FALSE", value: opt.value })}
              className={
                (selected === opt.value
                  ? "flex-1 rounded-xl border-[1.5px] border-ink bg-ink/5 py-3"
                  : "flex-1 rounded-xl border-[1.5px] border-divider py-3") + " text-[13.5px] font-medium disabled:opacity-60"
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      );
    }

    case "SHORT_ANSWER":
      return (
        <input
          type="text"
          disabled={disabled}
          value={answer?.type === "SHORT_ANSWER" ? answer.text : ""}
          onChange={(e) =>
            onChange(e.target.value ? { questionId: question.id, type: "SHORT_ANSWER", text: e.target.value } : null)
          }
          placeholder="Sua resposta"
          className="w-full rounded-xl border-[1.5px] border-divider px-3.5 py-3 text-[13.5px] disabled:opacity-60"
        />
      );

    case "NUMERIC":
      return (
        <input
          type="number"
          disabled={disabled}
          value={answer?.type === "NUMERIC" ? answer.value : ""}
          onChange={(e) =>
            onChange(
              e.target.value !== "" ? { questionId: question.id, type: "NUMERIC", value: Number(e.target.value) } : null,
            )
          }
          placeholder="0"
          className="w-full rounded-xl border-[1.5px] border-divider px-3.5 py-3 text-[13.5px] disabled:opacity-60"
        />
      );

    case "TEXTAREA":
      return (
        <textarea
          disabled={disabled}
          value={answer?.type === "TEXTAREA" ? answer.text : ""}
          onChange={(e) =>
            onChange(e.target.value ? { questionId: question.id, type: "TEXTAREA", text: e.target.value } : null)
          }
          rows={4}
          placeholder="Sua resposta"
          className="w-full rounded-xl border-[1.5px] border-divider px-3.5 py-3 text-[13.5px] resize-none disabled:opacity-60"
        />
      );

    case "FILE_UPLOAD": {
      const uploaded = answer?.type === "FILE_UPLOAD" ? answer : null;
      return (
        <div className="flex flex-col gap-2">
          {uploaded ? (
            <div className="flex items-center gap-3 bg-bg rounded-xl p-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                <FileIcon className="w-4 h-4 text-success" />
              </div>
              <span className="text-[13px] font-medium truncate flex-1">{uploaded.fileName}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => onChange(null)}
                  className="text-[11.5px] text-ink-secondary font-semibold shrink-0"
                >
                  Trocar
                </button>
              )}
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-divider px-3.5 py-4 text-[13px] font-medium text-ink-secondary cursor-pointer">
              {uploadState.status === "uploading" ? "Enviando..." : "Selecionar arquivo (PDF ou Word)"}
              <input
                type="file"
                accept="application/pdf,.doc,.docx"
                className="hidden"
                disabled={disabled || uploadState.status === "uploading"}
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />
            </label>
          )}
          {uploadState.status === "error" && <p className="text-[11.5px] text-danger">{uploadState.error}</p>}
        </div>
      );
    }

    default:
      return (
        <p className="text-[12.5px] text-ink-secondary italic">
          Este tipo de pergunta ainda não é suportado neste app.
        </p>
      );
  }
}

function SubmissionResult({ submission }: { submission: ExerciseSubmission }) {
  if (submission.gradingState === "completed") {
    if (submission.overallStatus === "auto_graded") {
      return (
        <div className="flex items-center gap-2.5 bg-success-soft rounded-xl p-3.5">
          <CheckIcon className="w-4 h-4 text-success shrink-0" />
          <span className="text-[13.5px] font-semibold text-success">Nota: {submission.total ?? 0} pontos</span>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-1.5 bg-success-soft rounded-xl p-3.5">
        <div className="flex items-center gap-2.5">
          <CheckIcon className="w-4 h-4 text-success shrink-0" />
          <span className="text-[13.5px] font-semibold text-success">Corrigido</span>
        </div>
        {submission.feedback && <p className="text-[13px] text-ink-secondary">{submission.feedback}</p>}
      </div>
    );
  }

  return (
    <div className="bg-bg rounded-xl p-3.5">
      <p className="text-[13.5px] font-medium text-ink-secondary">
        Resposta enviada — aguardando correção do professor.
      </p>
    </div>
  );
}

export function ExercisePanel({
  courseSlug,
  lessonId,
  exercise,
}: {
  courseSlug: string;
  lessonId: string;
  exercise: LessonExercise;
}) {
  const latestSubmission = exercise.submissions[exercise.submissions.length - 1] ?? null;
  const [mode, setMode] = useState<"view" | "answer">(latestSubmission ? "view" : "answer");
  const [answers, setAnswers] = useState<Record<number, ClientExerciseAnswer>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function setAnswer(questionId: number, answer: ClientExerciseAnswer | null) {
    setAnswers((prev) => {
      const next = { ...prev };
      if (answer) next[questionId] = answer;
      else delete next[questionId];
      return next;
    });
  }

  function handleSubmit() {
    setError(null);
    const values = Object.values(answers);
    if (values.length === 0) {
      setError("Responda pelo menos uma pergunta antes de enviar.");
      return;
    }
    startTransition(async () => {
      const result = await submitExerciseAction(courseSlug, lessonId, exercise.id, values);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setAnswers({});
      setMode("view");
    });
  }

  return (
    <div className="bg-bg rounded-2xl p-4 flex flex-col gap-3.5">
      <div>
        <div className="text-[13.5px] font-semibold">{exercise.title}</div>
        {exercise.description && (
          <p className="text-[12.5px] text-ink-secondary mt-0.5 leading-relaxed">{exercise.description}</p>
        )}
      </div>

      {mode === "view" && latestSubmission && (
        <div className="flex flex-col gap-2.5">
          <SubmissionResult submission={latestSubmission} />
          {exercise.allowMultipleAttempts && (
            <button
              type="button"
              onClick={() => setMode("answer")}
              className="text-[12.5px] font-semibold text-accent w-fit"
            >
              Responder novamente
            </button>
          )}
        </div>
      )}

      {mode === "answer" && (
        <div className="flex flex-col gap-4">
          {exercise.questions.map((question, qi) => (
            <div key={question.id} className="flex flex-col gap-2">
              <div className="text-[13.5px] font-medium">
                {qi + 1}. {question.title}
              </div>
              <QuestionInput
                question={question}
                answer={answers[question.id]}
                onChange={(a) => setAnswer(question.id, a)}
                disabled={isPending}
              />
            </div>
          ))}

          {error && <p className="text-[12px] text-danger font-medium">{error}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-ink text-white text-[14px] font-semibold py-3 rounded-full disabled:opacity-60"
          >
            {isPending ? "Enviando..." : "Enviar respostas"}
          </button>
        </div>
      )}
    </div>
  );
}
