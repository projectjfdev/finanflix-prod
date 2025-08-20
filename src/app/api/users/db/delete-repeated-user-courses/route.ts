import { connectDB } from '@/lib/dbConfig';
import userModel from '@/models/userModel';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await connectDB();

  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ message: 'Email es requerido' }, { status: 400 });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const uniqueCourses: any = [];
    const courseSet = new Set();

    user.enrolledCourses.forEach((course: any) => {
      if (!courseSet.has(course.toString())) {
        courseSet.add(course.toString());
        uniqueCourses.push(course);
      }
    });

    user.enrolledCourses = uniqueCourses;
    await user.save();

    return NextResponse.json({ message: 'Cursos duplicados eliminados correctamente' });
  } catch (error) {
    return NextResponse.json({ message: 'Error al eliminar cursos duplicados' }, { status: 500 });
  }
}
