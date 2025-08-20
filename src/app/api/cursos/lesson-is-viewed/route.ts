import { ILessons, ISection } from "@/interfaces/course";
import { connectDB } from "@/lib/dbConfig";
import UserCourse from "@/models/userCourseModel";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  await connectDB();
  try {
    // Recibe el userId o el userCourseId junto con el lessonId
    const { userCourseId, lessonId } = await request.json();

    if (!userCourseId || !lessonId) {
      return NextResponse.json(
        { message: "El userCourseId y el lessonId son requeridos" },
        { status: 400 }
      );
    }

    // Encuentra el curso del usuario y verifica si la lección ya está marcada como vista
    const userCourse = await UserCourse.findOne({
      _id: userCourseId, // Filtra por el curso específico del usuario
      "progress.lessons.lessonId": lessonId,
    });

    

    if (!userCourse) {
      return NextResponse.json(
        {
          message: "Curso o lección no encontrados para el usuario",
        },
        { status: 404 }
      );
    }

    // Verifica si la lección ya está marcada como vista
    const lesson = userCourse.progress.flatMap((section: ISection) =>
      section.lessons.filter(
        (lesson: any) => lesson.lessonId.toString() === lessonId
      )
    )[0];

    if (lesson?.isViewed?.status === true) {
      return NextResponse.json(
        {
          message: "La lección ya está marcada como vista",
        },
        { status: 200 }
      );
    }

    // Si no está vista, entonces la actualizamos
    const updatedUserCourse = await UserCourse.findOneAndUpdate(
      {
        _id: userCourseId, // Asegúrate de filtrar por el curso específico del usuario
        "progress.lessons.lessonId": lessonId,
      },
      {
        $set: {
          "progress.$[].lessons.$[lesson].isViewed.status": true,
          "progress.$[].lessons.$[lesson].isViewed.viewedAt": new Date(),
        },
      },
      {
        arrayFilters: [{ "lesson.lessonId": lessonId }],
        new: true, // Devuelve el documento actualizado
      }
    );

    if (!updatedUserCourse) {
      return NextResponse.json(
        {
          message: "Error al actualizar la lección",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "La lección fue marcada como vista",
        success: true,
        updatedUserCourse,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Error actualizando la lección" },
      { status: 500 }
    );
  }
}
