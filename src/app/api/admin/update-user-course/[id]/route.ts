import { connectDB } from '@/lib/dbConfig';
import { isUserInGuild } from '@/lib/discord/discord';
import {
  assignRoleToUser,
  getRoleIdForCourse,
  removeRoleFromUser,
} from '@/lib/discord/roles/roleManager';
import { getRoleIdForExpiredCourses } from '@/lib/discord/roles/temporary-role-courses/discord-roles-courses';
import Rol from '@/models/rolesModel';
import userModel from '@/models/userModel';
import { getDiscordIdForUser } from '@/utils/Endpoints/userService';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const reqBody = await request.json();
  const { courses } = reqBody;

  const { title } = courses[0]; // si solo enviás uno

  await connectDB();

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      params.id,
      { discordConnected: false },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'Usuario no encontrado', status: 404, success: false },
        { status: 404 }
      );
    }

    // --------------------------- LOGICA DE DISCORD ------------------------------------------ //

    // Obtener el discordId del usuario específico al que se le está asignando el curso
    const userDiscordId = await getDiscordIdForUser(params.id);
    // console.log(userDiscordId, 'userDiscordId para el usuario:', params.id);

    // Solo intentamos asignar el rol si el usuario tiene un discordId y está en el servidor
    if (userDiscordId) {
      // console.log('✅ Usuario tiene Discord ID, verificando si está en el servidor...');

      // chequeamos si el usuario esta en el servidor
      const isUserInServer = await isUserInGuild(userDiscordId);
      // console.log('¿Usuario está en el servidor?', isUserInServer);

      if (isUserInServer) {
        // console.log('✅ Usuario está en el servidor, obteniendo rol para el curso:', title);

        // Obtenemos el ID del rol correspondiente al curso
        const courseRoleId = getRoleIdForCourse(title);
        // console.log('Role ID encontrado:', courseRoleId);

        if (courseRoleId) {
          // console.log('✅ Asignando rol', courseRoleId, 'al usuario', userDiscordId);
          // console.log('title', title);

          const expiredRoleId = getRoleIdForExpiredCourses(title);
          // console.log('expiredRoleId', expiredRoleId);

          // Remover rol vencido
          const removed = await removeRoleFromUser(userDiscordId, expiredRoleId as any);

          // * ASIGNAR SEGUNDO ROL DE TRADING PRO SI YA FUE RECLAMADO ANTERIORMENTE

          const secondRolId = process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO_SEGUNDO_ROL;
          const tradingProVencido = process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO_VENCIDO;

          const secondRolTradingProWasClaimed = await Rol.findOne({
            discordId: userDiscordId,
            'courses.rolId': secondRolId,
          });

          // console.log('secondRolTradingProExist', secondRolTradingProWasClaimed);

          if (title === 'Trading Pro') {
            // 🔄 Lógica especial para Trading Pro
            if (secondRolTradingProWasClaimed) {
              await removeRoleFromUser(userDiscordId, tradingProVencido as string);
              const assignSecondRole = await assignRoleToUser(userDiscordId, secondRolId as string);
              // console.log('assignSecondRole', assignSecondRole);
              // console.log('✅ Segundo rol de Trading Pro asignado exitosamente');
            } else {
              // * SI NO LO RECLAMÓ AÚN, ASIGNAMOS EL PRIMER ROL DE TRADING PRO
              const roleAssigned = await assignRoleToUser(userDiscordId, courseRoleId);
              // if (roleAssigned) {
              //   console.log('✅ Primer rol de Trading Pro asignado');
              // } else {
              //   console.error('❌ No se pudo asignar el primer rol de Trading Pro');
              // }
            }
          } else {
            // * ASIGNAR ROLES PARA TODOS LOS CURSOS QUE NO SEAN TRADING PRO
            // ✅ Cursos que NO son Trading Pro
            const roleAssigned = await assignRoleToUser(userDiscordId, courseRoleId);
            // console.log('🔍 Resultado de assignRoleToUser:', roleAssigned);

            if (roleAssigned) {
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

              // Buscar el curso por título
              const course = rol.courses.find((c: any) => c.title === title);
              if (!course) {
                // console.error(`No se encontró el curso con título ${title}`);
                return NextResponse.json(
                  {
                    message: `No se encontró el curso con título ${title}`,
                    status: 404,
                    success: false,
                  },
                  { status: 404 }
                );
              }

              // Actualizar status
              course.status = 'claimed';

              // Guardar cambios
              await rol.save();

              // console.log(`✅ Curso "${title}" marcado como claimed en la base de datos`);
            } else {
              console.error('❌ No se pudo asignar el rol en Discord');
            }
          }
        } else {
          console.error('❌ No se encontró un ID de rol para el curso:', title);
        }
      } else {
        console.log('⚠️ El usuario no está en el servidor de Discord');
      }
    } else {
      console.log('⚠️ El usuario no tiene una cuenta de Discord conectada');
    }

    // --------------------------- FIN LOGICA DE DISCORD ------------------------------------------ //

    return NextResponse.json(
      { message: 'Campo discordConnected actualizado a true', status: 200, success: true },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || 'Error interno del servidor',
        status: 500,
        success: false,
        discordError: true, // Indicamos que hubo un problema con la remoción del rol
      },
      { status: 500 }
    );
  }
}
