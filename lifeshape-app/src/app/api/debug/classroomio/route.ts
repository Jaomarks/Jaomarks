import { NextResponse } from "next/server";
import { ClassroomIOError, listAudience, listCourses } from "@/lib/classroomio/client";

// Dev-only connectivity check for the ClassroomIO integration (Etapa 0).
// Never returns the API key itself — only what it can fetch with it.
export async function GET() {
  try {
    const [courses, audience] = await Promise.all([listCourses(), listAudience()]);
    return NextResponse.json({
      ok: true,
      courses: { count: courses.length, sample: courses.slice(0, 3) },
      audience: { count: audience.length, sample: audience.slice(0, 3) },
    });
  } catch (error) {
    if (error instanceof ClassroomIOError) {
      return NextResponse.json(
        { ok: false, error: error.message, status: error.status, code: error.code },
        { status: 502 },
      );
    }
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
