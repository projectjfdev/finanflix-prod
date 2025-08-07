import { connectDB } from '@/lib/dbConfig';
import courseModel from '@/models/courseModel';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const pageParam = searchParams.get('page');
  const page = pageParam ? parseInt(pageParam) : 1;
  const limit = 3;

  try {
    const courses = await courseModel
      .find({})
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCount = await courseModel.countDocuments();

    return NextResponse.json({ courses, totalCount });
  } catch (error) {
    // console.error(error);
    return NextResponse.json({ error: 'Error al obtener los cursos' }, { status: 500 });
  }
}
