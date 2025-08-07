import { connectDB } from "@/lib/dbConfig";
import courseModel from "@/models/courseModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await connectDB();
  try {
    const courses = await courseModel.find().select("title");

    if (courses.length === 0) {
      return NextResponse.json(
        { message: "No hay cursos encontrados" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Cursos encontrados",
      data: courses,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Error en la consulta" },
      { status: 500 }
    );
  }
}
