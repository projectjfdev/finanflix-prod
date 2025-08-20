import { connectDB } from "@/lib/dbConfig";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { message: "No se proporcionó un archivo válido" },
        { status: 400 }
      );
    }

    const text = await file.text();
    let users;
    try {
      users = JSON.parse(text);
    } catch (error) {
      return NextResponse.json(
        { message: "Error al parsear el archivo JSON" },
        { status: 400 }
      );
    }

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { message: "El archivo debe contener un array de usuarios" },
        { status: 400 }
      );
    }

    const formattedUsers = users
      .map((user) => {
        if (!user.username || !user.email) {
          return null;
        }
        return {
          username: user.username,
          firstName: user.firstName || "", // Opcional
          lastName: user.lastName || "", // Opcional
          email: user.email,
          suscription: user.suscription
            ? {
                type: user.suscription.type || "",
                isActive: true,
                orderDate: user.suscription.orderDate
                  ? new Date(user.suscription.orderDate)
                  : null,
              }
            : undefined,
          coursesToClaim: Array.isArray(user.coursesToClaim)
            ? user.coursesToClaim
            : [],
          status: "Activo",
          verified: false,
        };
      })
      .filter(Boolean);

    if (formattedUsers.length === 0) {
      return NextResponse.json(
        { message: "El archivo JSON no tiene datos válidos" },
        { status: 400 }
      );
    }

    const insertedUsers = await userModel.insertMany(formattedUsers, {
      ordered: false, // Continúa con los demás si hay errores por duplicados
    });

    return NextResponse.json(
      {
        message: "Usuarios insertados exitosamente",
        success: true,
        insertedCount: insertedUsers.length,
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
