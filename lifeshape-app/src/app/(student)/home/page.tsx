import Link from "next/link";
import { Card, Ring, StatChip } from "@/components/ui";
import { BellIcon, FlameIcon, CoinIcon, TrophyIcon, ChevronRightIcon, BookIcon } from "@/components/icons";
import { requireSession } from "@/lib/dal";
import { getMyCourseDetail, listMyCourses, type StudentCourseSummary } from "@/lib/classroomio/student-client";
import { findNextIncompleteLesson } from "@/lib/classroomio/course-helpers";
// Gamificação (sementes, sequência, nível, anéis semanais) ainda não existe
// de verdade no backend — chega na Etapa 6. Mantido como mock até lá.
import { student } from "@/lib/data";

function greeting(hour: number): string {
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

async function findFeaturedLesson(token: string, courses: StudentCourseSummary[]) {
  // Primeiro curso ainda não concluído, na ordem em que o backend já manda
  // (mais recente primeiro) — evita N buscas de detalhe por curso.
  const candidate = courses.find((c) => c.progressPercent < 100);
  if (!candidate) return null;

  const detail = await getMyCourseDetail(token, candidate.id);
  const lesson = findNextIncompleteLesson(detail);
  if (!lesson) return null;

  return { course: candidate, lesson };
}

export default async function HomePage() {
  const { token, info } = await requireSession();
  const courses = await listMyCourses(token);
  const featured = await findFeaturedLesson(token, courses);

  const inProgress = courses.filter((c) => c.progressPercent > 0 && c.progressPercent < 100).slice(0, 2);

  const name = info.user.name?.trim() || info.user.email;
  const firstName = name.split(" ")[0];
  const initial = name.charAt(0).toUpperCase() || "?";

  return (
    <div className="px-5 pt-6 pb-8 flex flex-col gap-5.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-ink text-white flex items-center justify-center text-[15px] font-semibold">
            {initial}
          </div>
          <div>
            <div className="text-[12px] text-ink-secondary font-medium">{greeting(new Date().getHours())}</div>
            <div className="text-[17px] font-semibold tracking-tight">{firstName}</div>
          </div>
        </div>
        <div className="relative w-9 h-9 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_10px_rgba(0,0,0,0.05)] flex items-center justify-center">
          <BellIcon className="w-[18px] h-[18px]" />
          <div className="absolute top-[7px] right-2 w-[7px] h-[7px] rounded-full bg-[#ff453a] border-[1.5px] border-white" />
        </div>
      </div>

      <div className="flex gap-2.5">
        <StatChip
          icon={<FlameIcon className="w-[18px] h-[18px]" filled />}
          value={`${student.streak} dias`}
          label="sequência"
          color="var(--color-ring-a)"
        />
        <StatChip
          icon={<CoinIcon className="w-[18px] h-[18px]" />}
          value={student.sementes.toLocaleString("pt-BR")}
          label="sementes"
          color="var(--color-ring-b)"
        />
        <StatChip
          icon={<TrophyIcon className="w-[18px] h-[18px]" />}
          value={`Nível ${student.level}`}
          label={student.levelLabel}
          color="var(--color-ring-c)"
        />
      </div>

      {featured && (
        <div>
          <div className="text-[13px] font-semibold text-ink-secondary uppercase tracking-wide mb-2.5">
            Próxima aula
          </div>
          <Link href={`/cursos/${featured.course.slug}/${featured.lesson.id}`}>
            <Card className="p-4.5 flex flex-col gap-3.5">
              <span className="self-start bg-bg text-ink text-[11px] font-semibold px-2.5 py-1 rounded-full">
                {featured.course.title}
              </span>
              <div className="text-[19px] font-semibold tracking-tight leading-[1.25]">
                {featured.lesson.title}
              </div>
              <div className="flex items-center justify-end">
                <div className="inline-flex items-center gap-1.5 bg-accent text-white text-[14px] font-semibold px-4.5 py-2.5 rounded-full">
                  Continuar
                  <ChevronRightIcon className="w-3 h-3" />
                </div>
              </div>
            </Card>
          </Link>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="text-[13px] font-semibold text-ink-secondary uppercase tracking-wide">
            Sua semana
          </div>
          <Link href="/conquistas" className="text-[12px] font-semibold text-accent">
            Ver tudo
          </Link>
        </div>
        <Card className="flex items-center justify-between px-5 py-4.5">
          <Ring value={student.weeklyRings.presenca} color="a" label="Presença" />
          <Ring value={student.weeklyRings.progresso} color="b" label="Progresso" />
          <Ring value={student.weeklyRings.servico} color="c" label="Serviço" />
        </Card>
      </div>

      {inProgress.length > 0 && (
        <div>
          <div className="text-[13px] font-semibold text-ink-secondary uppercase tracking-wide mb-2.5">
            Em andamento
          </div>
          <div className="flex gap-3">
            {inProgress.map((course) => (
              <Link key={course.id} href={`/cursos/${course.slug}`} className="flex-1">
                <Card className="p-4 flex flex-col gap-2.5 h-full">
                  <div className="w-8 h-8 rounded-[9px] bg-ink flex items-center justify-center">
                    <BookIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-[13.5px] font-semibold leading-tight">{course.title}</div>
                  <div className="h-[5px] rounded-full bg-[#f0f0f2] overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${course.progressPercent}%` }} />
                  </div>
                  <div className="text-[11px] text-ink-secondary">{course.progressPercent}% concluído</div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
