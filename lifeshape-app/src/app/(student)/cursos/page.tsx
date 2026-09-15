import Link from "next/link";
import { Card } from "@/components/ui";
import { BookIcon } from "@/components/icons";
import { requireSession } from "@/lib/dal";
import { listMyCourses } from "@/lib/classroomio/student-client";

export default async function CursosPage() {
  const { token } = await requireSession();
  const courses = await listMyCourses(token);

  return (
    <div className="px-5 pt-6 pb-8 flex flex-col gap-5">
      <div className="text-[26px] font-bold tracking-tight">Cursos</div>

      {courses.length === 0 ? (
        <p className="text-[14px] text-ink-secondary">
          Você ainda não está matriculado em nenhum curso.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {courses.map((course) => {
            const started = course.progressPercent > 0;
            return (
              <Link key={course.id} href={`/cursos/${course.slug ?? course.id}`}>
                <Card className="p-4 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-ink flex items-center justify-center shrink-0">
                    <BookIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-semibold leading-tight truncate">{course.title}</div>
                    {course.description && (
                      <div className="text-[12px] text-ink-secondary mt-0.5 truncate">
                        {course.description}
                      </div>
                    )}
                    {started ? (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-[5px] flex-1 rounded-full bg-[#f0f0f2] overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{ width: `${course.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-ink-secondary font-medium shrink-0">
                          {course.progressPercent}%
                        </span>
                      </div>
                    ) : (
                      <span className="inline-block mt-2 text-[11px] font-semibold text-accent bg-[#e8f2ff] px-2 py-0.5 rounded-full">
                        Não iniciado
                      </span>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
