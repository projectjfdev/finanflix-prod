import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConfig";
import courseModel from "@/models/courseModel";
import userCourseModel from "@/models/userCourseModel";
import userModel from "@/models/userModel";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { courseId, userId } = body;

    if (!courseId || !userId) {
      return NextResponse.json(
        { message: "El ID del curso y del usuario son requeridos." },
        { status: 400 }
      );
    }

    // Verificar si el curso existe
    const course = await courseModel.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { message: "El curso no existe." },
        { status: 404 }
      );
    }

    // Verificar si el usuario existe
    const user = await userModel.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "El usuario no existe." },
        { status: 404 }
      );
    }

    // Verificar si el progreso del curso ya existe
    const existingProgress = await userCourseModel.findOne({
      userId,
      courseId,
    });
    if (existingProgress) {
      return NextResponse.json(
        {
          message: `El progreso del curso ya existe para este usuario.`,
          success: true,
        },
        { status: 200 }
      );
    }

    // Crear el progreso inicial basado en las secciones y lecciones del curso
    const progress = course.sections.map((section: any) => ({
      sectionId: section._id,
      lessons: section.lessons.map((lesson: any) => ({
        lessonId: lesson._id,
        isViewed: { status: false },
      })),
    }));

    // Crear el documento en la colección `UserCourse`
    const newCourseProgress = await userCourseModel.create({
      userId,
      courseId,
      progress,
      enrollmentDate: new Date(),
    });

    return NextResponse.json(
      {
        message: "Progreso del curso creado correctamente",
        success: true,
        courseProgress: newCourseProgress,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Error en la creación del progreso del curso.",
      },
      { status: 500 }
    );
  }
}
