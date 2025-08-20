import { connectDB } from '@/lib/dbConfig';
import userModel from '@/models/userModel';
import { NextResponse } from 'next/server';

const courseMap: any = {
  'DeFi Avanzado': 'DeFi Avanzado',
  'Curso de Trading Pro': 'Trading Pro',
  'Analisis fundamental': 'Análisis fundamental | Curso avanzado',
  'Trading Avanzado': 'Trading avanzado',
  'Curso Analisis Tecnico de 0 a 100': 'Análisis Técnico de 0 a 100',
  'Halving Bundle': 'Halving Bundle',
  'NFTs Revolution': 'NFTs Revolution',
  'Trading Pro': 'Trading Pro',
  'AT - O-100': 'Análisis Técnico de 0 a 100',
  "NFT's": 'NFTs Revolution',
  'Finanzas Personales': 'Finanzas Personales',
  'Guia DeFi-nitiva': 'DeFi Avanzado',
  'Curso StartZero': 'StartZero',
  'Curso de bolsa argentina': 'Bolsa argentina',
  'Curso de Bootstrap': 'StartZero',
  'Trading avanzado': 'Trading avanzado',
  'Analisis tecnico': 'Análisis Técnico de 0 a 100',
};

export async function PUT() {
  try {
    await connectDB();

    // Obtener todos los usuarios que tienen coursesToClaim
    const users = await userModel.find({ coursesToClaim: { $exists: true, $ne: [] } });

    for (const user of users) {
      user.coursesToClaim = user.coursesToClaim.map((course: any) => courseMap[course] || course);
      await user.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Cursos actualizados correctamente',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Error desconocido al actualizar los cursos',
      },
      { status: 500 }
    );
  }
}
