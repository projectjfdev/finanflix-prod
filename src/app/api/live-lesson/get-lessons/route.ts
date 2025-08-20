import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConfig";
import liveLessonModel from "@/models/liveLessonModel";

// New GET method to retrieve live lessons
export async function GET() {
  try {
    await connectDB();

    // Query to get all live lessons from the database
    const liveLessons = await liveLessonModel
      .find()
      .sort({ createdAt: -1 })
      .limit(3);

    // If no lessons are found
    if (!liveLessons.length) {
      return NextResponse.json(
        { message: "No hay clases en vivo disponibles." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Clases en vivo encontradas correctamente",
        success: true,
        data: liveLessons,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Error al obtener las clases en vivo",
      },
      { status: 500 }
    );
  }
}
