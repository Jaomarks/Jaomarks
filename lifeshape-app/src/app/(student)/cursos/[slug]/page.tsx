import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui";
import { ChevronLeftIcon, CheckIcon, PlayIcon, BriefcaseIcon, CompassIcon, UsersIcon, BookIcon } from "@/components/icons";
import { courses, courseProgress } from "@/lib/data";

const courseIcons = { briefcase: BriefcaseIcon, compass: CompassIcon, users: UsersIcon, book: BookIcon };

export async function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();

  const progress = courseProgress(course);
  const nextUpId = course.modules.flatMap((m) => m.lessons).find((l) => !l.completed)?.id;
  const Icon = courseIcons[course.icon];

  return (
    <div className="px-5 pt-6 pb-8 flex flex-col gap-5">
      <Link href="/cursos" className="inline-flex items-center gap-1.5 text-ink-secondary text-[13px] font-semibold w-fit">
        <ChevronLeftIcon className="w-4 h-4" />
        Cursos
      </Link>

      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-ink flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-[21px] font-bold tracking-tight leading-tight">{course.title}</div>
          <div className="text-[12.5px] text-ink-secondary mt-0.5">
            {course.category} · {course.turma}
          </div>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between text-[13px] mb-2">
          <span className="font-semibold">Progresso geral</span>
          <span className="text-ink-secondary font-medium">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-[#f0f0f2] overflow-hidden">
          <div className="h-full bg-accent rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </Card>

      <div className="flex flex-col gap-5">
        {course.modules.map((module, mi) => (
          <div key={module.id}>
            <div className="text-[13px] font-semibold text-ink-secondary uppercase tracking-wide mb-2.5">
              Módulo {mi + 1} · {module.title}
            </div>
            <Card className="divide-y divide-[#f0f0f2] overflow-hidden">
              {module.lessons.map((lesson, li) => {
                const isNext = lesson.id === nextUpId;
                return (
                  <Link
                    key={lesson.id}
                    href={`/cursos/${course.slug}/${lesson.id}`}
                    className="flex items-center gap-3 px-4 py-3.5"
                  >
                    <div
                      className={
                        lesson.completed
                          ? "w-7 h-7 rounded-full bg-success-soft text-success flex items-center justify-center shrink-0"
                          : isNext
                            ? "w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center shrink-0"
                            : "w-7 h-7 rounded-full border-[1.5px] border-divider flex items-center justify-center shrink-0 text-ink-tertiary text-[11px] font-semibold"
                      }
                    >
                      {lesson.completed ? (
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
                    <div className="text-[12px] text-ink-secondary shrink-0">{lesson.duration}</div>
                  </Link>
                );
              })}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
