import { authOptions } from '@/lib/authOptions';
// import cloudinary from "@/lib/cloudinary";
import { connectDB } from '@/lib/dbConfig';
import liveLessonModel from '@/models/liveLessonModel';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const liveLessonDelete = await liveLessonModel.findById(params.id);

    const session = await getServerSession(authOptions);

    const cookieStore = cookies();

    const sessionTokenCookie =
      cookieStore.get('__Secure-next-auth.session-token') ||
      cookieStore.get('next-auth.session-token');

    // // verificamos si hay token en las cookies
    if (!sessionTokenCookie) {
      return NextResponse.json({
        message: 'No estás logueado',
        status: 403,
        success: false,
      });
    }

    if (process.env.FINANFLIX_SECRET_ID !== session?.user._id.toString()) {
      return NextResponse.json({
        message: 'Conflicto en cuenta de administrador',
        status: 403,
        success: false,
      });
    }

    if (!liveLessonDelete)
      return NextResponse.json(
        {
          message: 'Clase no encontrada',
        },
        {
          status: 404,
        }
      );

    // let imgsToDelete = liveLessonDelete.thumbnail;
    // await cloudinary.uploader.destroy(imgsToDelete.public_id);

    await liveLessonModel.findByIdAndDelete(params.id);
    revalidatePath(`/api/live-lesson/get-lessons`);

    return NextResponse.json({
      message: 'Clase eliminada correctamente',
      status: 200,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(error.message, {
      status: 400,
    });
  }
}
