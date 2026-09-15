"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui";
import { CheckIcon, FileIcon } from "@/components/icons";
import { submitInternshipAction } from "@/app/actions/exercises";
import { uploadDocument, type UploadedDocument } from "@/lib/upload-document";
import type { ExerciseSubmission } from "@/lib/classroomio/student-client";

function statusLabel(submission: ExerciseSubmission) {
  if (submission.gradingState === "completed") {
    return { text: `${submission.approvedWeeks ?? 0} semana(s) aprovada(s)`, tone: "success" as const };
  }
  return { text: "Aguardando aprovação do coordenador", tone: "pending" as const };
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function EstagioClient({
  courseSlug,
  courseId,
  description,
  totalApprovedWeeks,
  submissions,
}: {
  courseSlug: string;
  courseId: string;
  description: string | null;
  totalApprovedWeeks: number;
  submissions: ExerciseSubmission[];
}) {
  const [reportText, setReportText] = useState("");
  const [file, setFile] = useState<UploadedDocument | null>(null);
  const [uploadState, setUploadState] = useState<{ status: "idle" | "uploading" | "error"; error?: string }>({
    status: "idle",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleFileChange(selected: File | null) {
    if (!selected) return;
    setUploadState({ status: "uploading" });
    try {
      const uploaded = await uploadDocument(selected);
      setFile(uploaded);
      setUploadState({ status: "idle" });
    } catch (err) {
      setUploadState({ status: "error", error: err instanceof Error ? err.message : "Falha no envio." });
    }
  }

  function handleSubmit() {
    setError(null);
    setSuccess(false);
    if (!reportText.trim()) {
      setError("Descreva suas atividades no relatório.");
      return;
    }
    if (!file) {
      setError("Envie o comprovante de estágio.");
      return;
    }

    startTransition(async () => {
      const result = await submitInternshipAction(courseSlug, courseId, { reportText, ...file });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setReportText("");
      setFile(null);
      setSuccess(true);
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="p-4.5 flex flex-col items-center text-center gap-1">
        <div className="text-[28px] font-extrabold tracking-tight">{totalApprovedWeeks}</div>
        <div className="text-[12.5px] text-ink-secondary font-medium">
          semana{totalApprovedWeeks === 1 ? "" : "s"} aprovada{totalApprovedWeeks === 1 ? "" : "s"} como horas
          complementares
        </div>
      </Card>

      <Card className="p-4.5 flex flex-col gap-3.5">
        <div>
          <div className="text-[14px] font-semibold">Enviar novo relatório</div>
          {description && <p className="text-[12.5px] text-ink-secondary mt-1 leading-relaxed">{description}</p>}
        </div>

        <textarea
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          disabled={isPending}
          rows={5}
          placeholder="Descreva as atividades realizadas no período de estágio"
          className="w-full rounded-xl border-[1.5px] border-divider px-3.5 py-3 text-[13.5px] resize-none disabled:opacity-60"
        />

        {file ? (
          <div className="flex items-center gap-3 bg-bg rounded-xl p-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
              <FileIcon className="w-4 h-4 text-success" />
            </div>
            <span className="text-[13px] font-medium truncate flex-1">{file.fileName}</span>
            {!isPending && (
              <button type="button" onClick={() => setFile(null)} className="text-[11.5px] text-ink-secondary font-semibold shrink-0">
                Trocar
              </button>
            )}
          </div>
        ) : (
          <label className="flex items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-divider px-3.5 py-4 text-[13px] font-medium text-ink-secondary cursor-pointer">
            {uploadState.status === "uploading" ? "Enviando..." : "Selecionar comprovante (PDF ou Word)"}
            <input
              type="file"
              accept="application/pdf,.doc,.docx"
              className="hidden"
              disabled={isPending || uploadState.status === "uploading"}
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
          </label>
        )}
        {uploadState.status === "error" && <p className="text-[11.5px] text-danger">{uploadState.error}</p>}

        {error && <p className="text-[12px] text-danger font-medium">{error}</p>}
        {success && (
          <p className="text-[12px] text-success font-medium">
            Relatório enviado! Aguarde a aprovação do coordenador.
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="bg-ink text-white text-[14px] font-semibold py-3 rounded-full disabled:opacity-60"
        >
          {isPending ? "Enviando..." : "Enviar relatório"}
        </button>
      </Card>

      {submissions.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <div className="text-[13px] font-semibold text-ink-secondary uppercase tracking-wide">Envios anteriores</div>
          <Card className="divide-y divide-[#f0f0f2] overflow-hidden">
            {[...submissions].reverse().map((submission) => {
              const status = statusLabel(submission);
              return (
                <div key={submission.id} className="flex items-center gap-3 px-4 py-3.5">
                  <div
                    className={
                      status.tone === "success"
                        ? "w-8 h-8 rounded-full bg-success-soft text-success flex items-center justify-center shrink-0"
                        : "w-8 h-8 rounded-full bg-bg text-ink-secondary flex items-center justify-center shrink-0"
                    }
                  >
                    <CheckIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium">{status.text}</div>
                    <div className="text-[11.5px] text-ink-secondary mt-0.5">{formatDate(submission.createdAt)}</div>
                    {submission.feedback && (
                      <div className="text-[12px] text-ink-secondary mt-1 leading-relaxed">{submission.feedback}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      )}
    </div>
  );
}
