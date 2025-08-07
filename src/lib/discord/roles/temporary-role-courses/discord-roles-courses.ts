// Archivo para manejar la secuencia de roles temporales
// C:\Users\Ecotech\Desktop\Jeronimo Alderete\finanflix-prod-main\src\lib\discord-roles-courses.ts

import { userHasRole } from '@/lib/discord/discord';
import { getRoleIdForCourse } from '../roleManager';
import { assignRoleToUser, removeRoleFromUser } from '../roleManager';

const ONE_MINUTE_IN_MS = 1 * 60 * 1000; // 1 minuto en milisegundos

// Función para obtener el ID de rol según el curso
export function getRoleIdForExpiredCourses(courseName: string): string | null {
  // Normalizar el nombre del curso para manejar mayúsculas/minúsculas y espacios
  const normalizedName = courseName.trim();

  const coursesRoleMap: Record<string, string> = {
    'DeFi Avanzado': process.env.NEXT_PUBLIC_DISCORD_ROLE_DEFI_AVANZADO_VENCIDO || '',
    'Análisis fundamental | Curso avanzado':
      process.env.NEXT_PUBLIC_DISCORD_ROLE_ANALISIS_FUNDAMENTAL_AVANZADO_VENCIDO || '',
    'Trading avanzado': process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_AVANZADO_VENCIDO || '',
    'Análisis Técnico de 0 a 100': process.env.NEXT_PUBLIC_DISCORD_ROLE_AT_0a100_VENCIDO || '',
    'NFTs Revolution': process.env.NEXT_PUBLIC_DISCORD_ROLE_NFTS_REVOLUTION_VENCIDO || '',
    Solidity: process.env.NEXT_PUBLIC_DISCORD_ROLE_SOLIDITY_VENCIDO || '',
    'Finanzas Personales': process.env.NEXT_PUBLIC_DISCORD_ROLE_FINANZAS_PERSONALES_VENCIDO || '',
    'Bolsa argentina': process.env.NEXT_PUBLIC_DISCORD_ROLE_BOLSA_ARGENTINA_VENCIDO || '',
    StartZero: process.env.NEXT_PUBLIC_DISCORD_ROLE_STARTZERO_VENCIDO || '',
    'Hedge Value': process.env.NEXT_PUBLIC_DISCORD_ROLE_HEDGE_VALUE_VENCIDO || '',
    'Trading Pro': process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO_VENCIDO || '',
  };

  const expiredRoleId = coursesRoleMap[normalizedName];
  return expiredRoleId || null;
}

// Función para iniciar la secuencia de roles para cursos
export async function startCoursesSequence(userId: string, courseName: string): Promise<void> {
  // console.log(`Iniciando secuencia de roles para ${courseName} para usuario ${userId}`);

  try {
    const roleId = getRoleIdForCourse(courseName); // Obtener el ID del rol normal del curso
    const expiredRoleId = getRoleIdForExpiredCourses(courseName); // Obtener el ID del rol vencido del curso

    if (!roleId || !expiredRoleId) {
      // console.error(`No se encontraron los IDs de roles para el curso ${courseName}`);
      return;
    }

    console.log(`Roles encontrados: normal=${roleId}, vencido=${expiredRoleId}`);

    const assignResult = await assignRoleToUser(userId, roleId); // Asignar el rol normal primero

    if (!assignResult) {
      // console.error(`Error al asignar el rol normal ${roleId} al usuario ${userId}`);
      return;
    }

    // console.log(`Rol normal ${roleId} asignado correctamente al usuario ${userId}`);

    setTimeout(async () => {
      // Programar el cambio al rol vencido después de 1 minuto
      try {
        const removeResult = await removeRoleFromUser(userId, roleId); // Quitar el rol normal

        // if (removeResult) {
        //   console.log(`Rol normal ${roleId} removido correctamente del usuario ${userId}`);
        // } else {
        //   console.error(`Error al remover el rol normal ${roleId} del usuario ${userId}`);
        // }

        const expiredAssignResult = await assignRoleToUser(userId, expiredRoleId); // Asignar el rol vencido

        // if (expiredAssignResult) {
        //   console.log(`Rol vencido ${expiredRoleId} asignado correctamente al usuario ${userId}`);
        // } else {
        //   console.error(`Error al asignar el rol vencido ${expiredRoleId} al usuario ${userId}`);
        // }
      } catch (error) {
        console.error(`Error en el cambio de roles para usuario ${userId}:`, error);
      }
    }, ONE_MINUTE_IN_MS);

    // console.log(
    //   `Temporizador configurado para cambiar roles en ${ONE_MINUTE_IN_MS}ms para usuario ${userId}`
    // );
  } catch (error) {
    console.error(`Error al iniciar la secuencia de roles para usuario ${userId}:`, error);
  }
}

// Función para procesar todos los cursos de un usuario y aplicar la secuencia de roles
export async function processUserCourses(userId: string, courseNames: string[]): Promise<void> {
  // console.log(`Procesando ${courseNames.length} cursos para el usuario ${userId}`);

  for (const courseName of courseNames) {
    // Ignorar Trading Pro ya que tiene su propia lógica
    if (courseName === 'Trading Pro') {
      // console.log(`Ignorando curso Trading Pro, ya tiene su propia secuencia`);
      continue;
    }

    // Obtener el ID del rol vencido para este curso
    const expiredRoleId = getRoleIdForExpiredCourses(courseName);

    if (!expiredRoleId) {
      // console.log(
      //   `No se encontró ID de rol vencido para el curso ${courseName}, continuando con secuencia normal`
      // );
      await startCoursesSequence(userId, courseName);
      continue;
    }

    // Verificar si el usuario ya tiene el rol vencido
    const hasExpiredRole = await userHasRole(userId, expiredRoleId);

    if (hasExpiredRole) {
      // hacemos esto para que typescript no lo tome como posible null y siempre sea un string
      const currentRoleId = getRoleIdForCourse(courseName);

      if (!currentRoleId) {
        // console.error(`No se encontró un rol activo para el curso ${courseName}. Saltando...`);
        continue;
      }

      // Validar si el curso actual es diferente del que ya tiene vencido
      // Es decir, si el usuario ya tiene un curso vencido que NO es el actual
      const isTryingToActivateDifferentCourse = !(await userHasRole(userId, currentRoleId));

      if (isTryingToActivateDifferentCourse) {
        // console.log(
        //   `El usuario ${userId} ya tiene un curso vencido y la activacion del rol no corresponde al curso ${courseName}. No se activará este curso.`
        // );
        continue;
      }

      // Llamar a la función para remover el rol vencido

      // Activar el nuevo rol para este curso
      await startCoursesSequence(userId, courseName);
      continue; // Continuar con el siguiente curso
    }

    // console.log(`Iniciando secuencia para curso: ${courseName}`);
    await startCoursesSequence(userId, courseName);
  }
}
