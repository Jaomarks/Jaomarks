"use client";

import { useState } from "react";
import Link from "next/link";
import { Segmented } from "@/components/ui";
import { ChevronLeftIcon, DotsIcon, PlayIcon, CheckIcon, FileIcon, DownloadIcon, ChevronRightIcon } from "@/components/icons";
import { findLesson, nextLessonId } from "@/lib/data";

const tabs = ["Aula", "Material", "Exercício"] as const;

export function LessonClient({ slug, lessonId }: { slug: string; lessonId: string }) {
  const found = findLesson(slug, lessonId)!;
  const { course, module, moduleIndex, lesson, lessonIndex } = found;
  const nextId = nextLessonId(slug, lessonId);

  const [tab, setTab] = useState<(typeof tabs)[number]>("Aula");
  const [completed, setCompleted] = useState(lesson.completed);
  const [submitted, setSubmitted] = useState(false);

  const completedCount = module.lessons.filter((l) =>
    l.id === lesson.id ? completed : l.completed,
  ).length;
  const modulePct = Math.round((completedCount / module.lessons.length) * 100);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 px-5 pt-5 pb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Link href={`/cursos/${course.slug}`} className="flex items-center gap-2.5 text-ink">
            <ChevronLeftIcon className="w-5 h-5" />
            <span className="text-[12.5px] text-ink-secondary font-semibold">{course.title}</span>
          </Link>
          <DotsIcon className="w-[19px] h-[19px]" />
        </div>

        <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-[#2c2c2e] to-ink relative flex items-center justify-center shrink-0">
          <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center">
            <PlayIcon className="w-5 h-5 text-white ml-0.5" />
          </div>
          <div className="absolute bottom-2.5 right-3 bg-black/50 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
            {lesson.duration}
          </div>
        </div>

        <div>
          <div className="text-[21px] font-bold tracking-tight leading-[1.25]">{lesson.title}</div>
          <div className="flex items-center gap-2.5 mt-2 flex-wrap">
            <span className="text-[12.5px] text-ink-secondary font-medium">
              Módulo {moduleIndex + 1} · Aula {lessonIndex + 1} de {module.lessons.length}
            </span>
            <span className="inline-flex items-center gap-1 bg-success-soft px-2.5 py-1 rounded-full">
              <CheckIcon className="w-2.5 h-2.5 text-success" />
              <span className="text-[10.5px] font-bold text-success">Presença confirmada</span>
            </span>
          </div>
        </div>

        <Segmented options={tabs} value={tab} onChange={(v) => setTab(v as (typeof tabs)[number])} />

        {tab === "Aula" && (
          <p className="text-[14.5px] leading-relaxed text-[#333336]">{lesson.content}</p>
        )}

        {tab === "Material" &&
          (lesson.material ? (
            <div className="flex items-center gap-3 bg-bg rounded-2xl p-3.5">
              <div className="w-9 h-9 rounded-[9px] bg-white flex items-center justify-center shrink-0">
                <FileIcon className="w-[17px] h-[17px] text-danger" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold truncate">{lesson.material.name}</div>
                <div className="text-[11.5px] text-ink-secondary">{lesson.material.size}</div>
              </div>
              <DownloadIcon className="w-4 h-4 text-accent shrink-0" />
            </div>
          ) : (
            <p className="text-[14px] text-ink-secondary">Nenhum material anexado nesta aula.</p>
          ))}

        {tab === "Exercício" && (
          <div className="bg-bg rounded-2xl p-4 flex flex-col gap-3">
            <div className="text-[13.5px] font-semibold">Desafio da aula</div>
            <p className="text-[13.5px] text-ink-secondary leading-relaxed">
              Registre no diário: em que momento desta semana você agiu de acordo com quem quer ser?
            </p>
            <button
              type="button"
              onClick={() => setSubmitted((s) => !s)}
              className={
                submitted
                  ? "self-start inline-flex items-center gap-1.5 bg-success-soft text-success text-[13px] font-semibold px-4 py-2 rounded-full"
                  : "self-start inline-flex items-center gap-1.5 bg-ink text-white text-[13px] font-semibold px-4 py-2 rounded-full"
              }
            >
              {submitted && <CheckIcon className="w-3 h-3" />}
              {submitted ? "Resposta enviada" : "Responder desafio"}
            </button>
          </div>
        )}

        {nextId && (
          <Link
            href={`/cursos/${course.slug}/${nextId}`}
            className="flex items-center justify-between bg-white rounded-2xl px-4 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_6px_18px_rgba(0,0,0,0.05)] mt-1"
          >
            <div>
              <div className="text-[11px] text-ink-secondary font-semibold uppercase tracking-wide">
                Próxima aula
              </div>
              <div className="text-[14px] font-semibold mt-0.5">
                {module.lessons.find((l) => l.id === nextId)?.title}
              </div>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-ink-secondary" />
          </Link>
        )}
      </div>

      <div className="sticky bottom-[74px] bg-white/90 backdrop-blur-xl border-t border-divider px-5 pt-3.5 pb-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11.5px] text-ink-secondary font-medium">
            {modulePct}% do módulo concluído
          </span>
          <div className="h-[5px] w-32 rounded-full bg-[#e5e5e7] overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${modulePct}%` }} />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setCompleted((c) => !c)}
          className={
            completed
              ? "flex items-center justify-center gap-2 bg-success text-white text-[15px] font-semibold text-center py-3.5 rounded-full"
              : "flex items-center justify-center gap-2 bg-ink text-white text-[15px] font-semibold text-center py-3.5 rounded-full"
          }
        >
          {completed && <CheckIcon className="w-4 h-4" />}
          {completed ? "Aula concluída" : "Marcar aula como concluída"}
        </button>
      </div>
    </div>
  );
}
