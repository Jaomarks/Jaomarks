"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Segmented } from "@/components/ui";
import {
  ChevronLeftIcon,
  DotsIcon,
  PlayIcon,
  CheckIcon,
  FileIcon,
  DownloadIcon,
  ChevronRightIcon,
} from "@/components/icons";
import { setLessonCompletionAction } from "@/app/actions/courses";
import { confirmAttendanceAction } from "@/app/actions/attendance";
import type { CheckinMethod, LessonExercise, StudentLesson } from "@/lib/classroomio/student-client";
import { ExercisePanel } from "./exercise-panel";

const tabs = ["Aula", "Material", "Exercício"] as const;

function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value < 10 && unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`;
}

function formatDuration(seconds?: number): string | null {
  if (!seconds || seconds <= 0) return null;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

type SectionLesson = { id: string; isComplete: boolean | null };

type AttendanceStatus = "pending" | "confirmed" | "rejected" | null;

export function LessonClient({
  courseSlug,
  courseId,
  courseTitle,
  sectionIndex,
  lessonIndex,
  sectionLessons,
  nextLessonId,
  nextLessonTitle,
  lesson,
  checkinMethods,
  attendanceStatus,
  attendanceMethod,
  exercises,
}: {
  courseSlug: string;
  courseId: string;
  courseTitle: string;
  sectionIndex: number;
  lessonIndex: number;
  sectionLessons: SectionLesson[];
  nextLessonId: string | null;
  nextLessonTitle: string | null;
  lesson: StudentLesson;
  checkinMethods: CheckinMethod[];
  attendanceStatus: AttendanceStatus;
  attendanceMethod: CheckinMethod | null;
  exercises: LessonExercise[];
}) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Aula");
  const [completed, setCompleted] = useState(lesson.completion?.isComplete ?? false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [attendance, setAttendance] = useState({ status: attendanceStatus, method: attendanceMethod });
  const [attendanceError, setAttendanceError] = useState<string | null>(null);
  const [attendancePending, startAttendanceTransition] = useTransition();
  const canSelfConfirm = checkinMethods.includes("self_button");
  const qrOnly = checkinMethods.includes("qr_code") && !canSelfConfirm;

  function confirmPresence() {
    setAttendanceError(null);
    startAttendanceTransition(async () => {
      const result = await confirmAttendanceAction(courseSlug, courseId, lesson.id, "self_button");
      if ("error" in result) {
        setAttendanceError(result.error);
        return;
      }
      setAttendance({ status: result.status, method: result.method });
    });
  }

  const isAutoTracked = lesson.completionPolicy === "video_watch";

  const completedCount = sectionLessons.filter((l) =>
    l.id === lesson.id ? completed : l.isComplete === true,
  ).length;
  const modulePct = sectionLessons.length > 0 ? Math.round((completedCount / sectionLessons.length) * 100) : 0;

  const duration = formatDuration(lesson.videos?.[0]?.metadata?.duration);
  const documents = lesson.documents ?? [];

  function toggleCompleted() {
    const next = !completed;
    setError(null);
    startTransition(async () => {
      const result = await setLessonCompletionAction(courseSlug, lesson.id, next);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setCompleted(result.isComplete);
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 px-5 pt-5 pb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Link href={`/cursos/${courseSlug}`} className="flex items-center gap-2.5 text-ink">
            <ChevronLeftIcon className="w-5 h-5" />
            <span className="text-[12.5px] text-ink-secondary font-semibold">{courseTitle}</span>
          </Link>
          <DotsIcon className="w-[19px] h-[19px]" />
        </div>

        <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-[#2c2c2e] to-ink relative flex items-center justify-center shrink-0">
          <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center">
            <PlayIcon className="w-5 h-5 text-white ml-0.5" />
          </div>
          {duration && (
            <div className="absolute bottom-2.5 right-3 bg-black/50 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
              {duration}
            </div>
          )}
        </div>

        <div>
          <div className="text-[21px] font-bold tracking-tight leading-[1.25]">{lesson.title}</div>
          <div className="flex items-center gap-2.5 mt-2 flex-wrap">
            <span className="text-[12.5px] text-ink-secondary font-medium">
              Módulo {sectionIndex + 1} · Aula {lessonIndex + 1} de {sectionLessons.length}
            </span>
            {attendance.status === "confirmed" && (
              <span className="inline-flex items-center gap-1 bg-success-soft px-2.5 py-1 rounded-full">
                <CheckIcon className="w-2.5 h-2.5 text-success" />
                <span className="text-[10.5px] font-bold text-success">Presença confirmada</span>
              </span>
            )}
            {attendance.status === "pending" && (
              <span className="text-[10.5px] font-bold text-ink-secondary bg-bg px-2.5 py-1 rounded-full">
                Presença enviada · aguardando confirmação
              </span>
            )}
            {(attendance.status === null || attendance.status === "rejected") && canSelfConfirm && (
              <button
                type="button"
                onClick={confirmPresence}
                disabled={attendancePending}
                className="text-[11px] font-bold text-accent bg-[#e8f2ff] px-2.5 py-1 rounded-full disabled:opacity-60"
              >
                {attendancePending
                  ? "Confirmando..."
                  : attendance.status === "rejected"
                    ? "Confirmar presença novamente"
                    : "Confirmar presença"}
              </button>
            )}
            {qrOnly && attendance.status === null && (
              <span className="text-[10.5px] text-ink-secondary">Presença por QR code no local</span>
            )}
          </div>
          {attendanceError && <p className="text-[11px] text-danger mt-1.5">{attendanceError}</p>}
        </div>

        <Segmented options={tabs} value={tab} onChange={(v) => setTab(v as (typeof tabs)[number])} />

        {tab === "Aula" && (
          <p className="text-[14.5px] leading-relaxed text-[#333336] whitespace-pre-line">
            {lesson.note || "Sem conteúdo escrito para esta aula ainda."}
          </p>
        )}

        {tab === "Material" &&
          (documents.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {documents.map((doc, i) => (
                <a
                  key={`${doc.link}-${i}`}
                  href={doc.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-bg rounded-2xl p-3.5"
                >
                  <div className="w-9 h-9 rounded-[9px] bg-white flex items-center justify-center shrink-0">
                    <FileIcon className="w-[17px] h-[17px] text-danger" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold truncate">{doc.name}</div>
                    {doc.size ? (
                      <div className="text-[11.5px] text-ink-secondary">{formatBytes(doc.size)}</div>
                    ) : null}
                  </div>
                  <DownloadIcon className="w-4 h-4 text-accent shrink-0" />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-[14px] text-ink-secondary">Nenhum material anexado nesta aula.</p>
          ))}

        {tab === "Exercício" &&
          (exercises.length > 0 ? (
            <div className="flex flex-col gap-3">
              {exercises.map((exercise) => (
                <ExercisePanel key={exercise.id} courseSlug={courseSlug} lessonId={lesson.id} exercise={exercise} />
              ))}
            </div>
          ) : (
            <div className="bg-bg rounded-2xl p-4 flex flex-col gap-2">
              <div className="text-[13.5px] font-semibold">Exercício desta aula</div>
              <p className="text-[13.5px] text-ink-secondary leading-relaxed">
                Esta aula ainda não tem exercício.
              </p>
            </div>
          ))}

        {nextLessonId && (
          <Link
            href={`/cursos/${courseSlug}/${nextLessonId}`}
            className="flex items-center justify-between bg-white rounded-2xl px-4 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_6px_18px_rgba(0,0,0,0.05)] mt-1"
          >
            <div>
              <div className="text-[11px] text-ink-secondary font-semibold uppercase tracking-wide">
                Próxima aula
              </div>
              <div className="text-[14px] font-semibold mt-0.5">{nextLessonTitle}</div>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-ink-secondary" />
          </Link>
        )}
      </div>

      <div className="sticky bottom-[74px] bg-white/90 backdrop-blur-xl border-t border-divider px-5 pt-3.5 pb-4 flex flex-col gap-2.5">
        {error && <p className="text-[12px] text-danger font-medium">{error}</p>}
        <div className="flex items-center justify-between">
          <span className="text-[11.5px] text-ink-secondary font-medium">
            {modulePct}% do módulo concluído
          </span>
          <div className="h-[5px] w-32 rounded-full bg-[#e5e5e7] overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${modulePct}%` }} />
          </div>
        </div>
        {isAutoTracked ? (
          <div className="flex items-center justify-center gap-2 bg-bg text-ink-secondary text-[13px] font-medium text-center py-3.5 rounded-full">
            Conclui automaticamente ao assistir o vídeo
          </div>
        ) : (
          <button
            type="button"
            disabled={isPending}
            onClick={toggleCompleted}
            className={
              completed
                ? "flex items-center justify-center gap-2 bg-success text-white text-[15px] font-semibold text-center py-3.5 rounded-full disabled:opacity-60"
                : "flex items-center justify-center gap-2 bg-ink text-white text-[15px] font-semibold text-center py-3.5 rounded-full disabled:opacity-60"
            }
          >
            {completed && <CheckIcon className="w-4 h-4" />}
            {isPending ? "Salvando..." : completed ? "Aula concluída" : "Marcar aula como concluída"}
          </button>
        )}
      </div>
    </div>
  );
}
