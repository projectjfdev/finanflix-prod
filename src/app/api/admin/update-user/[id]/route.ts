import { connectDB } from '@/lib/dbConfig';
import userModel from '@/models/userModel';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const reqBody = await request.json();

    // Filtramos solo los campos definidos para evitar sobreescribir con undefined
    const updateData = Object.fromEntries(
      Object.entries(reqBody).filter(([_, value]) => value !== undefined)
    );

    const updatedUser = await userModel.findByIdAndUpdate(params.id, updateData, { new: true });

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'Usuario no encontrado', status: 404, success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Usuario actualizado',
        status: 200,
        success: true,
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || 'Error interno del servidor',
        status: 500,
        success: false,
      },
      { status: 500 }
    );
  }
}
