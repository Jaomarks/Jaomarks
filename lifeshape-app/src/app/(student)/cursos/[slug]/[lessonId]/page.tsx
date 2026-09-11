import { notFound } from "next/navigation";
import { courses, findLesson } from "@/lib/data";
import { LessonClient } from "./lesson-client";

export async function generateStaticParams() {
  return courses.flatMap((c) =>
    c.modules.flatMap((m) => m.lessons.map((l) => ({ slug: c.slug, lessonId: l.id }))),
  );
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;
  const found = findLesson(slug, lessonId);
  if (!found) notFound();

  return <LessonClient slug={slug} lessonId={lessonId} />;
}
