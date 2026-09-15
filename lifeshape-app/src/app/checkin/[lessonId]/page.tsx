import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { requireSession } from "@/lib/dal";
import { ClassroomIOStudentError, confirmMyAttendance, getMyLesson, listMyCourses } from "@/lib/classroomio/student-client";

// Where a physical QR code (or a check-in link sent by a coordinator) sends
// the student's phone — see PROJECT_PLAN.md Etapa 3. Not inside (student)/:
// this is a one-shot confirmation screen, not part of the tab-bar app shell.

function StatusScreen({
  title,
  message,
  success,
  backHref,
}: {
  title: string;
  message: string;
  success?: boolean;
  backHref?: string;
}) {
  return (
    <div className="px-5 pt-14 pb-8 flex flex-col items-center gap-4 text-center min-h-screen">
      <div
        className={
          success
            ? "w-16 h-16 rounded-full bg-success-soft flex items-center justify-center"
            : "w-16 h-16 rounded-full bg-bg flex items-center justify-center"
        }
      >
        {success && <CheckIcon className="w-7 h-7 text-success" />}
      </div>
      <div className="text-[19px] font-bold tracking-tight">{title}</div>
      <p className="text-[14px] text-ink-secondary max-w-xs">{message}</p>
      {backHref && (
        <Link
          href={backHref}
          className="mt-2 inline-flex items-center gap-1.5 bg-ink text-white text-[14px] font-semibold px-5 py-2.5 rounded-full"
        >
          Ver aula
        </Link>
      )}
    </div>
  );
}

export default async function CheckinPage({
  params,
  searchParams,
}: {
  params: Promise<{ lessonId: string }>;
  searchParams: Promise<{ sig?: string }>;
}) {
  const { lessonId } = await params;
  const { sig } = await searchParams;
  const { token } = await requireSession();

  let lesson;
  try {
    lesson = await getMyLesson(token, lessonId);
  } catch (error) {
    const message =
      error instanceof ClassroomIOStudentError ? error.message : "Não foi possível encontrar esta aula.";
    return <StatusScreen title="Aula não encontrada" message={message} />;
  }

  const courseId = lesson.courseId;
  if (!courseId) {
    return <StatusScreen title="Aula não encontrada" message="Esta aula não está vinculada a um curso." />;
  }

  const courses = await listMyCourses(token);
  const courseSlugOrId = courses.find((c) => c.id === courseId)?.slug ?? courseId;
  const backHref = `/cursos/${courseSlugOrId}/${lessonId}`;

  if (!sig) {
    return (
      <StatusScreen
        title="Link inválido"
        message="Este link de presença não é válido. Peça pro responsável gerar o QR code de novo."
        backHref={backHref}
      />
    );
  }

  // Calling confirmMyAttendance directly (not the confirmAttendanceAction
  // Server Action) is deliberate: this page already runs fully
  // server-side with its own resolved session — there's no client→server
  // Action boundary being crossed here, and a Server Action's
  // revalidatePath is only supported when invoked that way (from a form
  // or a client event handler), not when awaited straight from a Server
  // Component's render. Next.js's normal dynamic-render behavior already
  // guarantees the course/lesson page fetches fresh data on the next
  // visit, since this whole app is forced dynamic by requireSession().
  let result;
  try {
    result = await confirmMyAttendance(token, courseId, lessonId, "qr_code", `${lessonId}.${sig}`);
  } catch (error) {
    const message =
      error instanceof ClassroomIOStudentError ? error.message : "Não foi possível confirmar sua presença.";
    return <StatusScreen title="Não foi possível confirmar" message={message} backHref={backHref} />;
  }

  return (
    <StatusScreen
      title={result.status === "confirmed" ? "Presença confirmada!" : "Presença enviada"}
      message={
        result.status === "pending"
          ? `${lesson.title} — aguardando confirmação do professor.`
          : lesson.title
      }
      success
      backHref={backHref}
    />
  );
}
