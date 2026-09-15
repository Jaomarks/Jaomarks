import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui";
import { ChevronLeftIcon } from "@/components/icons";
import { requireSession } from "@/lib/dal";
import { getMyInternship, listMyCourses } from "@/lib/classroomio/student-client";
import { EstagioClient } from "./estagio-client";

// Estágio obrigatório / horas complementares (Etapa 4) — não faz parte do
// mock aprovado originalmente; construído do zero seguindo o mesmo padrão
// visual das outras telas (ver checkin/[lessonId] na Etapa 3). Curso-level,
// não por aula: nem todo curso tem isso configurado (só quem um coordenador
// ativou via /public-api/staff/courses/:courseId/internship/setup).

export default async function EstagioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { token } = await requireSession();

  const courses = await listMyCourses(token);
  const summary = courses.find((c) => (c.slug ?? c.id) === slug);
  if (!summary) notFound();

  const internship = await getMyInternship(token, summary.id);

  return (
    <div className="px-5 pt-6 pb-8 flex flex-col gap-5">
      <Link
        href={`/cursos/${slug}`}
        className="inline-flex items-center gap-1.5 text-ink-secondary text-[13px] font-semibold w-fit"
      >
        <ChevronLeftIcon className="w-4 h-4" />
        {summary.title}
      </Link>

      <div className="text-[21px] font-bold tracking-tight leading-tight">Estágio e horas complementares</div>

      {!internship.configured ? (
        <Card className="p-4.5 text-[14px] text-ink-secondary">
          Este curso ainda não tem o envio de estágio configurado.
        </Card>
      ) : (
        <EstagioClient
          courseSlug={slug}
          courseId={summary.id}
          description={internship.exercise.description}
          totalApprovedWeeks={internship.totalApprovedWeeks}
          submissions={internship.submissions}
        />
      )}
    </div>
  );
}
