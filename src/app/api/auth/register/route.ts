import { connectDB } from "@/lib/dbConfig";
import Users from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const { username, firstName, lastName, tel, email, password, verified } =
    await request.json();

  await connectDB();

  const existingUser = await Users.findOne({ email });
  const existingUsername = await Users.findOne({ username });

  if (existingUsername) {
    return NextResponse.json(
      { message: "El nombre de usuario ya existe", success: false },
      { status: 400 }
    );
  }

  if (existingUser) {
    return NextResponse.json(
      { message: "El email ya se encuentra registrado", success: false },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 5);
  const newUser = new Users({
    username,
    firstName,
    lastName,
    tel,
    email,
    password: hashedPassword,
    verified,
  });

  try {
    await newUser.save();
    return NextResponse.json(
      { message: "Usuario registrado correctamente", success: true, email },
      { status: 200 }
    );
  } catch (error: any) {
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
};
