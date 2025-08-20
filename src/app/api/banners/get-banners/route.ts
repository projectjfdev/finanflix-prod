import { connectDB } from "@/lib/dbConfig";
import bannerTopModel from "@/models/bannerTopModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await connectDB();
  try {
    const currentDate = new Date();

    // Filtrar banners por isActive y rango de fechas
    // const banners = await bannerTopModel.find({
    //   isActive: true,
    //   startDate: { $lte: currentDate },
    //   endDate: { $gte: currentDate },
    // });

    const banners = await bannerTopModel.find({ isActive: true });   // TODO: CAMBIOS TEST


    if (banners.length === 0) {
      return NextResponse.json(
        { message: "No hay banners encontrados" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Banners encontrados",
      data: banners,
      success: true,
    });


  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Error en la consulta" },
      { status: 500 }
    );
  }
}
