import { connectDB } from '@/lib/dbConfig';
import userModel from '@/models/userModel';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();

  try {
    // Buscar usuarios con firstName o lastName fuera del rango permitido
    const invalidUsers = await userModel
      .find({
        $or: [
          { firstName: { $exists: true, $not: { $regex: /^.{2,15}$/ } } }, // No está vacío y no cumple con 2-15 caracteres
          { lastName: { $exists: true, $not: { $regex: /^.{2,15}$/ } } }, // No está vacío y no cumple con 2-15 caracteres
        ],
      })
      .select('email'); // Solo traemos los emails

    // Extraer solo los emails
    const invalidEmails = invalidUsers.map(user => user.email);

    return NextResponse.json({ invalidEmails });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error' }, { status: 500 });
  }
}
