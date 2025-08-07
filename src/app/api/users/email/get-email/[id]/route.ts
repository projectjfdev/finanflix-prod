import { connectDB } from "@/lib/dbConfig";
import Welcome from "@/models/welcomeEmailModel";

import { NextResponse } from "next/server";

export async function GET(
  request: any,
  { params }: { params: { [key: string]: string } }
) {
  try {
    await connectDB();

    const email = await Welcome.findOne({ token: params.id });
    return NextResponse.json(
      {
        success: true,
        message: "Mostrando el email del usuario",
        email: email,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
}
