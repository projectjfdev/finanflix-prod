import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConfig';
import userModel from '@/models/userModel';
import { validateAdminSession } from '@/lib/security';

export async function PUT(request: Request) {
  try {
    await connectDB();
    const validationResponse = await validateAdminSession();
    if (validationResponse) {
      return validationResponse;
    }
    // Obtener el body de la solicitud
    const body = await request.json();
    const { userId } = body;

    // Verificar si el usuario existe
    const user = await userModel.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'El usuario no existe.' }, { status: 404 });
    }

    // Limpiar los campos de suscripción
    await userModel.findByIdAndUpdate(userId, {
      suscription: {
        type: null,
        isActive: false,
        orderDate: null,
      },
    });

    return NextResponse.json(
      {
        message: 'La suscripción del usuario ha sido eliminada correctamente.',
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Error al intentar eliminar la suscripción.',
      },
      { status: 500 }
    );
  }
}
