import { connectDB } from "@/lib/dbConfig";
import UserCourse from "@/models/userCourseModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");

    if (!userId || !courseId) {
      return NextResponse.json(
        { message: "userId y courseId son requeridos" },
        { status: 400 }
      );
    }

    // Busca el progreso del curso para el usuario
    const courseProgress = await UserCourse.findOne({
      userId,
      courseId,
    });

    if (!courseProgress) {
      return NextResponse.json(
        { message: "Progreso del curso no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(courseProgress, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Error en la consulta" },
      { status: 500 }
    );
  }
}
