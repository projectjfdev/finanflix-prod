import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConfig";
import categoryModel from "@/models/categoryModel";
import { validateAdminSession } from "@/lib/security";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    await connectDB();
    let { name } = await request.json();
    const existingCategory = await categoryModel.findOne({ name });
    const validationResponse = await validateAdminSession();
    if (validationResponse) {
      return validationResponse;
    }

    // Validaciones
    if (!name) {
      return NextResponse.json(
        {
          message: "El nombre de la categoria es requerido",
        },
        { status: 400 }
      );
    }

    if (name.length < 3 || name.length > 50) {
      return NextResponse.json(
        {
          message:
            "El nombre de la categoría debe tener entre 3 y 50 caracteres.",
        },
        { status: 400 }
      );
    }

    if (!name.trim()) {
      return NextResponse.json(
        {
          message:
            "El nombre de la categoría no puede estar vacío o contener solo espacios.",
        },
        { status: 400 }
      );
    }

    if (existingCategory) {
      return NextResponse.json(
        {
          message: "Ya existe una categoría con este nombre.",
        },
        { status: 400 }
      );
    }

    const newCategory = new categoryModel({
      name,
    });

    await newCategory.save();
    revalidatePath(`/api/admin/categories`);
    return NextResponse.json(
      {
        message: "La categoria fue creada correctamente",
        success: true,
        banner: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Error en la creación de la nueva categoria",
      },
      { status: 500 }
    );
  }
}
