import { connectDB } from "@/lib/dbConfig";
import bannerTopModel from "@/models/bannerTopModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await connectDB();
  try {
    const banners = await bannerTopModel.find();

    if (banners.length === 0) {
      return NextResponse.json(
        { message: "No hay banners encontrados" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Banners encontrados",
        data: banners,
        success: true,
      }
      // ,
      // {
      //   headers: {
      //     "x-next-revalidate-tags": "bannersTop",
      //   },
      // }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Error en la consulta" },
      { status: 500 }
    );
  }
}
