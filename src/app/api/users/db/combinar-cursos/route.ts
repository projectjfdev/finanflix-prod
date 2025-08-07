import { connectDB } from '@/lib/dbConfig';
import userModel from '@/models/userModel';
import courseModel from '@/models/courseModel';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await connectDB();

  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob;

    if (!file) {
      return NextResponse.json({ message: 'No se subió ningún archivo' }, { status: 400 });
    }

    const fileText = await file.text();
    const usersData = JSON.parse(fileText);

    for (const userData of usersData) {
      const { email, coursesToClaim } = userData;
      const user = await userModel.findOne({ email }).populate('enrolledCourses');

      if (!user) continue;

      const enrolledCourseNames = new Set(user.enrolledCourses.map((course: any) => course.title));

      const updatedCoursesToClaim = new Set(user.coursesToClaim);

      for (const courseName of coursesToClaim) {
        if (!enrolledCourseNames.has(courseName)) {
          const courseExists = await courseModel.findOne({ title: courseName });
          if (courseExists) {
            updatedCoursesToClaim.add(courseName);
          }
        }
      }

      user.coursesToClaim = Array.from(updatedCoursesToClaim);
      await user.save();
    }

    return NextResponse.json({ message: 'Usuarios actualizados correctamente' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error' }, { status: 500 });
  }
}
