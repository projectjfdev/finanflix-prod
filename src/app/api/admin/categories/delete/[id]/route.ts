import { connectDB } from "@/lib/dbConfig";
import { validateAdminSession } from "@/lib/security";
import categoryModel from "@/models/categoryModel";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { [key: string]: string } }
) {
  await connectDB();

  try {
    const validationResponse = await validateAdminSession();
    if (validationResponse) {
      return validationResponse;
    }
    const category = await categoryModel.findById(params.id);

    if (!category) {
      return NextResponse.json(
        {
          message: "Categoría no encontrada",
          success: false,
        },
        {
          status: 404,
        }
      );
    }

    await categoryModel.findByIdAndDelete(params.id);
    revalidatePath(`/api/admin/categories`);
    return NextResponse.json(
      {
        message: "Categoría eliminada correctamente",
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Error al eliminar la categoría",
      },
      { status: 500 }
    );
  }
}
