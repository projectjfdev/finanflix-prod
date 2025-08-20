import { connectDB } from '@/lib/dbConfig';
import courseModel from '@/models/courseModel';
import userModel from '@/models/userModel';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { [key: string]: string } }) {
  await connectDB();
  try {
    // Obtener los parámetros de la URL
    // const { search } = Object.fromEntries(new URL(request.url).searchParams);
    const { search } = params;

    if (!search || typeof search !== 'string') {
      return NextResponse.json(
        {
          message: "Parámetro 'search' es requerido",
          success: false,
        },
        { status: 400 }
      );
    }
    // Buscar usuarios cuyo email comience con la cadena 'search'
    const users = await userModel
      .find({
        email: { $regex: `^${search}`, $options: 'i' }, // La opción 'i' hace la búsqueda insensible a mayúsculas
      })
      .select('email username enrolledCourses suscription discordId firstName lastName tel')
      .populate({
        path: 'enrolledCourses',
        select: 'title',
        model: courseModel,
      });

    return NextResponse.json(
      {
        message: 'Usuarios encontrados',
        success: true,
        data: users,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Error al encontrar usuarios',
      },
      { status: 500 }
    );
  }
}
