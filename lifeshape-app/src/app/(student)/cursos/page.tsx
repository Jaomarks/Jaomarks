import Link from "next/link";
import { Card } from "@/components/ui";
import { BriefcaseIcon, CompassIcon, UsersIcon, BookIcon } from "@/components/icons";
import { courses, courseProgress } from "@/lib/data";

const courseIcons = { briefcase: BriefcaseIcon, compass: CompassIcon, users: UsersIcon, book: BookIcon };

export default function CursosPage() {
  return (
    <div className="px-5 pt-6 pb-8 flex flex-col gap-5">
      <div className="text-[26px] font-bold tracking-tight">Cursos</div>

      <div className="flex flex-col gap-3">
        {courses.map((course) => {
          const Icon = courseIcons[course.icon];
          const progress = courseProgress(course);
          const started = progress > 0;
          return (
            <Link key={course.slug} href={`/cursos/${course.slug}`}>
              <Card className="p-4 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-ink flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold leading-tight truncate">{course.title}</div>
                  <div className="text-[12px] text-ink-secondary mt-0.5">
                    {course.category} · {course.turma}
                  </div>
                  {started ? (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-[5px] flex-1 rounded-full bg-[#f0f0f2] overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-ink-secondary font-medium shrink-0">
                        {progress}%
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
    </div>
  );
}
