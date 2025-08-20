// C:\Users\jeroa\Desktop\JeroAlderete\1 - Finanflix\finanflix-prod-dev\src\app\api\cron\rol-expired-courses\route.ts
import { NextResponse } from 'next/server';
import Rol from '@/models/rolesModel'; // Asegurate de importar bien el modelo
import { assignRoleToUser, removeRoleFromUser } from '@/lib/discord/roles/roleManager';
import { connectDB } from '@/lib/dbConfig'; // Asegurate de conectar a Mongo
import { getRoleIdForExpiredCourses } from '@/lib/discord/roles/temporary-role-courses/discord-roles-courses';
import { delay } from '@/lib/discord/roles/roleManagerDiamond';
import { LogIn } from 'lucide-react';



export async function GET(req: Request) {
  // console.time('rol-expired-courses');

  const authHeader = req.headers.get('Authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB(); // Conectarse a la base de datos

    const now = new Date();
    const nowMs = now.getTime();

    // Simulación de tiempo (en minutos)
    const threeMinutes = 3; // 3 meses
    const fourMinutes = 4; // 4 meses
    const oneMinute = 1; // 1 mes

    // * Procesamos cursos que tengan menos de 3 minutos TEST
    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000); // 3 minutos atrás
    // * Procesamos cursos que tengan menos de 3 meses
    // const threeMonthsAgo = new Date();
    // threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // FILTRO DE CONSULTA:  Buscar roles con cursos que vencieron hace más de 3 meses y aún no están expirados
    const roles = await Rol.find({
      courses: {
        $elemMatch: {
          orderDate: { $exists: true },
          status: 'claimed',
        },
      },
    })
      .select(
        'discordId courses.rolId courses.title courses.orderDate courses.status courses.source courses.subscriptionType'
      )
      .lean()

    for (const rol of roles) {
      const discordId = rol.discordId;

      for (const course of rol.courses) {
        const { rolId, title, source, subscriptionType, status } = course;


        // console.log(course.orderDate);

        // * TEMPORIZADOR TEST
        const orderDate = new Date(course.orderDate);
        const minutosTranscurridos = Math.floor((nowMs - orderDate.getTime()) / (1000 * 60));
        // * TEMPORIZADOR PRODUCCION
        //   const orderDate = new Date(course.orderDate);
        //   const hoy = new Date();
        //   const mesesTranscurridos =
        // hoy.getMonth() - orderDate.getMonth() + 12 * (hoy.getFullYear() - orderDate.getFullYear());
        // console.log('🕒 Minutos transcurridos:', minutosTranscurridos);
        if (subscriptionType) {


          //* Lógica de vencimiento de cursos por tipo de suscripción - 1 mes
          if (
            subscriptionType.includes('mensual') &&
            source === 'subscription' &&
            minutosTranscurridos >= 1
          ) {

            if (!course.orderDate || !subscriptionType) continue;

            // console.log(`📉 Curso mensual vencido: ${title}`);
            // Obtenemos el rol vencido desde la función
            const rolIdExpired = getRoleIdForExpiredCourses(title);
            // console.log(rolIdExpired, 'rold id expired');

            if (!rolId || !rolIdExpired) continue;
            // console.log(`⏳ rol expirado ${rolIdExpired} para curso "${title}" `);
            // console.log(`⏳ Expirando curso "${title}" para usuario con discordId ${discordId}`);
            try {
              // removemos el rol del curso en discord
              const removed = await removeRoleFromUser(discordId, rolId);
              // asignamos rol expirado
              const assigned = await assignRoleToUser(discordId, rolIdExpired);
              await delay(2000);
              const rol = await Rol.findOne({ discordId: discordId });
              if (!rol) {
                console.error('No se encontró el documento Rol para este usuario');
                continue;
              }

              // Buscar el curso por título
              const course = rol.courses.find((c: any) => c.title === title);
              if (!course) {
                console.error(`No se encontró el curso con título ${title}`);
                continue;
              }

              // Actualizar status en la bd

              if (assigned) {
                await Rol.updateOne(
                  { discordId: discordId, 'courses.title': title },
                  {
                    $set: {
                      'courses.$.status': 'expired',
                    },
                  }
                );
              }
            } catch (error) {
              console.error(
                `Error actualizando curso ${course.title} para usuario ${discordId}:`,
                error
              );
            }
          }

          //* Lógica de vencimiento de cursos por tipo de suscripción - 6 meses
          if (
            subscriptionType.includes('semestral') &&
            source === 'subscription' &&
            minutosTranscurridos >= 6
          ) {

            if (!course.orderDate || !subscriptionType) continue;

            // console.log(`📉 Curso semestral vencido: ${title}`);

            // console.log(`📉 Curso mensual vencido: ${title}`);
            // Obtenemos el rol vencido desde la función
            const rolIdExpired = getRoleIdForExpiredCourses(title);
            // console.log(rolIdExpired, 'rold id expired');

            if (!rolId || !rolIdExpired) continue;
            // console.log(`⏳ rol expirado ${rolIdExpired} para curso "${title}" `);
            // console.log(`⏳ Expirando curso "${title}" para usuario con discordId ${discordId}`);
            try {
              // removemos el rol del curso en discord
              const removed = await removeRoleFromUser(discordId, rolId);
              // asignamos rol expirado
              const assigned = await assignRoleToUser(discordId, rolIdExpired);
              await delay(2000);
              const rol = await Rol.findOne({ discordId: discordId });
              if (!rol) {
                // console.error('No se encontró el documento Rol para este usuario');
                continue;
              }

              // Buscar el curso por título
              const course = rol.courses.find((c: any) => c.title === title);
              if (!course) {
                // console.error(`No se encontró el curso con título ${title}`);
                continue;
              }

              // Actualizar status en la bd

              if (assigned) {
                await Rol.updateOne(
                  { discordId: discordId, 'courses.title': title },
                  {
                    $set: {
                      'courses.$.status': 'expired',
                    },
                  }
                );
              }
            } catch (error) {
              console.error(
                `Error actualizando curso ${course.title} para usuario ${discordId}:`,
                error
              );
            }
          }

          //* Lógica de vencimiento de cursos por tipo de suscripción - 12 meses
          if (
            subscriptionType.includes('anual') &&
            source === 'subscription' &&
            minutosTranscurridos >= 12
          ) {

            if (!course.orderDate || !subscriptionType) continue;
            // console.log(`📉 Curso anual vencido: ${title}`);

            // console.log(`📉 Curso mensual vencido: ${title}`);
            // Obtenemos el rol vencido desde la función
            const rolIdExpired = getRoleIdForExpiredCourses(title);
            // console.log(rolIdExpired, 'rold id expired');

            if (!rolId || !rolIdExpired) continue;

            // console.log(`⏳ rol expirado ${rolIdExpired} para curso "${title}" `);
            // console.log(`⏳ Expirando curso "${title}" para usuario con discordId ${discordId}`);
            try {
              // removemos el rol del curso en discord
              // console.log('rolId', rolId);
              // console.log('discordId', discordId);
              const removed = await removeRoleFromUser(discordId, rolId);
              // asignamos rol expirado
              const assigned = await assignRoleToUser(discordId, rolIdExpired);
              await delay(2000);

              const rol = await Rol.findOne({ discordId: discordId });
              if (!rol) {
                // console.error('No se encontró el documento Rol para este usuario');
                continue;
              }

              // Buscar el curso por título
              const course = rol.courses.find((c: any) => c.title === title);
              if (!course) {
                // console.error(`No se encontró el curso con título ${title}`);
                continue;
              }

              // Actualizar status en la bd

              if (removed && assigned) {
                await Rol.updateOne(
                  { discordId: discordId, 'courses.title': title },
                  {
                    $set: {
                      'courses.$.status': 'expired',
                    },
                  }
                );
              }
            } catch (error) {
              console.error(
                `Error actualizando curso ${course.title} para usuario ${discordId}:`,
                error
              );
            }
          }

          // * ⏳ LOGICA PARA TRADING PRO
          if (
            title === 'Trading Pro' &&
            source === 'subscription' &&
            subscriptionType !== 'mensual'
          ) {
            if (!course.orderDate || !subscriptionType) continue;
            if (minutosTranscurridos >= fourMinutes) {
              // console.log('⚠️ Trading Pro: más de 4 meses, aplicar lógica especial');
              // Rol personalizado para después del mes (por ejemplo, 'Alumni Trading Pro')
              const secondRolId = process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO_SEGUNDO_ROL;
              const tradingProVencido = process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO_VENCIDO;
              // console.log('trading pro  vencido', tradingProVencido);

              if (!rolId || !tradingProVencido) continue;

              // console.log('rolid', rolId);
              // console.log('discordId', discordId);

              const removed = await removeRoleFromUser(discordId, secondRolId as string);
              const assigned = await assignRoleToUser(discordId, tradingProVencido);
            } else if (minutosTranscurridos >= oneMinute) {
              // console.log('⚠️ Trading Pro: más de 1 mes, asignando el 2 rol');

              // Rol personalizado para después del mes (por ejemplo, 'Alumni Trading Pro')
              const secondRolId = process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO_SEGUNDO_ROL;
              // console.log('trading pro second role', secondRolId);

              if (!rolId || !secondRolId) continue;

              // console.log('rolid', rolId);
              // console.log('discordId', discordId);

              try {
                const removed = await removeRoleFromUser(discordId, rolId);
                const assigned = await assignRoleToUser(discordId, secondRolId);

                // * IMPORTANTE ACA GUARDAMOS TRADING PRO SEGUNDO ROL PARA LUEGO ASIGNARLE ESTE ROL CUANDO RECLAME NUEVAMENTE

                if (assigned) {

                  //console.log('course.title', course.title);
                  await Rol.updateOne(
                    { _id: rol._id, 'courses.title': course.title },
                    {
                      $set: {
                        'courses.$.rolId': secondRolId,
                      },
                    }
                  );
                }
              } catch (error) {
                console.error(
                  `Error actualizando curso ${course.title} para usuario ${discordId}:`,
                  error
                );
              }
            }

            continue; // * ESTO EVITA QUE TRADING PRO SE EJECUTE FUERA DE ESTA CONDICIONAL
          }

        }

        //  source === 'manual' && minutosTranscurridos >= oneMinute  && minutosTranscurridos < threeMinutes)
        if (title === 'Trading Pro' &&
          source === 'manual' && minutosTranscurridos >= oneMinute && minutosTranscurridos < threeMinutes) {
          //console.log('entro');
          // console.log('⚠️ Trading Pro: más de 4 meses, aplicar lógica especial');
          // Rol personalizado para después del mes (por ejemplo, 'Alumni Trading Pro')
          const secondRolId = process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO_SEGUNDO_ROL;
          //console.log('trading pro  secondRolId', secondRolId);
          if (!rolId || !secondRolId) continue;
          //console.log('rolid', rolId);
          //console.log('discordId', discordId);

          try {
            const removed = await removeRoleFromUser(discordId, rolId);
            const assigned = await assignRoleToUser(discordId, secondRolId);
            //console.log('assigned', assigned);
            //console.log('rolid', rol?._id.toString())
            //console.log('course.title', course.title);

            // * IMPORTANTE ACA GUARDAMOS TRADING PRO SEGUNDO ROL PARA LUEGO ASIGNARLE ESTE ROL CUANDO RECLAME NUEVAMENTE

            const updated = await Rol.findOneAndUpdate(
              { _id: rol._id, 'courses.title': course.title },
              {
                $set: {
                  'courses.$.rolId': secondRolId,
                },
              },
              { new: true }
            );
            if (!updated) {
              console.log('No se encontró el rol para actualizar');
            }

          } catch (error) {
            console.error(
              `Error actualizando curso ${course.title} para usuario ${discordId}:`,
              error
            );
          }
        }
        // * VENCIMIENTO EN 3 MESES DE TODOS LOS CURSOS QUE NO SON TRADING PRO Y FUERON OBTENIDOS DE MANERA MANUAL
        else if (course.status !== 'expired' && course.source === 'manual' && minutosTranscurridos >= threeMinutes) {
          console.log('pasaron los 3 meses, venciendo cursos');

          // Obtenemos el rol vencido desde la función
          const rolIdExpired = getRoleIdForExpiredCourses(title);
          // console.log(rolIdExpired, 'rold id expired');

          if (!rolId || !rolIdExpired) continue;
          // console.log(`⏳ rol expirado ${rolIdExpired} para curso "${title}" `);
          // console.log(`⏳ Expirando curso "${title}" para usuario con discordId ${discordId}`);

          try {
            // removemos el rol del curso en discord
            const removed = await removeRoleFromUser(discordId, rolId);
            // asignamos rol expirado
            const assigned = await assignRoleToUser(discordId, rolIdExpired);
            await delay(2000);
            const rol = await Rol.findOne({ discordId: discordId });
            if (!rol) {
              // console.error('No se encontró el documento Rol para este usuario');
              continue;
            }

            // Buscar el curso por título
            const course = rol.courses.find((c: any) => c.title === title);
            if (!course) {
              // console.error(`No se encontró el curso con título ${title}`);
              continue;
            }

            // Actualizar status en la bd

            if (assigned) {
              await Rol.updateOne(
                { discordId: discordId, 'courses.title': title },
                {
                  $set: {
                    'courses.$.status': 'expired',
                  },
                }
              );
            }
          } catch (error) {
            console.error(
              `Error actualizando curso ${course.title} para usuario ${discordId}:`,
              error
            );
          }
        }
      }
    }

    // console.timeEnd('rol-expired-courses');

    return NextResponse.json({ ok: true, processed: roles.length });
  } catch (error: any) {
    console.error('🔥 Error en el cron de roles expirados:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
