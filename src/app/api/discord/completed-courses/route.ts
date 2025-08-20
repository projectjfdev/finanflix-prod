// app/api/completed-courses/route.ts
import { NextResponse } from 'next/server';
import { getCompletedCoursesCount } from '@/lib/getCompletedCoursesCount';
import { connectDB } from '@/lib/dbConfig';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    await connectDB(); // asegurate de conectar a la DB
    const count = await getCompletedCoursesCount(userId);

    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener los cursos completados' }, { status: 500 });
  }
}
