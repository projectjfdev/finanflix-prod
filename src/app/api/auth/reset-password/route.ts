import { hashString } from '@/utils/passwordUtils';
import { NextRequest, NextResponse } from 'next/server';
import Reset from '@/models/resetPasswordModel';
import userModel from '@/models/userModel';
import { connectDB } from '@/lib/dbConfig';

export async function POST(request: NextRequest) {
  const { email, token, newPassword, newPasswordConfirm } = await request.json();
  await connectDB();

  const existingToken = await Reset.findOne({ token });

  try {
    if (!existingToken)
      return NextResponse.json(
        {
          message: 'Se ha producido un error, token invalido',
        },
        {
          status: 404,
        }
      );

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired)
      return NextResponse.json(
        {
          message: 'Se ha producido un error, el token ha expirado',
        },
        {
          status: 404,
        }
      );

    const requestedByUser = await Reset.findOne({
      email,
      token,
    });

    if (!requestedByUser)
      return NextResponse.json(
        {
          message: `El usuario ${email} no ha solicitado un cambio de contraseña`,
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
          message: `${existingToken.email} no se encuentra registrado en nuestra plataforma`,
        },
        {
          status: 404,
        }
      );

    if (newPassword !== newPasswordConfirm)
      return NextResponse.json(
        { success: false, message: 'La nueva contraseña no coincide' },
        { status: 400 }
      );

    const hashedPassword = await hashString(newPassword);
    existingUser.password = hashedPassword;
    await existingUser.save();

    //Una vez que se verificó el email, eliminamos el token de Welcome
    await Reset.findByIdAndDelete(existingToken._id);

    return NextResponse.json(
      {
        success: true,
        message: '¡Contraseña reestablecida exitosamente!',
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
