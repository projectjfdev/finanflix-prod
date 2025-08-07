import cloudinary from '@/lib/cloudinary';
import { connectDB } from '@/lib/dbConfig';
import liveLessonModel from '@/models/liveLessonModel';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { [key: string]: string } }) {
  try {
    await connectDB();
    const body = await request.json();
    const currentLiveLesson = await liveLessonModel.findById(params.id);

    if (!currentLiveLesson)
      return NextResponse.json(
        {
          message: 'Clase en vivo no encontrada',
        },
        {
          status: 404,
        }
      );

    let updateLiveLesson = { ...body };

    // if (updateLiveLesson.thumbnail) {
    //   if (
    //     currentLiveLesson.thumbnail &&
    //     currentLiveLesson.thumbnail.public_id
    //   ) {
    //     const previousImgId = currentLiveLesson.thumbnail.public_id;
    //     await cloudinary.uploader.destroy(previousImgId);
    //   }

    //   const newImage = await cloudinary.uploader.upload(
    //     updateLiveLesson.thumbnail,
    //     {
    //       folder: "images",
    //       transformation: [
    //         {
    //           crop: "fill",
    //           quality: 60,
    //           format: "auto",
    //           strip_metadata: true,
    //           delivery: "auto",
    //           bytes_limit: 200000,
    //         },
    //       ],
    //     }
    //   );

    //   updateLiveLesson.thumbnail = {
    //     public_id: newImage.public_id,
    //     url: newImage.secure_url,
    //   };
    // }

    const courseUpdated = await liveLessonModel.findByIdAndUpdate(params.id, updateLiveLesson, {
      new: true,
    });

    if (!courseUpdated)
      return NextResponse.json(
        {
          message: 'Clase en vivo no encontrada al momento de actualizar',
        },
        {
          status: 404,
        }
      );
    revalidatePath(`/api/live-lesson/get-lessons`);
    return NextResponse.json(
      {
        success: true,
        message: 'Clase en vivo actualizada correctamente',
        data: courseUpdated,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Error en la actualización del curso',
      },
      { status: 500 }
    );
  }
}
