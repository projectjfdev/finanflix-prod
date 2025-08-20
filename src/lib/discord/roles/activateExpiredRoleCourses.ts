import { getDiscordIdForUser } from '@/utils/Endpoints/userService';
import { assignRoleToUser, assignSuscriptionRoleToUser, removeRoleFromUser } from './roleManager';
import { userHasRole } from '../discord';
import Rol from '@/models/rolesModel';

interface CourseRole {
  rolId: string;
  title: string;
  status: string;
  orderDate: string;
}

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

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function activeCoursesRolesInSus(discordId: string, userId: string) {
  // console.log('🔁 Sincronizando roles para usuario Diamond:', discordId);

  // * LOGICA PARA ASIGNAR 2 ROL DE TRADING PRO EN DISCORD
  const tradingProSecondRolId = process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO_SEGUNDO_ROL!;
  let tradingProSecondAssigned = await userHasRole(discordId, tradingProSecondRolId);
  // console.log('hasTradingProSegundo', tradingProSecondAssigned);

  // Primero: eliminamos todos los roles vencidos
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

  // Segundo: verificamos Trading Pro Segundo y lógica especial
  const secondRolTradingProWasClaimed = await Rol.findOne({
    discordId: discordId,
    'courses.rolId': tradingProSecondRolId,
  });

  if (secondRolTradingProWasClaimed && !tradingProSecondAssigned) {
    const userRolDoc = await Rol.findOne({ discordId: discordId });

    const hasFirstTradingProRole = userRolDoc?.courses?.some(
      (course: CourseRole) => course.rolId === process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO
    );

    if (hasFirstTradingProRole) {
      // console.log('⛔ Usuario ya tiene el primer rol de Trading Pro, no se asigna el segundo.');
      return;
    }

    try {
      const assignSecondRole = await assignRoleToUser(discordId, tradingProSecondRolId);
      // console.log('✅ Trading Pro Segundo asignado manualmente:', assignSecondRole);
      tradingProSecondAssigned = true;
      await delay(1000);
    } catch (error) {
      console.error('❌ Error al asignar Trading Pro Segundo:', error);
    }
  }

  // Tercero: reasignamos SOLO los cursos expirados en BD
  const userRolDoc = await Rol.findOne({ discordId: discordId });

  if (!userRolDoc || !userRolDoc.courses || userRolDoc.courses.length === 0) {
    console.log('⚠️ No hay cursos previos para el usuario. No hay roles expirados para reactivar.');
  } else {
    const expiredCoursesInDB = userRolDoc.courses.filter(
      (course: CourseRole) => course.status === 'expired'
    );

    // console.log('🕑 Cursos expirados a reactivar:', expiredCoursesInDB);

    for (const expiredCourse of expiredCoursesInDB) {
      const roleIdToAssign = expiredCourse.rolId;

      if (!roleIdToAssign) {
        // console.warn('⚠️ No se encontró roleId para el curso expirado');
        continue;
      }

      const isTradingProSecond = roleIdToAssign === tradingProSecondRolId;
      const hasTradingProFirst = userRolDoc.courses?.some(
        (course: CourseRole) => course.rolId === process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO
      );

      if (isTradingProSecond && !hasTradingProFirst) {
        // console.log('⛔ No se puede asignar Trading Pro Segundo sin tener el primero.');
        continue;
      }

      try {
        const assigned = await assignSuscriptionRoleToUser(discordId, roleIdToAssign);
        // console.log(`✅ Rol reactivado ${roleIdToAssign} asignado:`, assigned);
        await delay(1000);
      } catch (error) {
        console.error(`❌ Error al asignar rol ${roleIdToAssign}:`, error);
      }
    }

    // Al final vamos a actualizar BD con solo los cursos que estaban vencidos y ahora reclamados
    const normalizedDiscordId = discordId.trim().toLowerCase();
    const existingRolDoc = await Rol.findOne({ discordId: normalizedDiscordId });
    // Empezamos con los cursos existentes, pero filtrando el tradingProSegundo para preservarlo igual
    const preservedCourses: CourseRole[] = [];
    const otherCourses: CourseRole[] = [];

    if (existingRolDoc?.courses?.length) {
      for (const c of existingRolDoc.courses) {
        if (c.rolId === tradingProSecondRolId) {
          preservedCourses.push(c);
        } else {
          otherCourses.push(c);
        }
      }
    }

    const assignedCourses = [...preservedCourses, ...otherCourses];
    const now = new Date();

    for (let i = 0; i < courseRoles.length; i++) {
      const role = courseRoles[i];
      const title = courseTitles[i];

      if (!role.roleId) continue;

      const isTradingPro = role.roleId === process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO;
      const isTradingProSecond = role.roleId === tradingProSecondRolId;

      if (isTradingProSecond) {
        // console.log('✅ Se conserva Trading Pro Segundo Rol tal como está en BD');
        continue;
      }

      if (isTradingPro && preservedCourses.length > 0) {
        // console.log('⚠️ Se omite Trading Pro porque ya existe Trading Pro Segundo');
        const tradingProSecondCourse = assignedCourses.find(c => c.rolId === tradingProSecondRolId);
        if (tradingProSecondCourse) {
          tradingProSecondCourse.status = 'claimed';
          tradingProSecondCourse.orderDate = now.toISOString();
        }
        continue;
      }

      // Actualizamos el status de los cursos que estaban expirados
      for (const course of otherCourses) {
        const wasExpired = expiredCoursesInDB.find((c: CourseRole) => c.rolId === course.rolId);
        if (wasExpired) {
          course.status = 'claimed';
          course.orderDate = now.toISOString();
        }
      }
    }

    //* Aca actualizamos en la bd a claimed el curso que estaba vencido
    if (existingRolDoc) {
      await Rol.updateOne(
        { discordId: normalizedDiscordId },
        { $set: { courses: assignedCourses } }
      );
      // console.log('✅ Documento actualizado con exito');
    } else {
      await Rol.create({
        discordId: normalizedDiscordId,
        userId: userId,
        courses: assignedCourses,
      });
      // console.log('✅ Documento creado');
    }
  }
}

// Esta función recibe userId, busca el discordId y llama a la anterior
export async function syncCoursesRolesByUserId(userId: string) {
  try {
    const discordId = await getDiscordIdForUser(userId);
    if (!discordId) {
      // console.warn(`No se encontró Discord ID para el usuario con id: ${userId}`);
      return;
    }

    await activeCoursesRolesInSus(discordId, userId);
  } catch (error) {
    console.error('Error al sincronizar roles por userId:', error);
  }
}
