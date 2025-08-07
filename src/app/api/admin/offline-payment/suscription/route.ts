import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConfig';
import userModel from '@/models/userModel';
import suscriptionOrderModel from '@/models/suscriptionOrderModel';
import { validateAdminSession } from '@/lib/security';

export async function POST(request: Request) {
  try {
    await connectDB();
    const validationResponse = await validateAdminSession();
    if (validationResponse) {
      return validationResponse;
    }
    const body = await request.json();
    const { userId, orderId } = body;

    if (!userId) {
      return NextResponse.json({ message: 'No se ha encontrado el usuario' }, { status: 400 });
    }

    // Verificar si el usuario existe
    const user = await userModel.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'El usuario no existe.' }, { status: 404 });
    }

    // Verificar si la orden existe y su estado
    const order = await suscriptionOrderModel.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { message: 'La orden de compra no existe en la base de datos.' },
        { status: 404 }
      );
    }

    if (order.status === 'Pagado') {
      return NextResponse.json(
        { message: 'La orden ya está marcada como pagada.' },
        { status: 400 }
      );
    }

    order.status = 'Pagado';
    await order.save();

    return NextResponse.json(
      {
        message: `Suscripción pagada`,
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Error en la creación del progreso del curso.',
      },
      { status: 500 }
    );
  }
}
