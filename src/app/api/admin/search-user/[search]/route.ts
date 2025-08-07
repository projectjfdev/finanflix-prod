import { connectDB } from "@/lib/dbConfig";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { search?: string } }
) {
  await connectDB();

  try {
    const { search } = params;

    if (!search || typeof search !== "string") {
      return NextResponse.json(
        { message: "Parámetro 'search' es requerido", success: false },
        { status: 400 }
      );
    }

    const user = await userModel.findOne({ email: search }).select("email");

    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado", success: false, data: null },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Usuario encontrado", success: true, data: user },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("❌ Error en el backend:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Error al buscar usuarios",
      },
      { status: 500 }
    );
  }
}
