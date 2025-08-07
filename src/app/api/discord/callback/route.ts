// C:\Users\Ecotech\Desktop\Jeronimo Alderete\finanflix-prod-main\src\app\api\discord\callback\route.ts

import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getDiscordUserInfo, connectDiscordToUser, DISCORD_CONFIG } from '@/lib/discord/discord';
import {
  assignRoleToUser,
  assignSuscriptionRoleToUser,
  getRoleIdForCourse,
  getRoleIdForSubscription,
  removeRoleFromUser,
  removeSubscriptionRoleFromUser,
} from '@/lib/discord/roles/roleManager';
import courseService from '@/utils/Services/courseService';
import { getRoleIdForExpiredCourses } from '@/lib/discord/roles/temporary-role-courses/discord-roles-courses';
import {
  processUserSuscription,
  removeSubscriptionExpiredRole,
} from '@/lib/discord/roles/temporary-role-subscriptions/discord-roles-suscription';
import { getCompletedCoursesCount } from '@/lib/getCompletedCoursesCount';
import { delay, syncDiamondRolesByUserId } from '@/lib/discord/roles/roleManagerDiamond';
import Rol from '@/models/rolesModel';

export async function GET(req: NextRequest) {
  try {
    // Verificar la sesión del usuario
    const session = await getServerSession(authOptions);

    const userId = session?.user?._id.toString();

    // console.log('userId', userId);

    if (!session || !session.user) {
      // console.log('No session found, redirecting to login');
      return NextResponse.redirect(new URL('/login?error=unauthorized', req.url));
    }

    // Obtener el código de autorización de Discord
    const url = new URL(req.url);
    const code = url.searchParams.get('code');

    if (!code) {
      // console.log('No code found in request');
      return NextResponse.redirect(new URL('/404?error=no_code', req.url));
    }

    // TODO: SE AGREGO ESTA FUNCION!!! ------------------------------------------------------------------------

    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: DISCORD_CONFIG.CLIENT_ID,
        client_secret: DISCORD_CONFIG.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code, // este te lo da Discord
        redirect_uri: DISCORD_CONFIG.REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      // console.error('Error al obtener el token de Discord:', errorText);
      return NextResponse.redirect(new URL('/404?error=token_exchange_failed', req.url));
    }

    const tokenData = await tokenResponse.json();
    // Verifica si realmente estás recibiendo el access token
    // console.log('Token Data:', tokenData);
    // Obtén el access_token y asegúrate de pasarlo correctamente
    const accessToken = tokenData.access_token;
    // Obtener información del usuario de Discord
    const discordUser = await getDiscordUserInfo(accessToken);
    if (!discordUser) {
      // console.log('Failed to get Discord user info');
      return NextResponse.redirect(new URL('/404?error=discord_auth_failed', req.url));
    }
    // Agregar el usuario al servidor de Discord usando su access_token
    const addToGuildResponse = await fetch(
      `https://discord.com/api/v10/guilds/${DISCORD_CONFIG.GUILD_ID}/members/${discordUser.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bot ${DISCORD_CONFIG.BOT_TOKEN}`,
        },
        body: JSON.stringify({
          access_token: tokenData.access_token,
        }),
      }
    );

    if (addToGuildResponse.status !== 201 && addToGuildResponse.status !== 204) {
      console.error(
        'Error al agregar el usuario al servidor de Discord:',
        await addToGuildResponse.text()
      );
    }
    // console.log('Discord user connected:', discordUser.id);

    await connectDiscordToUser(session.user._id.toString(), discordUser.id);

    // Procesar suscripciones para asignar roles temporales en suscripciones
    if (session?.user.suscription?.status === 'active' && session?.user.suscription?.type) {
      const subscriptionRoles = [
        {
          name: 'Suscripcion basic',
          roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL,
        },
        {
          name: 'Suscripcion icon',
          roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_ICON,
        },
        {
          name: 'Suscripcion diamond',
          roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_DIAMOND,
        },
      ];

      const subscriptionExpiredRoles = [
        {
          name: 'Suscripcion basic',
          roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL_VENCIDO,
        },
        {
          name: 'Suscripcion icon',
          roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_ICON_VENCIDO,
        },
        {
          name: 'Suscripcion diamond',
          roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_DIAMOND_VENCIDO,
        },
      ];

      try {
        // console.log('asignando roles para suscripciones');
        // Pasamos el tipo de suscripción en un array para mantener la consistencia con la función
        const suscriptionType = session.user.suscription.type;
        // Obtenemos el nombre base de la suscripción, ej: 'Suscripcion basic'
        const currentSubscriptionBaseName = suscriptionType.split(' - ')[0];
        // console.log('currentSubscriptionBaseName', currentSubscriptionBaseName);

        // * Removemos los roles activos de suscripciones que no coincidan
        for (const role of subscriptionRoles) {
          if (role.name !== currentSubscriptionBaseName) {
            const removedActiveSuscriptions = await removeSubscriptionRoleFromUser(
              discordUser.id,
              role.roleId as string
            );
            // console.log(`🧹 Rol ${role.name} eliminado:`, removedActiveSuscriptions);
          }
        }
        // * Removemos los roles vencidos de suscripciones que existan
        for (const role of subscriptionExpiredRoles) {
          const removedExpiredSuscriptions = await removeSubscriptionRoleFromUser(
            discordUser.id,
            role.roleId as string
          );
          // console.log(`🧹 Rol ${role.name} eliminado:`, removedExpiredSuscriptions);
        }

        // Verificar si el usuario tiene más de 3 cursos completados
        const completedCourses = await getCompletedCoursesCount(session?.user._id.toString());
        // console.log(`Usuario tiene ${completedCourses} cursos completados`);

        const roleId = getRoleIdForSubscription(session.user.suscription.type);

        // *  Si es suscripción basic mensual Y tiene menos de 3 cursos -> asigna rol de basic normalmente
        if (suscriptionType.includes('basic') && completedCourses < 3) {
          // console.log(
          //   'asignando rol de suscripcion basica normal, usuario no tiene 3 o mas cursos completados'
          // );
          await assignSuscriptionRoleToUser(discordUser.id, roleId as string);
        }

        //* Si la suscripción NO es basic Y tiene 3 o más cursos completados -> asigna rol
        if (!suscriptionType.includes('basic')) {
          // console.log(
          //   'asignando rol de suscripcion normal, usuario no tiene 3 o mas cursos completados y la suscripcion no es basic'
          // );
          await assignSuscriptionRoleToUser(discordUser.id, roleId as string);
        }

        //* Si la suscripción es basic Y tiene 3 o más cursos completados -> asigna rol
        if (suscriptionType.includes('basic') && completedCourses >= 3) {
          // console.log(
          //   'Usuario tiene 3 o más cursos completados, ejecutando lógica especial de roles'
          // );
          const threeBasicCompletedCourses =
            process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL_THREE_COMPLETED_COURSES;
          await assignSuscriptionRoleToUser(discordUser.id, threeBasicCompletedCourses as string);
        }

        if (suscriptionType.includes('diamond')) {
          // console.log('usuario tiene diamond');
          try {
            await syncDiamondRolesByUserId(userId as string);
          } catch (err) {
            console.error('❌ Error al sincronizar roles Diamond', err);
          }
        }
      } catch (error) {
        console.error('Error al procesar suscripción para roles temporales:', error);
      }
    }

    // Si el usuario tiene cursos, agregar los roles correspondientes
    if (
      session.user.enrolledCourses &&
      Array.isArray(session.user.enrolledCourses) &&
      session.user.enrolledCourses.length > 0
    ) {
      // console.log('User has enrolled courses:', session.user.enrolledCourses);

      // Procesar cada ID de curso
      for (const courseId of session.user.enrolledCourses) {
        try {
          // Convertir ObjectId a string antes de pasarlo a getById
          const courseIdString = courseId.toString();
          // Obtener los detalles del curso usando el ID
          const courseDetails = await courseService.getById(courseIdString);

          if (courseDetails && courseDetails.title) {
            // console.log(`Found course: ${courseDetails.title} for ID: ${courseId}`);

            if (courseDetails && courseDetails.title !== 'Trading Pro') {
              // * SE ASIGNAN LOS ROLES A LOS CURSOS

              // Obtener el ID del rol para este curso
              const courseRoleId = getRoleIdForCourse(courseDetails.title);
              // console.log('courseIdString', courseRoleId);

              try {
                const roleAssigned = await assignRoleToUser(discordUser.id, courseRoleId as string);
                // console.log(`✅ Rol ${courseId} asignado:`, roleAssigned);
                await delay(2000);
              } catch (error) {
                console.error(`❌ Error asignando rol ${courseId}:`, error);
              }
            } else {
              // * ASIGNAMOS EL 2 ROL DE TRADING PRO
              try {
                // Obtener el ID del rol para este curso
                const secondRolId = process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO_SEGUNDO_ROL;
                const secondRolTradingProWasClaimed = await Rol.findOne({
                  discordId: discordUser.id,
                  'courses.rolId': secondRolId,
                });

                // console.log('secondRolId', secondRolId);

                // console.log('discordId', discordUser.id);

                // console.log('secondRolTradingProWasClaimed', secondRolTradingProWasClaimed);

                if (secondRolTradingProWasClaimed) {
                  const roleAssigned = await assignRoleToUser(
                    discordUser.id,
                    secondRolId as string
                  );

                  // console.log(`✅ Rol ${courseId} asignado:`, roleAssigned);
                } else {
                  // * ASIGNAMOS EL 1 ROL DE TRADING PRO
                  const firstRolId = process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO;
                  const roleAssigned = await assignRoleToUser(discordUser.id, firstRolId as string);
                  // console.log(`✅ Rol ${courseId} asignado:`, roleAssigned);
                }
              } catch (error) {
                console.error(`❌ Error asignando rol ${courseId}:`, error);
              }
            }

            // * SE REMUEVEN LOS ROLES VENCIDOS DE LOS CURSOS
            const expiredRoleId = getRoleIdForExpiredCourses(courseDetails.title);
            // console.log('expiredRoleId', expiredRoleId);

            try {
              const removed = await removeRoleFromUser(discordUser.id, expiredRoleId as string);
              // console.log(`✅ Rol ${courseId} removido:`, removed);
              await delay(3000);
            } catch (error) {
              console.error(`❌ Error removiendo rol ${courseId}:`, error);
            }
          } else {
            console.log(`No course details found for ID: ${courseId}`);
          }

          // LOGICA DISCORD PARA EL CURSO TRADING PRO - LLAMAMOS A LA FUNCION CON EL TEMPORIZADOR
        } catch (error) {
          console.error(`Error fetching course details for ID: ${courseId}`, error);
        }
      }
    } else {
      console.log('User does not have any enrolled courses');
    }

    // Procesar suscripciones para asignar roles temporales en suscripciones
    if (session.user.suscription?.status === 'active' && session.user.suscription?.type) {
      // Verificar si el usuario tiene 3 o más cursos completados
      const completedCourses = await getCompletedCoursesCount(session.user._id.toString());
      // console.log(`Usuario tiene ${completedCourses} cursos completados para asignación de roles`);

      // Solo asignar el rol de suscripción normal si no tiene 3 o más cursos completados
      if (completedCourses < 3) {
        try {
          // console.log('Iniciando procesamiento de roles temporales para suscripción');
          // Pasamos el tipo de suscripción en un array para mantener la consistencia con la función
          await processUserSuscription(discordUser.id, [session.user.suscription.type]);
          await removeSubscriptionExpiredRole(discordUser.id, session.user.suscription?.type);
        } catch (error) {
          console.error('Error al procesar suscripción para roles temporales:', error);
        }
      }
    } else {
      console.log(
        'Usuario tiene 3 o más cursos completados, no se asignará el rol de suscripción normal'
      );
    }

    return NextResponse.redirect(new URL('/discord-success?discord=connected', req.url));
  } catch (error) {
    // console.error('Error en el callback de Discord:', error);
    return NextResponse.redirect(new URL('/404?error=server_error', req.url));
  }
}
