import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/dbConfig";
import Preferences from "@/models/preferencesModel";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const currentPreference = await Preferences.findOne({
      userId: session?.user._id,
    });

    if (!currentPreference)
      return NextResponse.json(
        {
          message: "Preferencia no encontrada",
        },
        {
          status: 404,
        }
      );

    const courseUpdated = await Preferences.findByIdAndUpdate(
      currentPreference._id,
      { connectedToDiscord: true },
      {
        new: true,
      }
    );

    if (!courseUpdated)
      return NextResponse.json(
        {
          message: "Preferencia no encontrada al momento de actualizar",
        },
        {
          status: 404,
        }
      );

    return NextResponse.json(
      {
        success: true,
        message: "Preferencias actualizadas correctamente",
        data: courseUpdated,
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
            : "Error en la actualización del curso",
      },
      { status: 500 }
    );
  }
}
