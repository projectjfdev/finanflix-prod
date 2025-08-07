import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConfig';
// import cloudinary from '@/lib/cloudinary';
import liveLessonModel from '@/models/liveLessonModel';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    await connectDB();
    let { title, category, description, videoUrl, lessonDate } = await request.json();

    // if (!thumbnail) {
    //   return NextResponse.json(
    //     { message: 'Por favor, ingresa la miniatura del curso.' },
    //     { status: 400 }
    //   );
    // }

    // const newImage = await cloudinary.uploader.upload(thumbnail, {
    //   folder: 'images',
    //   transformation: [
    //     {
    //       crop: 'fill',
    //       quality: 60,
    //       format: 'auto',
    //       strip_metadata: true,
    //       delivery: 'auto',
    //       bytes_limit: 200000,
    //     },
    //   ],
    // });
    // thumbnail = {
    //   public_id: newImage.public_id,
    //   url: newImage.secure_url,
    // };

    const newLiveLesson = new liveLessonModel({
      title,
      category,
      // thumbnail,
      description,
      videoUrl,
      lessonDate,
    });

    await newLiveLesson.save();
    revalidatePath(`/api/live-lesson/get-lessons`);
    return NextResponse.json(
      {
        message: 'Clase en vivo creada correctamente',
        success: true,
        courseId: newLiveLesson,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Error en la creación de la clase en vivo',
      },
      { status: 500 }
    );
  }
}
