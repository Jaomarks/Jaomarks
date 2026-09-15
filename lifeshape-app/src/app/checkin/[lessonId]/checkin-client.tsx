"use client";

import { useState, useTransition } from "react";
import { confirmAttendanceAction, type ConfirmAttendanceResult } from "@/app/actions/attendance";
import { StatusScreen } from "./status-screen";

// Confirmation requires an explicit tap, not just loading this page —
// see PROJECT_PLAN.md Etapa 3 (/security-review finding): a GET-triggered
// auto-confirm means any way this URL reaches a logged-in browser (a
// forwarded link, a chat app's embedded preview that carries cookies)
// silently marks that student present with no clear consent moment.
export function CheckinClient({
  courseSlug,
  courseId,
  lessonId,
  lessonTitle,
  sig,
  backHref,
}: {
  courseSlug: string;
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  sig: string;
  backHref: string;
}) {
  const [result, setResult] = useState<ConfirmAttendanceResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function confirm() {
    startTransition(async () => {
      const res = await confirmAttendanceAction(courseSlug, courseId, lessonId, "qr_code", `${lessonId}.${sig}`);
      setResult(res);
    });
  }

  if (result && "error" in result) {
    return <StatusScreen title="Não foi possível confirmar" message={result.error} backHref={backHref} />;
  }

  if (result && "status" in result) {
    return (
      <StatusScreen
        title={result.status === "confirmed" ? "Presença confirmada!" : "Presença enviada"}
        message={
          result.status === "pending" ? `${lessonTitle} — aguardando confirmação do professor.` : lessonTitle
        }
        success
        backHref={backHref}
      />
    );
  }

  return (
    <div className="px-5 pt-14 pb-8 flex flex-col items-center gap-4 text-center min-h-screen">
      <div className="text-[19px] font-bold tracking-tight">{lessonTitle}</div>
      <p className="text-[14px] text-ink-secondary max-w-xs">Confirme que você está presente nesta aula.</p>
      <button
        type="button"
        onClick={confirm}
        disabled={isPending}
        className="mt-2 inline-flex items-center gap-1.5 bg-ink text-white text-[15px] font-semibold px-6 py-3 rounded-full disabled:opacity-60"
      >
        {isPending ? "Confirmando..." : "Confirmar presença"}
      </button>
    </div>
  );
}
