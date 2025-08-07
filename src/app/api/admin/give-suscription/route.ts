import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConfig';
import userModel from '@/models/userModel';
import { validateAdminSession } from '@/lib/security';

export async function PUT(request: Request) {
  const today = new Date();

  try {
    await connectDB();

    const validationResponse = await validateAdminSession();
    if (validationResponse) {
      return validationResponse;
    }

    // Obtener datos de la solicitud
    const body = await request.json();
    const { suscriptionType, userId } = body;

    // Verificar si el usuario existe
    const user = await userModel.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'El usuario no existe.' }, { status: 404 });
    }

    // Verificar si el usuario ya tiene una suscripción activa
    if (user.suscription?.isActive) {
      return NextResponse.json(
        { message: 'El usuario ya tiene una suscripción activa.' },
        { status: 400 }
      );
    }

    // Actualizar la suscripción del usuario
    await userModel.findByIdAndUpdate(userId, {
      suscription: {
        type: suscriptionType,
        isActive: true,
        orderDate: today,
      },
    });

    return NextResponse.json(
      {
        message: `La suscripción '${suscriptionType}' ha sido otorgada al usuario.`,
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Error en la asignación de la suscripción.',
      },
      { status: 500 }
    );
  }
}
