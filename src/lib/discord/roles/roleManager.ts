import { DISCORD_CONFIG } from '../discord';

// Función para obtener el ID de rol según el curso
export function getRoleIdForCourse(courseName: string): string | null {
  // console.log('Course name:', courseName);
  // Normalizar el nombre del curso para manejar mayúsculas/minúsculas y espacios
  const normalizedName = courseName.trim();

  // Mapa de tipos de cursos normalizados a variables de entorno
  const coursesRoleMap: Record<string, string> = {
    'DeFi Avanzado': process.env.NEXT_PUBLIC_DISCORD_ROLE_DEFI_AVANZADO || '1',
    'Análisis fundamental | Curso avanzado':
      process.env.NEXT_PUBLIC_DISCORD_ROLE_ANALISIS_FUNDAMENTAL_AVANZADO || '2',
    'Trading avanzado': process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_AVANZADO || '3',
    'Análisis Técnico de 0 a 100': process.env.NEXT_PUBLIC_DISCORD_ROLE_AT_0a100 || '4',
    'NFTs Revolution': process.env.NEXT_PUBLIC_DISCORD_ROLE_NFTS_REVOLUTION || '5',
    Solidity: process.env.NEXT_PUBLIC_DISCORD_ROLE_SOLIDITY || '6',
    'Finanzas Personales': process.env.NEXT_PUBLIC_DISCORD_ROLE_FINANZAS_PERSONALES || '7',
    'Bolsa argentina': process.env.NEXT_PUBLIC_DISCORD_ROLE_BOLSA_ARGENTINA || '8',
    StartZero: process.env.NEXT_PUBLIC_DISCORD_ROLE_STARTZERO || '9',
    'Hedge Value': process.env.NEXT_PUBLIC_DISCORD_ROLE_HEDGE_VALUE || '10',
    'Trading Pro': process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO || '11',
  };
  // console.log('normalizedName', normalizedName);

  const roleId = coursesRoleMap[normalizedName];

  // console.log('coursesRoleMap:', coursesRoleMap);
  // console.log('Found course role ID:', roleId);
  return roleId || null;
}

// Función para obtener el ID de rol según el tipo de suscripción
export function getRoleIdForSubscription(subscriptionType: string): string | null {
  //console.log('Subscription type:', subscriptionType);

  // Normalizar el tipo de suscripción para manejar mayúsculas/minúsculas y espacios
  const normalizedType = subscriptionType.trim();

  // Mapa de tipos de suscripción normalizados a variables de entorno
  const subscriptionRoleMap: Record<string, string> = {
    'Suscripcion basic - mensual': process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL || '',
    'Suscripcion basic - semestral': process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL || '',
    'Suscripcion basic - anual': process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL || '',

    'Suscripcion icon - mensual': process.env.NEXT_PUBLIC_DISCORD_ROLE_ICON || '',
    'Suscripcion icon - semestral': process.env.NEXT_PUBLIC_DISCORD_ROLE_ICON || '',
    'Suscripcion icon - anual': process.env.NEXT_PUBLIC_DISCORD_ROLE_ICON || '',

    'Suscripcion diamond - mensual': process.env.NEXT_PUBLIC_DISCORD_ROLE_DIAMOND || '',
    'Suscripcion diamond - semestral': process.env.NEXT_PUBLIC_DISCORD_ROLE_DIAMOND || '',
    'Suscripcion diamond - anual': process.env.NEXT_PUBLIC_DISCORD_ROLE_DIAMOND || '',
  };

  const suscriptionRoleId = subscriptionRoleMap[normalizedType];

  // DEBUG
  console.log(subscriptionRoleMap);
  console.log(normalizedType);
  // console.log('Found role ID:', roleId);

  console.log('suscriptionRoleId', suscriptionRoleId);


  return suscriptionRoleId || null;
}

// ------------------------------ ASIGNACION DE ROLES DE DISCORD  ------------------------------------------ //

// Asignar rol a usuario
export async function assignRoleToUser(userDiscordId: string, roleId: string): Promise<boolean> {
  try {
    if (!roleId || !userDiscordId) {
      // console.error('Missing required parameters:', { userDiscordId, roleId });
      return false;
    }

    if (!DISCORD_CONFIG.BOT_TOKEN || !DISCORD_CONFIG.GUILD_ID) {
      // console.error('Missing required environment variables for Discord integration');
      return false;
    }

    // console.log(`Attempting to assign role ${roleId} to user ${userDiscordId}`);

    const response = await fetch(
      `https://discord.com/api/v10/guilds/${DISCORD_CONFIG.GUILD_ID}/members/${userDiscordId}/roles/${roleId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bot ${DISCORD_CONFIG.BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 204) {
      // console.log('Role assigned successfully');
      return true;
    } else {
      const errorData = await response.text();
      // console.error('Discord API error:', response.status, errorData);
      return false;
    }
  } catch (error) {
    // console.error('Error asignando rol al usuario:', error);
    return false;
  }
}

// Asignar múltiples roles a un usuario
export async function assignMultipleRolesToUser(
  userId: string,
  roleIds: string[]
): Promise<{ success: boolean; assignedRoles: number }> {
  let assignedCount = 0;

  for (const roleId of roleIds) {
    if (roleId) {
      const success = await assignRoleToUser(userId, roleId);
      if (success) {
        assignedCount++;
      }
    }
  }

  return {
    success: assignedCount > 0,
    assignedRoles: assignedCount,
  };
}

// Asignar rol a usuario
export async function assignSuscriptionRoleToUser(
  userId: string,
  suscriptionRoleId: string
): Promise<boolean> {
  console.log('suscriptionRoleId', suscriptionRoleId);

  try {
    if (!suscriptionRoleId || !userId) {
      console.error('Missing required parameters:', { userId, suscriptionRoleId });
      return false;
    }

    if (!DISCORD_CONFIG.BOT_TOKEN || !DISCORD_CONFIG.GUILD_ID) {
      console.error('Missing required environment variables for Discord integration');
      return false;
    }

    console.log(`Attempting to assign role ${suscriptionRoleId} to user ${userId}`);

    const response = await fetch(
      `https://discord.com/api/v10/guilds/${DISCORD_CONFIG.GUILD_ID}/members/${userId}/roles/${suscriptionRoleId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bot ${DISCORD_CONFIG.BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 204) {
      console.log('Role assigned successfully');
      return true;
    } else {
      const errorData = await response.text();
      // console.error('Discord API error:', response.status, errorData);
      return false;
    }
  } catch (error) {
    // console.error('Error asignando rol al usuario:', error);
    return false;
  }
}

// ------------------------------ REMOCION DE ROLES DE DISCORD  ------------------------------------------ //

// Función para remover rol de un usuario - ACA TENGO EL PROBLEMA
export async function removeRoleFromUser(userId: string, roleId: string): Promise<boolean> {
  try {
    if (!roleId || !userId) {
      // console.error('Missing required parameters:', { userId, roleId });
      return false;
    }

    if (!DISCORD_CONFIG.BOT_TOKEN || !DISCORD_CONFIG.GUILD_ID) {
      // console.error('Missing required environment variables for Discord integration');
      return false;
    }

    // console.log(`Attempting to remove role ${roleId} from user ${userId}`);

    const response = await fetch(
      `https://discord.com/api/v10/guilds/${DISCORD_CONFIG.GUILD_ID}/members/${userId}/roles/${roleId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bot ${DISCORD_CONFIG.BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 204) {
      // console.log('Role removed successfully');
      return true;
    } else {
      const errorData = await response.text();
      // console.error('Discord API error:', response.status, errorData);
      return false;
    }
  } catch (error) {
    // console.error('Error removing role from user:', error);
    return false;
  }
}

export async function removeSubscriptionRoleFromUser(
  userDiscordId: string,
  suscriptionRoleId: string
): Promise<boolean> {
  try {
    if (!userDiscordId || !suscriptionRoleId) {
      // console.error('Faltan parámetros requeridos:', { userDiscordId, suscriptionRoleId });
      return false;
    }

    if (!DISCORD_CONFIG.BOT_TOKEN || !DISCORD_CONFIG.GUILD_ID) {
      // console.error('Faltan variables de entorno requeridas para la integración con Discord');
      return false;
    }

    // Verificar que el rol sea realmente un rol vencido de suscripción
    // const isExpiredSubscriptionRole = [
    //   process.env.DISCORD_ROLE_BASIC_MENSUAL_VENCIDO,
    //   process.env.DISCORD_ROLE_ICON_VENCIDO,
    //   process.env.DISCORD_ROLE_DIAMOND_VENCIDO,
    // ].includes(suscriptionRoleId);

    const isExistingSubscriptionRole = [
      process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL,
      process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL_THREE_COMPLETED_COURSES,
      process.env.NEXT_PUBLIC_DISCORD_ROLE_ICON,
      process.env.NEXT_PUBLIC_DISCORD_ROLE_DIAMOND,
      process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL_VENCIDO,
      process.env.NEXT_PUBLIC_DISCORD_ROLE_ICON_VENCIDO,
      process.env.NEXT_PUBLIC_DISCORD_ROLE_DIAMOND_VENCIDO,
    ].includes(suscriptionRoleId);

    if (!isExistingSubscriptionRole) {
      // console.error(`El rol ${suscriptionRoleId} no es un rol vencido de suscripción válido`);
      return false;
    }

    // console.log(
    //   `Intentando remover el rol existente de suscripción ${suscriptionRoleId} del usuario ${userDiscordId}`
    // );

    const response = await fetch(
      `https://discord.com/api/v10/guilds/${DISCORD_CONFIG.GUILD_ID}/members/${userDiscordId}/roles/${suscriptionRoleId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bot ${DISCORD_CONFIG.BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 204) {
      // console.log('Rol vencido de suscripción removido correctamente');
      return true;
    } else {
      const errorData = await response.text();
      // console.error('Error de la API de Discord:', response.status, errorData);
      return false;
    }
  } catch (error) {
    // console.error('Error removiendo rol vencido de suscripción del usuario:', error);
    return false;
  }
}
