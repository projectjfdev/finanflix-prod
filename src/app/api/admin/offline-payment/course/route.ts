import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConfig';
import courseModel from '@/models/courseModel';
import userModel from '@/models/userModel';
import orderModel from '@/models/orderModel';
import { validateAdminSession } from '@/lib/security';

export async function POST(request: Request) {
  try {
    await connectDB();

    const validationResponse = await validateAdminSession();
    if (validationResponse) {
      return validationResponse;
    }

    const body = await request.json();
    const { courseId, userId, orderId } = body;

    if (!courseId || !userId) {
      return NextResponse.json(
        { message: 'El ID del curso y del usuario son requeridos.' },
        { status: 400 }
      );
    }

    // Verificar si el curso existe
    const course = await courseModel.findById(courseId);
    if (!course) {
      return NextResponse.json({ message: 'El curso no existe.' }, { status: 404 });
    }

    // Verificar si el usuario existe
    const user = await userModel.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'El usuario no existe.' }, { status: 404 });
    }

    // Verificar si la orden existe y su estado
    const order = await orderModel.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { message: 'La orden no existe en la base de datos.' },
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
        message: 'Curso pagado',
        success: true,
      },
      { status: 200 }
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
