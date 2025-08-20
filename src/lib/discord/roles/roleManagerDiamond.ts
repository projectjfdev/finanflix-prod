import { getDiscordIdForUser } from '@/utils/Endpoints/userService';
import { assignRoleToUser, assignSuscriptionRoleToUser, removeRoleFromUser } from './roleManager';
import { userHasRole } from '../discord';
import Rol from '@/models/rolesModel';
import UsersModel from '@/models/userModel';

interface CourseRole {
  rolId: string;
  title: string;
  status: string;
  source: 'manual' | 'subscription';
  subscriptionType?: 'mensual' | 'semestral' | 'anual' | null;
  orderDate: string;
}

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

const courseRoles = [
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_DEFI_AVANZADO,
  },
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_ANALISIS_FUNDAMENTAL_AVANZADO,
  },
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_AVANZADO,
  },
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_AT_0a100,
  },
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_NFTS_REVOLUTION,
  },
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_SOLIDITY,
  },
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_FINANZAS_PERSONALES,
  },
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_BOLSA_ARGENTINA,
  },
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_STARTZERO,
  },
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_HEDGE_VALUE,
  },
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO,
  },
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO_SEGUNDO_ROL,
  },
];

const expiredCourseRoles = [
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_DEFI_AVANZADO_VENCIDO,
  },
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_ANALISIS_FUNDAMENTAL_AVANZADO_VENCIDO,
  },
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_AVANZADO_VENCIDO,
  },
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_AT_0a100_VENCIDO,
  },
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_NFTS_REVOLUTION_VENCIDO,
  },
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_SOLIDITY_VENCIDO,
  },
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_FINANZAS_PERSONALES_VENCIDO,
  },
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_BOLSA_ARGENTINA_VENCIDO,
  },
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_STARTZERO_VENCIDO,
  },
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_HEDGE_VALUE_VENCIDO,
  },
  {
    roleId: process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO_VENCIDO,
  },
];

// Combinar título y roleId basado en el índice
const courses = courseTitles.map((title, index) => ({
  title,
  roleId: courseRoles[index]?.roleId || null,
}));

// console.log(courses);

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const tradingProSecondRolId = process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO_SEGUNDO_ROL;

// Esta función recibe discordId y hace la sincronización
export async function syncDiamondRoles(
  discordId: string,
  userId: string,
  subscriptionType?: 'mensual' | 'semestral' | 'anual' | null
) {
  // console.log('🔁 Sincronizando roles para usuario Diamond:', discordId);

  // Primero, chequeamos si tiene el rol de Trading Pro Segundo
  let tradingProSecondAssigned = await userHasRole(discordId, tradingProSecondRolId!);

  // console.log('hasTradingProSegundo', tradingProSecondAssigned);

  // * ELIMINAMOS ROLES VENCIDOS
  for (const expiredCourse of expiredCourseRoles) {
    if (expiredCourse.roleId) {
      try {
        const removed = await removeRoleFromUser(discordId, expiredCourse.roleId);
        // console.log(`🧹 Rol vencido ${expiredCourse.roleId} eliminado:`, removed);
        await delay(2000);
      } catch (error) {
        console.error(`❌ Error al remover rol ${expiredCourse.roleId}:`, error);
      }
    }
  }

  // * GUARDAMOS EL SEGUNDO ROL DE TRADING PRO EN LA BD
  const secondRolTradingProWasClaimed = await Rol.findOne({
    discordId: discordId,
    'courses.rolId': tradingProSecondRolId,
  });

  if (secondRolTradingProWasClaimed && !tradingProSecondAssigned) {
    const userRolDoc = await Rol.findOne({ discordId: discordId });

    // console.log('📄 Cursos encontrados en el Rol document:', userRolDoc?.courses);

    const hasFirstTradingProRole = userRolDoc?.courses?.some(
      (course: CourseRole) => course.rolId === process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO
    );

    if (hasFirstTradingProRole) {
      // console.log('⛔ Usuario ya tiene el primer rol de Trading Pro, no se asigna el segundo.');
      return;
    }

    try {
      const assignSecondRole = await assignRoleToUser(discordId, tradingProSecondRolId as string);
      // console.log('✅ Trading Pro Segundo asignado manualmente:', assignSecondRole);
      tradingProSecondAssigned = true; // ⚠️ IMPORTANTE: lo marcamos como asignado
      await delay(1000);
    } catch (error) {
      console.error('❌ Error al asignar Trading Pro Segundo:', error);
    }
  }

  // Código para asignar roles activos
  for (const activeRole of courseRoles) {
    if (activeRole.roleId) {
      const isTradingProFirst =
        activeRole.roleId === process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO;
      const isTradingProSecond = activeRole.roleId === tradingProSecondRolId;
      const userRolDoc = await Rol.findOne({ discordId: discordId });

      // Verificamos si el usuario ya tiene el primer rol de Trading Pro
      const hasTradingProFirst = userRolDoc?.courses?.some(
        (course: CourseRole) => course.rolId === process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO
      );

      // También podés evitar asignar el segundo rol si ya lo tiene para no duplicar
      const hasTradingProSecond = userRolDoc?.courses?.some(
        (course: CourseRole) =>
          course.rolId === process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO_SEGUNDO_ROL
      );

      if (isTradingProSecond && hasTradingProSecond) {
        // console.log('⚠️ Usuario ya tiene el segundo Trading Pro, se omite duplicación');
        continue;
      }

      // Evitar asignar el segundo rol si no tiene el primero
      if (isTradingProSecond && !hasTradingProFirst) {
        // console.log(
        //   '⛔ Usuario NO tiene el primer Trading Pro, no se asigna el segundo Trading Pro.'
        // );
        continue; // saltamos este rol
      }

      // 🔒 NUEVA VERIFICACIÓN para evitar que el segundo Trading Pro se asigne si ya tiene el primero
      if (
        isTradingProSecond &&
        userRolDoc?.courses?.some(
          (course: CourseRole) => course.rolId === process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO
        )
      ) {
        // console.log('⛔ Usuario ya tiene el primer Trading Pro, no se asigna el segundo.');
        continue;
      }

      if (isTradingProFirst && tradingProSecondAssigned) {
        // console.log('⚠️ Usuario ya tiene Trading Pro Segundo, no se asigna Trading Pro');
        continue;
      }

      if (isTradingProSecond && tradingProSecondAssigned) {
        // console.log('⚠️ Ya se asignó Trading Pro Segundo, se omite duplicación');
        continue;
      }

      // ACA SE ASIGNAN EL ROL

      try {
        const assigned = await assignSuscriptionRoleToUser(discordId, activeRole.roleId);
        // console.log(`✅ Rol activo ${activeRole.roleId} asignado:`, assigned);
        await delay(1000);
      } catch (error) {
        console.error(`❌ Error al asignar rol ${activeRole.roleId}:`, error);
      }
    } else {
      console.warn('⚠️ roleId no definido en uno de los arrays');
    }
  }

  // Fecha actual
  const now = new Date();

  //* ---------------- LOGICA DEL ROL DOCUMENT BD
  try {
    const normalizedDiscordId = discordId.trim().toLowerCase();
    const existingRolDoc = await Rol.findOne({ discordId: normalizedDiscordId });
    const preservedCourses: CourseRole[] = [];

    // ✅ Preservar el curso con Trading Pro Segundo si ya está en la BD
    if (existingRolDoc?.courses?.length) {
      preservedCourses.push(
        ...existingRolDoc.courses.filter((c: CourseRole) => c.rolId === tradingProSecondRolId)
      );
    }

    const assignedCourses: CourseRole[] = [...preservedCourses];

    for (let i = 0; i < courseRoles.length; i++) {
      const role = courseRoles[i];
      const title = courseTitles[i];

      if (!role.roleId) continue;

      const isTradingPro = role.roleId === process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO;
      const isTradingProSecond = role.roleId === tradingProSecondRolId;

      // * ❌ No volver a agregar Trading Pro Segundo si ya se preservó
      if (isTradingProSecond) {
        // console.log(
        //   '✅ Se conserva Trading Pro Segundo Rol tal como está en BD, no se modifica ni duplica'
        // );
        continue;
      }

      //* ⚠️ Si hay Trading Pro Segundo, omitimos agregar el rolId de Trading Pro 1
      if (isTradingPro && preservedCourses.length > 0) {
        // console.log('⚠️ Se omite Trading Pro porque ya existe Trading Pro Segundo');
        // Buscar el segundo Trading Pro en assignedCourses para actualizar status y orderDate
        const tradingProSecondCourse = assignedCourses.find(c => c.rolId === tradingProSecondRolId);
        if (tradingProSecondCourse) {
          tradingProSecondCourse.status = 'claimed';
          tradingProSecondCourse.orderDate = now.toISOString();
        }
        continue;
      }

      assignedCourses.push({
        rolId: role.roleId,
        title,
        status: 'claimed',
        source: 'subscription',
        subscriptionType: subscriptionType,
        orderDate: now.toISOString(),
      });
    }

    if (existingRolDoc) {
      // Actualizar solo si ya existe
      await Rol.updateOne(
        { discordId: normalizedDiscordId },
        { $set: { courses: assignedCourses } }
      );
      // console.log('✅ Documento actualizado');
    } else {
      // Crear nuevo documento si no existe
      await Rol.create({
        discordId: normalizedDiscordId,
        userId: userId,
        courses: assignedCourses,
      });
      // console.log('✅ Documento creado');
    }
  } catch (error) {
    console.error('❌ Error actualizando los roles en BD:', error);
  }
}

// Esta función recibe userId, busca el discordId y llama a la anterior
export async function syncDiamondRolesByUserId(
  userId: string,
  subscriptionType?: 'mensual' | 'semestral' | 'anual' | null
) {
  try {
    const discordId = await getDiscordIdForUser(userId);
    if (!discordId) {
      // console.warn(`No se encontró Discord ID para el usuario con id: ${userId}`);
      return;
    }

    await syncDiamondRoles(discordId, userId, subscriptionType);
  } catch (error) {
    console.error('Error al sincronizar roles por userId:', error);
  }
}

export async function removeCourseRolesDiamond(discordId: string) {
  // console.log('🧹 Removiendo roles activos de cursos para usuario:', discordId);

  for (const activeRole of courseRoles) {
    if (activeRole.roleId) {
      try {
        const removed = await removeRoleFromUser(discordId, activeRole.roleId);
        // console.log(`✅ Rol activo ${activeRole.roleId} removido:`, removed);
        await delay(1000);
      } catch (error) {
        console.error(`❌ Error al remover rol ${activeRole.roleId}:`, error);
      }
    } else {
      console.warn('⚠️ roleId no definido en uno de los courseRoles');
    }
  }

  // * ACTUALIZAMOS LOS ROLES DE LOS CURSOS A EXPIRES EN LA BASE DE DATOS
  try {
    const rolDoc = await Rol.findOne({ discordId });
    if (rolDoc) {
      const updatedCourses = rolDoc.courses.map((course: CourseRole) => {
        // Solo cambiamos a "expired" si es uno de los roles activo
        const isActiveCourse = courseRoles.some(role => role.roleId === course.rolId);
        if (isActiveCourse) {
          return { ...course, status: 'expired' };
        }
        return course;
      });

      rolDoc.courses = updatedCourses;
      await rolDoc.save();
      // console.log('📁 Estado de cursos actualizado a "expired" en la base de datos');
    } else {
      console.warn(`⚠️ No se encontró documento Rol para discordId: ${discordId}`);
    }
  } catch (error) {
    console.error('❌ Error al actualizar cursos a "expired" en la base de datos:', error);
  }
}

export async function removeCourseRolesDiamondByUserId(userId: string) {
  try {
    const discordId = await getDiscordIdForUser(userId);
    if (!discordId) {
      // console.warn(`No se encontró Discord ID para el usuario con id: ${userId}`);
      // Usuario sin Discord ID
      console.log(`Usuario sin discordId: ${userId}. Actualizando suscripción a expired.`);

      // ✅ 2. Actualizar el estado de la suscripción en UsersModel
      await UsersModel.updateOne(
        { _id: userId },
        {
          $set: {
            'suscription.status': 'expired',
          },
        }
      );
      return;
    }

    await removeCourseRolesDiamond(discordId);
  } catch (error) {
    console.error('Error al remover roles por userId:', error);
  }
}

/**
 * 🔒 Revoca todos los recursos asociados a Diamond: roles, accesos y base de datos
 */
export async function revokeUserResourcesDiamond(discordId: string) {
  try {
    // console.log(`🔒 Revocando recursos Diamond para: ${discordId}`);

    // 1. Remover roles activos de cursos Diamond
    await removeCourseRolesDiamond(discordId);

    // 2. Asignar roles vencidos de los cursos
    for (const expiredRole of expiredCourseRoles) {
      if (expiredRole.roleId) {
        try {
          const assigned = await assignSuscriptionRoleToUser(discordId, expiredRole.roleId);
          // console.log(`🕒 Rol vencido ${expiredRole.roleId} asignado:`, assigned);
          await delay(1000);
        } catch (error) {
          console.error(`❌ Error al asignar rol vencido ${expiredRole.roleId}:`, error);
        }
      } else {
        console.warn('⚠️ roleId no definido en uno de los expiredCourseRoles');
      }
    }

    console.log('✅ Recursos Diamond revocados correctamente');
  } catch (error) {
    console.error('❌ Error al revocar recursos Diamond:', error);
  }
}


/**
 * 🔒 // * REMOVER CURSOS DIAMOND FUNCTION EXCLUSIVA PARA EL CRON JOBS
 */
export async function revokeUserResourcesDiamondCronJob(discordId: string | null | undefined, userId: string) {
  try {
    // console.log(`🔒 Revocando recursos Diamond para: ${discordId}`);

    if (!discordId) {
      console.log(`No hay discordId para userId: ${userId}. Marcando suscripción como expired.`);
      await UsersModel.updateOne(
        { _id: userId },
        { $set: { 'suscription.status': 'expired' } }
      );
      return;  // Salir porque no hay discordId para remover roles o asignar
    }

    // 1. Remover roles activos de cursos Diamond
    await removeCourseRolesDiamond(discordId);

    // 2. Asignar roles vencidos de los cursos
    for (const expiredRole of expiredCourseRoles) {
      if (expiredRole.roleId) {
        try {
          const assigned = await assignSuscriptionRoleToUser(discordId, expiredRole.roleId);
          // console.log(`🕒 Rol vencido ${expiredRole.roleId} asignado:`, assigned);
          await delay(1000);

        } catch (error) {
          console.error(`❌ Error al asignar rol vencido ${expiredRole.roleId}:`, error);
        }

      } else {
        console.warn('⚠️ roleId no definido en uno de los expiredCourseRoles');
      }
    }

    //* ACTUALIZO EL STATUS DE LA SUSCRIPCION A EXPIRED EN UsersModel
    await UsersModel.updateOne(
      { _id: userId },
      {
        $set: {
          'suscription.status': 'expired',
        },
      }
    );

    console.log('✅ Recursos Diamond revocados correctamente');
  } catch (error) {
    console.error('❌ Error al revocar recursos Diamond:', error);
  }
}
