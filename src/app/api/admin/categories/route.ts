import { connectDB } from '@/lib/dbConfig';
import categoryModel from '@/models/categoryModel';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  try {
    const categories = await categoryModel.find();

    if (categories.length === 0) {
      return NextResponse.json({ message: 'No hay categorías creadas' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Categorias encontradas',
      data: categories,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error en la consulta' }, { status: 500 });
  }
}
