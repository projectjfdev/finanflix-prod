import { connectDB } from '@/lib/dbConfig';
import { getRoleIdForCourse } from '@/lib/discord/roles/roleManager';
import courseModel from '@/models/courseModel';
import userModel from '@/models/userModel';
import { NextResponse } from 'next/server';
import { removeRoleFromUser } from '@/lib/discord/roles/roleManager';
import { getRoleIdForExpiredCourses } from '@/lib/discord/roles/temporary-role-courses/discord-roles-courses';
import { validateAdminSession } from '@/lib/security';
import Rol from '@/models/rolesModel';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const validationResponse = await validateAdminSession();
    if (validationResponse) {
      return validationResponse;
    }

    const url = new URL(request.url);
    const coursesToRemove = url.searchParams.get('courses')?.split(',') || [];

    // Validar si se enviaron cursos a eliminar
    if (!coursesToRemove.length) {
      return NextResponse.json({
        message: 'Selecciona al menos un curso para eliminar',
        status: 400,
        success: false,
      });
    }

    const user = await userModel.findById(params.id);
    if (!user) {
      return NextResponse.json({
        message: 'Usuario no encontrado',
        status: 404,
        success: false,
      });
    }

    // Filtrar los cursos que no están en la lista de eliminación
    user.enrolledCourses = user.enrolledCourses.filter(
      (course: { _id: string }) => !coursesToRemove.includes(course._id.toString())
    );

    await user.save();

    //  ------------- LOGICA DE DISCORD ----------------------- //

    const courseTitles = [
      'DeFi Avanzado',
      'Análisis fundamental | Curso avanzado',
      'Trading avanzado',
      'Análisis Técnico de 0 a 100',
      'NFTs Revolution',
      'Solidity',
      'Finanzas Personales',
      'Bolsa argentina',
      'StartZero',
      'Hedge Value',
      'Trading Pro',
    ];

    const courseTitle = await courseModel.findById(coursesToRemove[0]).select('title');

    if (!courseTitle) {
      return NextResponse.json({
        message: 'Curso no encontrado',
        status: 404,
        success: false,
      });
    }

    const userDiscordId = user.discordId;

    if (userDiscordId) {
      for (const courseId of coursesToRemove) {
        const course = await courseModel.findById(courseId).select('title');
        if (!course) {
          // console.log(`Curso con ID ${courseId} no encontrado`);
          continue;
        }

        // Solo seguimos si el curso está en la lista de cursos con rol en Discord
        if (!courseTitles.includes(course.title)) {
          // console.log(`El curso "${course.title}" no tiene rol de Discord asociado`);
          continue;
        }

        const discordRoleId = getRoleIdForCourse(course.title);

        if (!discordRoleId) {
          // console.log(`No se encontró rol de Discord para el curso "${course.title}"`);
          continue;
        }
        // console.log('course title', course.title);

        const expiredRoleId = getRoleIdForExpiredCourses(course.title);
        // console.log('expiredRoleId', expiredRoleId);

        //removemos el rol del curso si esta vencido
        const successExpiredRol = await removeRoleFromUser(userDiscordId, expiredRoleId as string);
        // console.log('successExpiredRol', successExpiredRol);

        //removemos el rol del curso si esta activo
        const success = await removeRoleFromUser(userDiscordId, discordRoleId);

        if (success) {
          // console.log(`Rol del curso "${course.title}" removido exitosamente`);

          const rol = await Rol.findOne({ discordId: userDiscordId });

          if (!rol) {
            // console.error('No se encontró el documento Rol para este usuario por');
            return NextResponse.json(
              {
                message: 'No se encontró el documento Rol para este usuario',
                status: 404,
                success: false,
              },
              { status: 404 }
            );
          }

          // * ELIMINAMOS EL CURSO DEL DOCUMENTO ROL PARA LIBERAR ESPACIO EN LA BD
          rol.courses = rol.courses.filter((c: any) => c.title !== courseTitle.title);

          // Guardar cambios
          await rol.save();

          // console.log(`✅ Curso "${courseTitle.title}" eliminado del documento Rol`);
          // * PONEMOS EN EXPIRED EL STATUS DEL CURSO SI SE ELIMINA, BACKUP
          // const course = rol.courses.find((c: any) => c.title === courseTitle.title);
          // if (!course) {
          //   console.error(`No se encontró el curso con título ${courseTitle.title}`);
          //   return NextResponse.json(
          //     {
          //       message: `No se encontró el curso con título ${courseTitle.title}`,
          //       status: 404,
          //       success: false,
          //     },
          //     { status: 404 }
          //   );
          // }

          // course.status = 'expired';
          // await rol.save();
          // console.log(`✅ Curso "${courseTitle.title}" marcado como claimed en la base de datos`);
        } else {
          console.log(
            `No se pudo remover el rol de Discord para el curso "${course.courseTitle.title}"`
          );
        }
      }
    }

    //  ------------- FIN DE LOGICA DE DISCORD ----------------------- //

    return NextResponse.json({
      message: 'Cursos eliminados correctamente',
      status: 200,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || 'Error interno del servidor',
        status: 500,
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
