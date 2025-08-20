import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConfig";
import orderModel from "@/models/orderModel";

export async function POST(request: Request) {
  try {
    await connectDB();
    let {
      userId,
      courseId,
      price,
      orderTitle,
      firstName,
      lastName,
      email,
      phone,
      country,
      address,
      postalCode,
      dni,
      username,
      serviceDetail,
      paymentMethod,
    } = await request.json();

    // Validaciones
    if (!email) {
      return NextResponse.json(
        {
          message:
            "Todos los campos deben ser completados antes de realizar una compra",
        },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 400 }
      );
    }

    if (!courseId) {
      return NextResponse.json(
        { message: "Curso no encontrada" },
        { status: 400 }
      );
    }

    const newOrder = new orderModel({
      userId,
      courseId,
      price,
      orderTitle,
      firstName,
      lastName,
      email,
      username,
      phone,
      country,
      address,
      postalCode,
      dni,
      serviceDetail,
      paymentMethod,
    });

    await newOrder.save();

    return NextResponse.json(
      {
        message: "Orden creada correctamente",
        success: true,
        courseId: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Error en la creación de la orden",
      },
      { status: 500 }
    );
  }
}
