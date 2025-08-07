import { connectDB } from '@/lib/dbConfig';
import userModel from '@/models/userModel';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await connectDB();

  try {
    // Obtener todos los usuarios
    const users = await userModel.find();

    // Cursos a añadir
    const newCourses = ['Análisis fundamental | Curso avanzado', 'DeFi Avanzado', 'Trading Pro'];

    // Actualizar los usuarios que tengan "Halving Bundle" en coursesToClaim
    for (let user of users) {
      const hasHalvingBundle = user.coursesToClaim.includes('Halving Bundle');

      if (hasHalvingBundle) {
        // Reemplazar Halving Bundle por los nuevos cursos
        user.coursesToClaim = user.coursesToClaim
          .map((course: any) => (course === 'Halving Bundle' ? newCourses : course))
          .flat();

        // Guardar cambios en la base de datos
        await user.save();
      }
    }

    return NextResponse.json({ message: 'Usuarios actualizados correctamente' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Error en la verificación' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await connectDB();

  try {
    // Buscar usuarios con "Halving Bundle" en coursesToClaim
    const usersWithHalvingBundle = await userModel
      .find({ coursesToClaim: 'Halving Bundle' })
      .select('email'); // Solo seleccionar el campo email

    // Crear un array con solo los emails
    const emails = usersWithHalvingBundle.map(user => user.email);

    return NextResponse.json(emails, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Error en la obtención de usuarios' },
      { status: 500 }
    );
  }
}
