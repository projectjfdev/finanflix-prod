import { NextResponse } from 'next/server';
import Rol from '@/models/rolesModel';
import {
  assignSuscriptionRoleToUser,
  removeSubscriptionRoleFromUser,
} from '@/lib/discord/roles/roleManager';
import { connectDB } from '@/lib/dbConfig';
import { getRoleIdForExpiredSuscriptions } from '@/lib/discord/roles/temporary-role-subscriptions/discord-roles-suscription';
import { getCompletedCoursesCount } from '@/lib/getCompletedCoursesCount';
import { revokeUserResourcesDiamond, revokeUserResourcesDiamondCronJob } from '@/lib/discord/roles/roleManagerDiamond';
import UsersModel from '@/models/userModel';

export async function GET(req: Request) {
  const authHeader = req.headers.get('Authorization');


  const validSubTypes = [
    'Suscripcion basic - mensual',
    'Suscripcion basic - semestral',
    'Suscripcion basic - anual',
    'Suscripcion icon - mensual',
    'Suscripcion icon - semestral',
    'Suscripcion icon - anual'
  ];



  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const Suscriptionroles = await Rol.find({
      'sub.rol.orderDate': { $exists: true },
      'sub.rol.status': 'claimed'
    }).populate('userId');

    for (const suscription of Suscriptionroles) {
      const discordId = suscription.discordId;
      const sub = suscription.sub;

      // console.log('entrando aca', sub);

      if (!sub || !sub.rol.orderDate || sub.rol?.status === 'expired') continue;

      // console.log('sub orderdate', sub.rol.orderDate);
      // console.log('sub rol status', sub.rol?.status);

      const subType = sub.type;
      // console.log('subType', subType);
      if (!subType) continue;

      const userId = suscription.userId._id.toString();
      // console.log('userId', userId);

      const completedCourses = await getCompletedCoursesCount(userId);
      // console.log('completedCourses', completedCourses);

      let expirationMs = 0;

      // * TEMPORIZADORES TEST
      if (subType?.includes('mensual')) {
        expirationMs = 1 * 60 * 1000; // 1 minuto
      } else if (subType?.includes('semestral')) {
        expirationMs = 6 * 60 * 1000; // 6 minutos
      } else if (subType?.includes('anual')) {
        expirationMs = 12 * 60 * 1000; // 12 minutos
      }

      // // * TEMPORIZADORES PRODUCCIÓN
      // if (subType?.includes('mensual')) {
      //   expirationMs = 30 * 24 * 60 * 60 * 1000; // 30 días
      // } else if (subType?.includes('semestral')) {
      //   expirationMs = 6 * 30 * 24 * 60 * 60 * 1000; // Aproximadamente 6 meses
      // } else if (subType?.includes('anual')) {
      //   expirationMs = 12 * 30 * 24 * 60 * 60 * 1000; // Aproximadamente 12 meses
      // }

      // SETEAMOS EL EXPIRATION DATE LUEGO DE DEFINIRLO
      const expirationDate = new Date(Date.now() - expirationMs);

      // * LOGICA DE SUSCRIPCION MENSUAL CON 3 O MAS CURSOS COMPLETADOS
      //*  EXPIRACION DE LOS 3 CURSOS COMPLETADOS SI PASA EL TIEMPO DE SUSCRIPCION
      if (
        new Date(sub.rol.orderDate) <= expirationDate &&
        subType === 'Suscripcion basic - mensual' &&
        completedCourses >= 3
      ) {
        console.log('suscripcion mensual entrando, tiene 3 cursos completados o mas');

        // * EXPIRAMOS LA SUSCRIPCION INDEPENDIENTEMENTE DEL DISCORDID
        await UsersModel.updateOne(
          { _id: userId },
          {
            $set: {
              'suscription.status': 'expired',
            },
          }
        );

        const threeCompletedCoursesRole =
          process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL_THREE_COMPLETED_COURSES;
        // console.log('threeCompletedCoursesRole', threeCompletedCoursesRole);

        const assigned = await assignSuscriptionRoleToUser(
          discordId,
          threeCompletedCoursesRole as string
        );

        if (assigned) {
          suscription.sub.rol.id = threeCompletedCoursesRole;
          suscription.markModified('sub');
          console.log(
            `✅ Suscripción "${subType}" actualizado el rolId de los 3 cursos completados`
          );
          await suscription.save();
        }


        const rolId = sub.rol?.id;
        console.log('rolId', rolId);

        const rolIdExpired = getRoleIdForExpiredSuscriptions(subType);
        console.log('rolIdExpired', rolIdExpired);

        if (!rolId || !rolIdExpired) continue;
        console.log('discordId', discordId);

        const removed = await removeSubscriptionRoleFromUser(discordId, rolId);

        console.log('discordId', discordId);
        console.log('rolId', rolId);
        console.log('Role removed?', removed);
        const assignedExpiredRol = await assignSuscriptionRoleToUser(discordId, rolIdExpired);

        if (removed && assignedExpiredRol) {
          suscription.sub.rol.status = 'expired';
          suscription.markModified('sub');
          console.log(`✅ Suscripción "${subType}" marcada como expirada`);
          await suscription.save();

          //* ACTUALIZO EL STATUS DE LA SUSCRIPCION A EXPIRED EN UsersModel
          await UsersModel.updateOne(
            { _id: userId },
            {
              $set: {
                'suscription.status': 'expired',
              },
            }
          );

        } else {
          // ✅ Si no tiene discordId, simplemente actualizamos estado
          console.log(`Usuario sin discordId: ${userId}. Actualizando suscripción a expired.`);
          suscription.sub.rol.status = 'expired';
          suscription.markModified('sub');
          await suscription.save();

          await UsersModel.updateOne(
            { _id: userId },
            {
              $set: {
                'suscription.status': 'expired',
              },
            }
          );

        }

      }

      // console.log('expirationDate', expirationDate);

      // * VENCIMIENTO DE TODAS LAS OTRAS SUSCRIPCIONES (incluye BASIC MENSUAL si no tiene 3 cursos completados)
      if (
        new Date(sub.rol.orderDate) <= expirationDate &&
        (
          subType !== 'Suscripcion basic - mensual' ||
          (subType === 'Suscripcion basic - mensual' && completedCourses < 3)
        )
      ) {
        console.log('entrando aca ahora');
        console.log('expirationDate', expirationDate);

        // * EXPIRAMOS LA SUSCRIPCION INDEPENDIENTEMENTE DEL DISCORDID
        await UsersModel.updateOne(
          { _id: userId },
          {
            $set: {
              'suscription.status': 'expired',
            },
          }
        );

        const rolId = sub.rol?.id;
        console.log('rolId', rolId);
        console.log('Logica activada');

        const rolIdExpired = getRoleIdForExpiredSuscriptions(subType);
        console.log('rolIdExpired', rolIdExpired);

        if (!rolId || !rolIdExpired) continue;

        const removed = await removeSubscriptionRoleFromUser(discordId, rolId);
        const assigned = await assignSuscriptionRoleToUser(discordId, rolIdExpired);

        console.log('discordId', discordId);
        console.log('rolId', rolId);
        console.log('Role removed?', removed);

        if (removed && assigned) {
          suscription.sub.rol.status = 'expired';
          suscription.markModified('sub');
          // console.log(`✅ Suscripción "${subType}" marcada como expirada`);
          await suscription.save();

          //* ACTUALIZO EL STATUS DE LA SUSCRIPCION A EXPIRED EN UsersModel
          await UsersModel.updateOne(
            { _id: userId },
            {
              $set: {
                'suscription.status': 'expired',
              },
            }
          );
        } else {
          // ✅ Si no tiene discordId, simplemente actualizamos estado
          console.log(`Usuario sin discordId: ${userId}. Actualizando suscripción a expired.`);
          suscription.sub.rol.status = 'expired';
          suscription.markModified('sub');
          await suscription.save();

          await UsersModel.updateOne(
            { _id: userId },
            {
              $set: {
                'suscription.status': 'expired',
              },
            }
          );

        }

        // * Si la suscripcion vencida es diamond se vencen los cursos y la suscripcion
        if (subType.includes('diamond')) {
          console.log('removiendo suscripcion diamond y sus cursos correspondientes');

          // * EXPIRAMOS LA SUSCRIPCION INDEPENDIENTEMENTE DEL DISCORDID
          await UsersModel.updateOne(
            { _id: userId },
            {
              $set: {
                'suscription.status': 'expired',
              },
            }
          );
          await revokeUserResourcesDiamondCronJob(discordId, userId);
        }
      }
    }

    return NextResponse.json({ ok: true, message: 'Suscripciones procesadas' });
  } catch (error) {
    // console.error('❌ Error al procesar suscripciones:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
