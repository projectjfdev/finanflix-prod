// https://www.youtube.com/watch?v=QyGJLm55EDk 44:45

import { NextResponse } from "next/server";
import Welcome from "@/models/welcomeEmailModel";
import userModel from "@/models/userModel";
import { connectDB } from "@/lib/dbConfig";

export async function POST(req: Request) {
  const body = await req.json();

  const { token } = body;

  await connectDB();
  const existingToken = await Welcome.findOne({ token });
  try {
    if (!existingToken)
      return NextResponse.json(
        {
          message: "Token inválido",
        },
        {
          status: 404,
        }
      );

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired)
      return NextResponse.json(
        {
          message: "El token ha expirado",
        },
        {
          status: 404,
        }
      );

    const existingUser = await userModel.findOne({
      email: existingToken.email,
    });

    if (!existingUser)
      return NextResponse.json(
        {
          message: "Ususario no encontrado",
        },
        {
          status: 404,
        }
      );
    existingUser.verified = true;
    await existingUser.save();

    //Una vez que se verificó el email, eliminamos el token de Welcome
    await Welcome.findByIdAndDelete(existingToken._id);

    return NextResponse.json(
      {
        success: true,
        message: "Email verificado",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
}
