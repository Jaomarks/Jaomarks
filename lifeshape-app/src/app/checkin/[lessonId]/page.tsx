import { requireSession } from "@/lib/dal";
import { ClassroomIOStudentError, getMyLesson, listMyCourses } from "@/lib/classroomio/student-client";
import { StatusScreen } from "./status-screen";
import { CheckinClient } from "./checkin-client";

// Where a physical QR code (or a check-in link sent by a coordinator) sends
// the student's phone — see PROJECT_PLAN.md Etapa 3. Not inside (student)/:
// this is a one-shot confirmation screen, not part of the tab-bar app shell.
// This page only resolves context (lesson, course); actually confirming
// happens client-side on an explicit tap (checkin-client.tsx) — both so a
// bare page load can never silently confirm anyone's presence, and so the
// confirmation goes through the real confirmAttendanceAction Server Action
// (revalidatePath only works invoked that way, not awaited straight from a
// Server Component's render).

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

  return (
    <CheckinClient
      courseSlug={courseSlugOrId}
      courseId={courseId}
      lessonId={lessonId}
      lessonTitle={lesson.title}
      sig={sig}
      backHref={backHref}
    />
  );
}
