import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui";
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon, PlayIcon, BookIcon, BriefcaseIcon } from "@/components/icons";
import { requireSession } from "@/lib/dal";
import { getMyCourseDetail, getMyInternship, listMyCourses } from "@/lib/classroomio/student-client";
import { findNextIncompleteLesson, lessonSections } from "@/lib/classroomio/course-helpers";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { token } = await requireSession();

  // listMyCourses carries slug + the course-wide progress%; course detail
  // (sections/lessons) is a separate, heavier call — see student-client.ts.
  const courses = await listMyCourses(token);
  const summary = courses.find((c) => (c.slug ?? c.id) === slug);
  if (!summary) notFound();

  const [course, internship] = await Promise.all([
    getMyCourseDetail(token, summary.id),
    // Estágio/horas complementares (Etapa 4) — só existe se um coordenador
    // configurou para este curso; se der errado aqui, o curso continua
    // funcionando normalmente, só sem o card de estágio.
    getMyInternship(token, summary.id).catch(() => ({ configured: false as const })),
  ]);
  const sections = lessonSections(course);
  const nextUp = findNextIncompleteLesson(course);

  return (
    <div className="px-5 pt-6 pb-8 flex flex-col gap-5">
      <Link href="/cursos" className="inline-flex items-center gap-1.5 text-ink-secondary text-[13px] font-semibold w-fit">
        <ChevronLeftIcon className="w-4 h-4" />
        Cursos
      </Link>

      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-ink flex items-center justify-center shrink-0">
          <BookIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-[21px] font-bold tracking-tight leading-tight">{course.title}</div>
          {course.description && (
            <div className="text-[12.5px] text-ink-secondary mt-0.5">{course.description}</div>
          )}
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between text-[13px] mb-2">
          <span className="font-semibold">Progresso geral</span>
          <span className="text-ink-secondary font-medium">{summary.progressPercent}%</span>
        </div>
        <div className="h-2 rounded-full bg-[#f0f0f2] overflow-hidden">
          <div className="h-full bg-accent rounded-full" style={{ width: `${summary.progressPercent}%` }} />
        </div>
      </Card>

      {internship.configured && (
        <Link href={`/cursos/${slug}/estagio`}>
          <Card className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-bg flex items-center justify-center shrink-0">
              <BriefcaseIcon className="w-[18px] h-[18px] text-ink" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-semibold">Estágio e horas complementares</div>
              <div className="text-[12px] text-ink-secondary mt-0.5">
                {internship.totalApprovedWeeks > 0
                  ? `${internship.totalApprovedWeeks} semana${internship.totalApprovedWeeks === 1 ? "" : "s"} aprovada${internship.totalApprovedWeeks === 1 ? "" : "s"}`
                  : "Envie seu relatório e comprovante"}
              </div>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-ink-secondary shrink-0" />
          </Card>
        </Link>
      )}

      {sections.length === 0 ? (
        <p className="text-[14px] text-ink-secondary">Este curso ainda não tem aulas publicadas.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {sections.map((section, mi) => (
            <div key={section.id}>
              <div className="text-[13px] font-semibold text-ink-secondary uppercase tracking-wide mb-2.5">
                Módulo {mi + 1} · {section.title}
              </div>
              <Card className="divide-y divide-[#f0f0f2] overflow-hidden">
                {section.items.map((lesson, li) => {
                  const isNext = lesson.id === nextUp?.id;
                  const isLocked = lesson.isUnlocked === false;

                  const row = (
                    <>
                      <div
                        className={
                          lesson.isComplete
                            ? "w-7 h-7 rounded-full bg-success-soft text-success flex items-center justify-center shrink-0"
                            : isNext
                              ? "w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center shrink-0"
                              : "w-7 h-7 rounded-full border-[1.5px] border-divider flex items-center justify-center shrink-0 text-ink-tertiary text-[11px] font-semibold"
                        }
                      >
                        {lesson.isComplete ? (
                          <CheckIcon className="w-3.5 h-3.5" />
                        ) : isNext ? (
                          <PlayIcon className="w-3 h-3" />
                        ) : (
                          li + 1
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-medium leading-tight truncate">{lesson.title}</div>
                      </div>
                      {isLocked && <span className="text-[11px] text-ink-tertiary shrink-0">Bloqueada</span>}
                    </>
                  );

                  if (isLocked) {
                    return (
                      <div key={lesson.id} className="flex items-center gap-3 px-4 py-3.5 opacity-60">
                        {row}
                      </div>
                    );
                  }

                  return (
                    <Link key={lesson.id} href={`/cursos/${slug}/${lesson.id}`} className="flex items-center gap-3 px-4 py-3.5">
                      {row}
                    </Link>
                  );
                })}
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
