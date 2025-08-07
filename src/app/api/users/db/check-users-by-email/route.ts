import { connectDB } from '@/lib/dbConfig';
import userModel from '@/models/userModel';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await connectDB();

  try {
    // Obtener el archivo JSON adjunto
    const formData = await req.formData();
    const file = formData.get('file') as Blob;

    if (!file) {
      return NextResponse.json({ message: 'No se adjuntó ningún archivo' }, { status: 400 });
    }

    // Leer el contenido del archivo
    const text = await file.text();
    const newUsers = JSON.parse(text);

    if (!Array.isArray(newUsers)) {
      return NextResponse.json(
        { message: 'El archivo JSON debe contener un array' },
        { status: 400 }
      );
    }

    // Obtener los emails existentes en la base de datos
    const existingUsers = await userModel.find({}, 'email');
    const existingEmails = new Set(existingUsers.map(user => user.email));

    // Filtrar los correos que NO están en la base de datos
    const uniqueEmails = newUsers
      .map(user => user.email)
      .filter(email => !existingEmails.has(email));

    return NextResponse.json({
      uniqueEmails,
      count: uniqueEmails.length,
    });
  } catch (error) {
    // console.error('Error en la verificación:', error);
    return NextResponse.json({ message: 'Error en la verificación' }, { status: 500 });
  }
}
