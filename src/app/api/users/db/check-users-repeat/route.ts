import { connectDB } from '@/lib/dbConfig';
import userModel from '@/models/userModel';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await connectDB();

  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob;

    if (!file) {
      return NextResponse.json({ message: 'No se subió ningún archivo' }, { status: 400 });
    }

    const text = await file.text();
    const usersFromFile = JSON.parse(text);

    if (!Array.isArray(usersFromFile)) {
      return NextResponse.json({ message: 'Formato JSON inválido' }, { status: 400 });
    }

    // Obtener los emails del JSON cargado
    const emails = usersFromFile.map(user => user.email);

    // Buscar en la base de datos los usuarios con esos emails
    const existingUsers = await userModel.find({ email: { $in: emails } }, { email: 1, _id: 0 });

    // Extraer solo los emails que ya existen en la base de datos
    const existingEmails = new Set(existingUsers.map(user => user.email));

    // Filtrar los usuarios que YA están en la base de datos (se repiten)
    const repeatedUsers = usersFromFile.filter(user => existingEmails.has(user.email));

    return NextResponse.json({
      repeatedUsers, // Devolvemos solo los usuarios que se repiten
      count: repeatedUsers.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Error en la verificación' },
      { status: 500 }
    );
  }
}
