// import { NextResponse } from 'next/server';
// import { connectDB } from '@/lib/dbConfig';
// import courseModel from '@/models/courseModel';
// import userModel from '@/models/userModel'; // Importar el modelo de usuario
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/authOptions';

// export async function POST(request: Request) {
//   try {
//     await connectDB();

//     // Obtener sesión y validar usuario autenticado
//     const session = await getServerSession(authOptions);
//     if (!session?.user) {
//       return NextResponse.json({ message: 'Usuario no autenticado.' }, { status: 401 });
//     }

//     const { courseTitle } = await request.json();
//     if (!courseTitle) {
//       return NextResponse.json({ message: 'El título del curso es requerido.' }, { status: 400 });
//     }

//     // Buscar curso
//     const course = await courseModel.findOne({ title: courseTitle });
//     if (!course) {
//       return NextResponse.json({ message: 'Curso no encontrado.' }, { status: 404 });
//     }

//     // Buscar y actualizar al usuario directamente en la base de datos
//     const updateResult = await userModel.updateOne(
//       { _id: session.user._id, enrolledCourses: { $ne: course._id } }, // Verifica que el curso no esté ya inscrito
//       {
//         $pull: { coursesToClaim: courseTitle }, // Elimina el curso de coursesToClaim
//         $addToSet: { enrolledCourses: course._id }, // Agrega el curso a enrolledCourses
//       }
//     );

//     if (updateResult.matchedCount === 0) {
//       return NextResponse.json(
//         {
//           message: 'El curso ya está inscrito o el usuario no fue encontrado.',
//         },
//         { status: 400 }
//       );
//     }

//     // Crea el progreso del curso para el usuario
//     // FIXED: Usar la ruta relativa en lugar de la ruta absoluta
//     await fetch(`${process.env.APP_URL}/api/cursos/course-progress`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         courseId: course._id.toString(),
//         userId: session.user._id.toString(),
//       }),
//     });

//     return NextResponse.json(
//       {
//         message: `Recuperaste tu curso ${courseTitle}`,
//         success: true,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       {
//         message: error instanceof Error ? error.message : 'Error en la recuperacion del curso.',
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConfig';
import courseModel from '@/models/courseModel';
import userModel from '@/models/userModel'; // Importar el modelo de usuario
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function POST(request: Request) {
  try {
    await connectDB();

    // Obtener sesión y validar usuario autenticado
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Usuario no autenticado.' }, { status: 401 });
    }

    const { courseTitle } = await request.json();
    if (!courseTitle) {
      return NextResponse.json({ message: 'El título del curso es requerido.' }, { status: 400 });
    }

    // Buscar curso
    const course = await courseModel.findOne({ title: courseTitle });
    if (!course) {
      return NextResponse.json({ message: 'Curso no encontrado.' }, { status: 404 });
    }

    // Eliminar el curso de coursesToClaim sin agregarlo a enrolledCourses
    await userModel.updateOne(
      { _id: session.user._id },
      {
        $pull: { coursesToClaim: courseTitle }, // Solo eliminamos de coursesToClaim
      }
    );

    // Llamar a course-progress para que maneje la inscripción y el progreso
    await fetch(`${process.env.APP_URL}/api/cursos/course-progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseId: course._id.toString(),
        userId: session.user._id.toString(),
      }),
    });

    return NextResponse.json(
      {
        message: `Recuperaste tu curso ${courseTitle}`,
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Error en la recuperación del curso.',
      },
      { status: 500 }
    );
  }
}
