import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConfig';
import courseModel from '@/models/courseModel';
import cloudinary from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await connectDB();
    const services = await courseModel.find();

    return NextResponse.json(services);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    let {
      title,
      subtitle,
      category,
      language,
      level,
      duration,
      thumbnail,
      trailer,
      description,
      isVisibleToSubscribers,
      outOfSale,
      isOnlyForSubscribers,
      sections,
      welcomeMessage,
      completedMessage,
      price,
    } = await request.json();

    //TODO: PONER VALIDACIONES
    // Validaciones
    // if (!title || !category || !language || !level || !sections?.length) {
    //   return NextResponse.json(
    //     { message: "Todos los campos requeridos deben estar completos." },
    //     { status: 400 }
    //   );
    // }

    // Validación de precio
    // const priceRegex = /^(?!0\d)(\d+)(\.\d{1,2})?$/;
    // if (isNaN(price) || !priceRegex.test(price.toString())) {
    //   return NextResponse.json(
    //     {
    //       message:
    //         "Precio incorrecto. Se permite enteros y decimales con hasta 2 dígitos. Ej: 10.50",
    //     },
    //     { status: 400 }
    //   );
    // }

    // Validación y carga de imágenes
    // if (!thumbnail) {
    //   return NextResponse.json(
    //     { message: "Por favor, ingresa la miniatura del curso." },
    //     { status: 400 }
    //   );
    // }

    const newImage = await cloudinary.uploader.upload(thumbnail, {
      folder: 'images',
      transformation: [
        {
          crop: 'fill',
          quality: 60,
          format: 'auto',
          strip_metadata: true,
          delivery: 'auto',
          bytes_limit: 200000,
        },
      ],
    });
    thumbnail = {
      public_id: newImage.public_id,
      url: newImage.secure_url,
    };

    // Crear curso en la base de datos
    const newCourse = new courseModel({
      title,
      subtitle,
      category,
      language,
      level,
      duration,
      thumbnail,
      trailer,
      description,
      isVisibleToSubscribers,
      outOfSale,
      isOnlyForSubscribers,
      sections,
      welcomeMessage,
      completedMessage,
      price,
    });

    await newCourse.save();
    revalidatePath(`/api/cursos/get-courses`);
    revalidatePath(`/api/admin/get-title-courses`);
    // revalidatePath(`/api/users/notifications`);
    return NextResponse.json(
      {
        message: 'Curso creado correctamente',
        success: true,
        courseId: newCourse,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Error en la creación del curso.',
      },
      { status: 500 }
    );
  }
}
