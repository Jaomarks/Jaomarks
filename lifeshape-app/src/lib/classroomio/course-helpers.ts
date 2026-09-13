// Pure helpers for shaping real ClassroomIO course content (student-client.ts)
// into what the course/lesson pages render — the real-data equivalent of the
// courseProgress/findLesson/nextLessonId helpers in @/lib/data. No fetching
// here, just shaping already-fetched data, so this is safe to import from
// both server and client components.

import type { CourseContentItem, CourseContentSection, StudentCourseDetail } from "./student-client";

/**
 * Sections filtered down to lesson-type items only — a section's items can
 * include exercises too, but exercise content/submission is Etapa 4 scope.
 * Courses without content grouping enabled (rare; defaults to on) fall back
 * to a single synthetic section so callers only ever deal with one shape.
 */
export function lessonSections(course: StudentCourseDetail): CourseContentSection[] {
  if (!course.grouped) {
    const lessons = course.items.filter((item) => item.type === "LESSON");
    return lessons.length > 0 ? [{ id: "__all__", title: course.title, order: 0, items: lessons }] : [];
  }

  return course.sections
    .map((section) => ({ ...section, items: section.items.filter((item) => item.type === "LESSON") }))
    .filter((section) => section.items.length > 0);
}

/** Every lesson in the course, in display order, across all sections. */
export function flattenLessons(course: StudentCourseDetail): CourseContentItem[] {
  return lessonSections(course).flatMap((section) => section.items);
}

/** First lesson (in display order) the student hasn't completed yet. */
export function findNextIncompleteLesson(course: StudentCourseDetail): CourseContentItem | null {
  return flattenLessons(course).find((lesson) => lesson.isComplete !== true) ?? null;
}

/** Locates one lesson within a course: its section, position, and the lesson right after it. */
export function findLessonInCourse(course: StudentCourseDetail, lessonId: string) {
  const sections = lessonSections(course);

  for (const [sectionIndex, section] of sections.entries()) {
    const lessonIndex = section.items.findIndex((item) => item.id === lessonId);
    if (lessonIndex === -1) continue;

    const flat = sections.flatMap((s) => s.items);
    const flatIndex = flat.findIndex((item) => item.id === lessonId);

    return {
      section,
      sectionIndex,
      lessonIndex,
      item: section.items[lessonIndex],
      sectionLessons: section.items,
      nextLessonId: flat[flatIndex + 1]?.id ?? null,
      nextLessonTitle: flat[flatIndex + 1]?.title ?? null,
    };
  }

  return null;
}
