import Users from '@/models/userModel';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConfig';
import courseModel from '@/models/courseModel';

export async function GET(request: Request, { params }: { params: { [key: string]: string } }) {
  await connectDB();

  try {
    const currentUser = await Users.findById(params.id);
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const subscriptionType = currentUser.suscription?.type?.split(' - ')[0];

    if (!subscriptionType) {
      return NextResponse.json(
        { success: false, message: 'El usuario no tiene una suscripción válida' },
        { status: 400 }
      );
    }

    const allCourses = await courseModel.find();

    const subscriptionCourses = allCourses
      .filter((course: any) => course.isVisibleToSubscribers?.includes(subscriptionType))
      .map((course: any) => course.title);

    return NextResponse.json(
      {
        success: true,
        message: 'Cursos de suscripción del usuario',
        subscriptionCourses,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
