// C:\Users\Ecotech\Desktop\Jeronimo Alderete\finanflix-prod-main\src\app\api\discord\connect\route.ts

import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { getDiscordIdForUser } from '@/utils/Endpoints/userService';
import { isUserInGuild } from '@/lib/discord/discord';
import { getRoleIdForCourse, getRoleIdForSubscription } from '@/lib/discord/roles/roleManager';
import { assignMultipleRolesToUser } from '@/lib/discord/roles/roleManager';
import courseService from '@/utils/Services/courseService';
import { startTradingProSequence } from '@/lib/discord/roles/temporary-role-courses/discord-roles-tradingpro';
import { processUserCourses } from '@/lib/discord/roles/temporary-role-courses/discord-roles-courses';

export async function POST(req: NextRequest) {
  try {
    // Verificar la sesión del usuario
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'No estás autenticado' },
        { status: 401 }
      );
    }

    // Obtener el ID de Discord del usuario
    const discordId = await getDiscordIdForUser(session.user.id);
    if (!discordId) {
      return NextResponse.json(
        { success: false, message: 'No has conectado tu cuenta de Discord' },
        { status: 400 }
      );
    }

    // Verificar si el usuario está en el servidor
    const userInGuild = await isUserInGuild(discordId);
    if (!userInGuild) {
      return NextResponse.json(
        { success: false, message: 'No estás en el servidor de Discord' },
        { status: 400 }
      );
    }

    // Recopilar todos los roles que necesitamos asignar
    const rolesToAssign: string[] = [];
    const results = {
      subscription: false,
      courses: false,
      totalAssigned: 0,
    };

    // Verificar si el usuario tiene una suscripción activa
    if (
      session.user.suscription?.status === 'active' &&
      session.user.suscription?.endDate > new Date()
    ) {
      // Obtener el ID del rol correspondiente a la suscripción
      const roleId = getRoleIdForSubscription(session.user.suscription.type);
      if (roleId) {
        rolesToAssign.push(roleId);
        results.subscription = true;
      }
    }

    // Verificar si el usuario tiene cursos
    if (
      session.user.enrolledCourses &&
      Array.isArray(session.user.enrolledCourses) &&
      session.user.enrolledCourses.length > 0
    ) {
      // Procesar cada ID de curso
      for (const courseId of session.user.enrolledCourses) {
        try {
          // Convertir ObjectId a string antes de pasarlo a getById
          const courseIdString = courseId.toString();
          // Obtener los detalles del curso usando el ID
          const courseDetails = await courseService.getById(courseIdString);

          if (courseDetails && courseDetails.title) {
            // console.log(`Found course: ${courseDetails.title} for ID: ${courseId}`);

            // Obtener el ID del rol para este curso
            const courseRoleId = getRoleIdForCourse(courseDetails.title);

            if (courseRoleId) {
              // console.log(`Found role ID: ${courseRoleId} for course: ${courseDetails.title}`);
              rolesToAssign.push(courseRoleId);
              results.courses = true;
            } else {
              console.log(`No role ID found for course: ${courseDetails.title}`);
            }
          } else {
            console.log(`No course details found for ID: ${courseId}`);
          }

          // LOGICA DISCORD PARA EL CURSO TRADING PRO - LLAMAMOS A LA FUNCION CON EL TEMPORIZADOR

          if (courseDetails && courseDetails.title === 'Trading Pro') {
            // console.log('Usuario tiene Trading Pro, iniciando secuencia de roles temporales');
            await startTradingProSequence(discordId);
            break; // Salir del bucle una vez encontrado
          } else {
            console.log(
              'el usuario no tiene Trading Pro - logica de secuencia de roles temporales Para Trading Pro no se activara'
            );
          }
        } catch (error) {
          console.error(`Error fetching course details for ID: ${courseId}`, error);
        }
      }
    }

    // LOGICA PARA ASIGNAR ROLES VENCIDOS

    // Procesar todos los cursos para asignar roles temporales (excepto Trading Pro)
    if (
      session.user.enrolledCourses &&
      Array.isArray(session.user.enrolledCourses) &&
      session.user.enrolledCourses.length > 0
    ) {
      try {
        // Obtener los nombres de los cursos
        const courseNames: string[] = [];
        for (const courseId of session.user.enrolledCourses) {
          const courseIdString = courseId.toString();
          const courseDetails = await courseService.getById(courseIdString);
          if (courseDetails && courseDetails.title && courseDetails.title !== 'Trading Pro') {
            courseNames.push(courseDetails.title);
          }
        }

        // Procesar los cursos para asignar roles temporales
        if (courseNames.length > 0) {
          // console.log(
          //   `Iniciando procesamiento de roles temporales para ${courseNames.length} cursos`
          // );
          await processUserCourses(discordId, courseNames);
        }
      } catch (error) {
        console.error('Error al procesar cursos para roles temporales:', error);
      }
    }

    // Si no hay roles para asignar, devolver un mensaje apropiado
    if (rolesToAssign.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No tienes una suscripción activa ni cursos que requieran roles en Discord',
        },
        { status: 400 }
      );
    }

    // Asignar todos los roles recopilados
    const { success, assignedRoles } = await assignMultipleRolesToUser(discordId, rolesToAssign);
    results.totalAssigned = assignedRoles;

    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Error al asignar los roles' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${assignedRoles} roles asignados correctamente`,
      details: results,
    });
  } catch (error) {
    // console.error('Error en la API de conexión de Discord:', error);
    return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 });
  }
}
