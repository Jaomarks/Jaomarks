import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui";
import { ChevronLeftIcon } from "@/components/icons";
import { requireSession } from "@/lib/dal";
import {
  ClassroomIOStudentError,
  getMyAttendance,
  getMyCourseDetail,
  getMyLesson,
  listMyCourses,
} from "@/lib/classroomio/student-client";
import { findLessonInCourse } from "@/lib/classroomio/course-helpers";
import { LessonClient } from "./lesson-client";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;
  const { token } = await requireSession();

  const courses = await listMyCourses(token);
  const summary = courses.find((c) => (c.slug ?? c.id) === slug);
  if (!summary) notFound();

  const [course, attendance] = await Promise.all([
    getMyCourseDetail(token, summary.id),
    // Presença (Etapa 3) é uma camada adicional sobre a aula — se algo
    // der errado aqui, a aula continua funcionando normalmente, só sem
    // a seção de presença.
    getMyAttendance(token, summary.id).catch(() => null),
  ]);
  const located = findLessonInCourse(course, lessonId);
  if (!located) notFound();

  const myAttendance = attendance?.lessons.find((item) => item.lessonId === lessonId) ?? null;

  // The listing above only reflects the raw "unlocked" admin toggle —
  // sequential-progression locks are only enforced here, when the lesson's
  // actual content is requested. Show that as a message, not a crash/404.
  let lesson;
  try {
    lesson = await getMyLesson(token, lessonId);
  } catch (error) {
    const message =
      error instanceof ClassroomIOStudentError
        ? error.message
        : "Não foi possível carregar esta aula.";

    return (
      <div className="px-5 pt-6 pb-8 flex flex-col gap-4">
        <Link href={`/cursos/${slug}`} className="flex items-center gap-2.5 text-ink w-fit">
          <ChevronLeftIcon className="w-5 h-5" />
          <span className="text-[12.5px] text-ink-secondary font-semibold">{course.title}</span>
        </Link>
        <Card className="p-4.5 text-[14px] text-ink-secondary">{message}</Card>
      </div>
    );
  }

  return (
    <LessonClient
      courseSlug={slug}
      courseId={summary.id}
      courseTitle={course.title}
      sectionIndex={located.sectionIndex}
      lessonIndex={located.lessonIndex}
      sectionLessons={located.sectionLessons.map((item) => ({ id: item.id, isComplete: item.isComplete }))}
      nextLessonId={located.nextLessonId}
      nextLessonTitle={located.nextLessonTitle}
      lesson={lesson}
      checkinMethods={attendance?.checkinMethods ?? []}
      attendanceStatus={myAttendance?.status ?? null}
      attendanceMethod={myAttendance?.method ?? null}
    />
  );
}
