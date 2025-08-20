import cloudinary from '@/lib/cloudinary';
import { connectDB } from '@/lib/dbConfig';
import courseModel from '@/models/courseModel';
import UserCourse from '@/models/userCourseModel';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { [key: string]: string } }) {
  await connectDB();
  try {
    const course = await courseModel.findById(params.id);

    if (!course)
      return NextResponse.json(
        {
          message: 'course not found',
        },
        {
          status: 404,
        }
      );

    return NextResponse.json(course);
  } catch (error: any) {
    return NextResponse.json(error.message, {
      status: 400,
    });
  }
}

export async function PUT(request: Request, { params }: { params: { [key: string]: string } }) {
  try {
    await connectDB();
    const body = await request.json();
    const currentCourse = await courseModel.findById(params.id);

    if (!currentCourse)
      return NextResponse.json(
        {
          message: 'Curso no encontrado',
        },
        {
          status: 404,
        }
      );

    let updateCourse = { ...body };

    // Manejo de la imagen
    if (updateCourse.thumbnail) {
      if (currentCourse.thumbnail && currentCourse.thumbnail.public_id) {
        const previousImgId = currentCourse.thumbnail.public_id;
        await cloudinary.uploader.destroy(previousImgId);
      }

      const newImage = await cloudinary.uploader.upload(updateCourse.thumbnail, {
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

      updateCourse.thumbnail = {
        public_id: newImage.public_id,
        url: newImage.secure_url,
      };
    }

    // Actualizar curso
    const courseUpdated = await courseModel.findByIdAndUpdate(params.id, updateCourse, {
      new: true,
    });

    if (!courseUpdated)
      return NextResponse.json(
        {
          message: 'Curso no encontrado al momento de actualizar',
        },
        {
          status: 404,
        }
      );

    // Sincronizar progresos en UserCourse
    const userCourses = await UserCourse.find({ courseId: params.id });

    for (const userCourse of userCourses) {
      // Crear nuevo progreso basado en el curso actualizado
      const newProgress = courseUpdated.sections.map((section: any) => ({
        sectionId: section._id,
        lessons: section.lessons.map((lesson: any) => {
          // Verificar si esta lección ya existe en el progreso
          const existingLesson = userCourse.progress
            .find((s: any) => s.sectionId.toString() === section._id.toString())
            ?.lessons.find((l: any) => l.lessonId.toString() === lesson._id.toString());

          return {
            lessonId: lesson._id,
            isViewed: existingLesson?.isViewed || {
              status: false,
              viewedAt: null,
            },
          };
        }),
      }));

      // Actualizar el progreso del usuario
      userCourse.progress = newProgress;
      await userCourse.save();
    }
    revalidatePath(`/api/cursos/get-courses`);
    revalidatePath(`/api/admin/get-title-courses`);
    return NextResponse.json(
      {
        success: true,
        message: 'Curso y progresos actualizados correctamente',
        data: courseUpdated,
      },
      { status: 200 }
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

export async function DELETE(request: Request, { params }: { params: { [key: string]: string } }) {
  await connectDB();

  try {
    const course = await courseModel.findById(params.id);

    if (!course) {
      return NextResponse.json(
        {
          message: 'Curso no encontrado',
        },
        {
          status: 404,
        }
      );
    }

    // Si el curso tiene una imagen asociada en Cloudinary, la eliminamos
    if (course.thumbnail && course.thumbnail.public_id) {
      await cloudinary.uploader.destroy(course.thumbnail.public_id);
    }

    // Eliminamos el curso de la base de datos
    await courseModel.findByIdAndDelete(params.id);
    revalidatePath(`/api/cursos/get-courses`);
    revalidatePath(`/api/admin/get-title-courses`);
    return NextResponse.json(
      {
        message: 'Curso eliminado correctamente',
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Error al eliminar el curso',
      },
      { status: 500 }
    );
  }
}
