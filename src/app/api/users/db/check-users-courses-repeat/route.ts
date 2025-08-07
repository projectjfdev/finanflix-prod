import { connectDB } from '@/lib/dbConfig';
import userModel from '@/models/userModel';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  await connectDB();

  try {
    // Obtener todos los usuarios con sus cursos inscritos
    const users = await userModel.find().populate('enrolledCourses');

    // Almacenar emails de usuarios con cursos repetidos
    const repeatedUsersEmails: any = [];

    users.forEach(user => {
      const courseIds = user.enrolledCourses.map((course: any) => course._id.toString());
      const courseSet = new Set();
      const duplicates = new Set();

      courseIds.forEach((id: any) => {
        if (courseSet.has(id)) {
          duplicates.add(id);
        } else {
          courseSet.add(id);
        }
      });

      if (duplicates.size > 0) {
        repeatedUsersEmails.push(user.email);
      }
    });

    return NextResponse.json({
      repeatedUsersEmails,
      count: repeatedUsersEmails.length,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error en la verificación' }, { status: 500 });
  }
}
