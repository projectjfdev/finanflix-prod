import { connectDB } from '@/lib/dbConfig';
import userModel from '@/models/userModel';
import { NextResponse } from 'next/server';
import {
  assignRoleToUser,
  assignSuscriptionRoleToUser,
  removeRoleFromUser,
  removeSubscriptionRoleFromUser,
} from '@/lib/discord/roles/roleManager';
import { getRoleIdForSubscription } from '@/lib/discord/roles/roleManager';
import { getDiscordIdForUser } from '@/utils/Endpoints/userService';
import { isUserInGuild, userHasRole } from '@/lib/discord/discord';
import Rol from '@/models/rolesModel';
import { getCompletedCoursesCount } from '@/lib/getCompletedCoursesCount';
import {
  delay,
  revokeUserResourcesDiamond,
  syncDiamondRolesByUserId,
} from '@/lib/discord/roles/roleManagerDiamond';
import { removeExpiredSubscriptionRoles } from '@/lib/discord/roles/removeExpiredSuscRoles';
import { assignExpiredRoleBySubscriptionType } from '@/lib/discord/roles/asignExpiredSusRoles';
import { syncCoursesRolesInSusByUserId } from '@/lib/discord/roles/activateExpiredRoleSus';
import { getRoleIdForExpiredCourses } from '@/lib/discord/roles/temporary-role-courses/discord-roles-courses';
import { Types } from 'mongoose';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const body = await request.json();
    const { type, isActive, orderDate, endDate, status } = body;

    if (!type || !isActive || !orderDate || !endDate || !status) {
      return NextResponse.json({
        message: 'Todos los campos de la suscripción son requeridos',
        status: 400,
        success: false,
      });
    }

    const updateResult = await userModel.findByIdAndUpdate(
      params.id,
      {
        suscription: {
          type,
          isActive,
          orderDate,
          endDate,
          status,
        },
        discordConnected: false, // agregás esto directamente
      },
      { new: true }
    );

    if (!updateResult) {
      return NextResponse.json({
        message: 'Usuario no encontrado',
        status: 404,
        success: false,
      });
    }

    if (status === 'active') {
      // --------------------------- LOGICA DE DISCORD ------------------------------------------ //
      let userRol = await Rol.findOne({ userId: params.id });

      const isDiamond = type?.toLowerCase().includes('diamond');

      if (!userRol && !isDiamond) {
        userRol = await Rol.create({
          userId: params.id,
          sub: {
            rol: {
              id: null,
              status: 'pending',
            },
          },
        });
        // console.log('🔄 Modelo Rol creado automáticamente para el usuario.');
      }

      // Obtener el discordId del usuario específico al que se le está asignando el curso
      const userDiscordId = await getDiscordIdForUser(params.id);
      // console.log(userDiscordId, 'userDiscordId para el usuario:', userId);

      // Solo intentamos asignar el rol si el usuario tiene un discordId y está en el servidor
      if (userDiscordId) {
        // console.log('✅ Usuario tiene Discord ID, verificando si está en el servidor...');

        // chequeamos si el usuario esta en el servidor
        // console.log('¿Usuario está en el servidor?', isUserInServer);

        try {
          const isUserInServer = await isUserInGuild(userDiscordId);
          console.log(isUserInServer, 'isUserInServer');

          if (isUserInServer) {
            console.log('✅ Usuario está en el servidor, obteniendo rol para la suscripcion:', type);
            const parts = type.split('-');
            const subscriptionType = parts[1]?.trim(); // "mensual"
            // * Rol de curso vencido existente
            console.log('removiendo el rol del curso vencido y asignandolo en cualquier suscripcion');
            try {
              await syncCoursesRolesInSusByUserId(params.id, subscriptionType);
            } catch (err) {
              console.error('❌ Error al sincronizar roles Diamond', err);
            }

            // * Rol de suscripcion activa anterior
            const oldActiveSubscriptionRoleId = userRol?.sub?.rol?.id;
            console.log(oldActiveSubscriptionRoleId);

            console.log('type', type);

            // *  Rol de la nueva suscripcion para asignar
            const newSubscriptionRoleId = getRoleIdForSubscription(type);

            // console.log('Rol anterior:', oldActiveSubscriptionRoleId);
            console.log('Rol nuevo:', newSubscriptionRoleId);

            // Remover el rol anterior si existe y es diferente al nuevo
            if (
              oldActiveSubscriptionRoleId &&
              newSubscriptionRoleId &&
              oldActiveSubscriptionRoleId !== newSubscriptionRoleId
            ) {
              const hasOldRole = await userHasRole(userDiscordId, oldActiveSubscriptionRoleId);

              if (hasOldRole) {
                console.log('removiendo roles');

                const removed = await removeSubscriptionRoleFromUser(
                  userDiscordId,
                  oldActiveSubscriptionRoleId
                );
                // if (removed) {
                //   console.log(`✅ Rol anterior (${oldActiveSubscriptionRoleId}) removido`);
                // } else {
                //   console.warn(
                //     `⚠️ No se pudo remover el rol anterior (${oldActiveSubscriptionRoleId})`
                //   );
                // }
              }

              // * 💎 Si el rol anterior era Diamond y el nuevo no lo es, se mantienen los roles
              if (
                oldActiveSubscriptionRoleId === process.env.NEXT_PUBLIC_DISCORD_ROLE_DIAMOND &&
                !type.includes('basic') &&
                !type.includes('icon')
              ) {
                // console.log('entroooo');

                await revokeUserResourcesDiamond(userDiscordId);
              }
            }

            // * SI LA SUSCRIPCION ES DIAMOND ASIGNAMOS LOS ROLES DE LOS CURSOS

            if (type.includes('diamond')) {
              // console.log('tiene diamonddd');
              // Opción 1: Usar split y obtener la segunda parte, eliminando espacios extras
              const parts = type.split('-');
              const subscriptionType = parts[1]?.trim(); // "mensual"
              // console.log('subscriptionType', subscriptionType);

              try {
                await syncDiamondRolesByUserId(params.id, subscriptionType);
              } catch (err) {
                console.error('❌ Error al sincronizar roles Diamond', err);
              }
            }

            const completedCourses = await getCompletedCoursesCount(params.id);
            console.log('completedCourses', completedCourses);
            console.log('orderDate', orderDate);

            // * SI LA SUSCRIPCION ES MENSUAL Y EL USUARIO TIENE 3 O MAS CURSOS COMPLETADOS
            if (type === 'Suscripcion basic - mensual' && completedCourses >= 3) {
              console.log('suscripcion mensual entrando, tiene 3 cursos completados o mas');

              const threeCompletedCoursesRole =
                process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL_THREE_COMPLETED_COURSES;
              console.log('threeCompletedCoursesRole', threeCompletedCoursesRole);

              const expiredRolId = process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL_VENCIDO;

              const removed = await removeSubscriptionRoleFromUser(
                userDiscordId,
                expiredRolId as string
              );

              // *  Removemos Basic Mensual y asignamos basic mensual 3 cursos
              const activeMensualSus = process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL;
              const removeActiveBasicSus = await removeSubscriptionRoleFromUser(
                userDiscordId,
                activeMensualSus as string
              );
              console.log('removeActiveSus', activeMensualSus);

              const assigned = await assignSuscriptionRoleToUser(
                userDiscordId,
                threeCompletedCoursesRole as string
              );

              if (assigned) {
                console.log(
                  `✅ Suscripción "${type}" actualizado el rolId de los 3 cursos completados`
                );
              }
            }

            // * REMOVEMOS LOS ROLES EXPIRADOS SI LOS HAY
            const removingExpiredSus = await removeExpiredSubscriptionRoles(userDiscordId, type);
            if (removingExpiredSus) {
              console.log('roles expirados removidos exitosamente');
            }

            // * ASIGNAMOS EL ROL DE SUSCRIPCION EXCLUYENDO BASIC MENSUAL CON 3 O MAS CURSOS COMPLETADOS
            if (
              newSubscriptionRoleId &&
              !(type === 'Suscripcion basic - mensual' && completedCourses >= 3)
            ) {
              console.log('✅ Asignando rol', newSubscriptionRoleId, 'al usuario', userDiscordId);

              // Asignamos el rol al usuario
              const suscriptionRoleAssigned = await assignSuscriptionRoleToUser(
                userDiscordId,
                newSubscriptionRoleId
              );
              // * GUARDAMOS EL ROL DE LA SUSCRIPCION EN LA BASE DE DATOS
              if (suscriptionRoleAssigned) {
                console.log(`✅ ${newSubscriptionRoleId} Rol asignado exitosamente en Discord`);
                userRol.sub.rolId = newSubscriptionRoleId;
                userRol.sub.status = 'expired';
                userRol.sub.markModified('sub');
                console.log(`✅ Suscripción "${type}" guardada con exito`);
                await userRol.save();
              } else {
                console.error('❌ No se pudo asignar el rol en Discord');
              }
            } else {
              console.error('❌ No se encontró un ID de rol para la suscripcion:', type);
            }
          } else {
            console.log('⚠️ El usuario no está en el servidor de Discord');
          }
        } catch (error) {
          console.log('❌ Error al verificar si el usuario está en el servidor de Discord:', error);
        }
      } else {
        console.log('⚠️ El usuario no tiene una cuenta de Discord conectada');
      }

      // --------------------------- FIN LOGICA DE DISCORD ------------------------------------------ //

      // return new Response(JSON.stringify({ success: true }), {
      //   status: 200,
      //   headers: { 'Content-Type': 'application/json' },
      // });
    }

    {
      /* ---------- SI SE REMUEVE CANCELA O DEJA DE PAGAR ---------- */
    }

    // --------------------------- LOGICA DE DISCORD ------------------------------------------ //

    // Si la suscripción está cancelada, remover el rol de Discord
    if (status === 'cancelled' || status === 'expired' || status === 'unpaid') {
      const discordRoleId = getRoleIdForSubscription(type); // ID del rol a remover, le pasamos el type para saber el tipo de suscripcion
      const userDiscordId = updateResult.discordId; // Suponiendo que el modelo de usuario tiene el campo discordId

      // utilizamos la validacion para que typescript no rompa si es null o undefined ambas variables
      if (!userDiscordId || !discordRoleId) {
        // console.log('ID de usuario o rol de Discord no disponible');
        return NextResponse.json({
          message: 'ID de usuario o rol de Discord no disponible',
          status: 400,
          success: false,
        });
      }

      // console.log('params id', params.id);

      let userRol = await Rol.findOne({ userId: params.id });

      // console.log('userRol', userRol);

      // recuperamos el rol id de la suscripcion anterior antes de que se actualice
      const oldActiveSubscriptionRoleId = userRol.sub?.rol?.id;
      // console.log(oldActiveSubscriptionRoleId);

      const success = await removeSubscriptionRoleFromUser(
        userDiscordId,
        oldActiveSubscriptionRoleId
      );

      console.log('paramsid', params.id);

      if (!Types.ObjectId.isValid(params.id)) {
        console.error('ID inválido:', params.id);
        return;
      }

      //* SETEAMOS EL SUB ROL STATUS EN EXPIRED PARA QUE EL CRON NO LAS PROCESE
      const updateSubRol = await Rol.updateOne(
        { userId: new Types.ObjectId(params.id) }, // convertimos el paramsid a objectid para poder matcheal
        {
          $set: {
            'sub.rol.status': 'expired',
          },
        }
      );
      console.log('Resultado del update:', updateSubRol);

      //* REMOVEMOS LOS ROLES Y ASIGNAMOS ROLES VENCIDOS A LOS CURSOS SI SE CANCELA LA SUSCRIPCION
      const roles = await Rol.find({
        userId: params.id,
        courses: {
          $elemMatch: {
            orderDate: { $exists: true },
            status: { $in: 'claimed' },
          },
        },
      })
        .select('courses.rolId courses.title courses.status courses.source')
        .lean();

      for (const rol of roles) {
        for (const course of rol.courses) {
          const { rolId, title, status, source } = course
          // si no hay rolId no hacemos nada
          if (!rolId) continue;
          const rolIdExpired = getRoleIdForExpiredCourses(title);
          if (!rolIdExpired) continue;

          console.log('source', source);

          try {
            console.log('entrooo');
            console.log('rolIdExpired', rolIdExpired);
            await removeRoleFromUser(userDiscordId, rolId);

            // solo asignamos roles vencidos si hay un curso en claimed en el rol document
            if (status === 'claimed' && source === 'subscription') {
              console.log('entrooo');
              console.log('userDiscordId', userDiscordId);
              const assigned = await assignRoleToUser(userDiscordId, rolIdExpired);
              await delay(2000);
              if (assigned) {
                await Rol.updateOne(
                  { discordId: userDiscordId, 'courses.title': title },
                  {
                    $set: {
                      'courses.$.status': 'expired',
                    },
                  }
                );
              }
            }
          } catch (err) {
            console.error('❌ Error asignando rol vencido:', err);
          }
        }
      }

      if (type.includes('diamond')) {
        // console.log('removiendo suscripcion diamond y sus cursos correspondientes');
        await revokeUserResourcesDiamond(userDiscordId);
      }

      // if (!userRol) {
      //   console.log('🔄 Modelo Rol creado automáticamente para el usuario en cancelación');
      // }

      // * ASIGNAMOS ROLES VENCIDOS A LAS SUSCRIPCIONES
      try {
        console.log('entroo');
        const removed = await assignExpiredRoleBySubscriptionType(userDiscordId, type);


      } catch (error) {
        // console.error('Error al asignar rol expirado:', error);
        return NextResponse.json({
          message: 'No se pudo asignar el rol expirado en Discord',
          status: 500,
          success: false,
          discordError: true,
        });
      }
    }

    /* ----------------------------- FIN DE LOGICA DE DISCORD ---------------------------------------- */

    return NextResponse.json({
      message: 'Suscripción actualizada correctamente',
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
