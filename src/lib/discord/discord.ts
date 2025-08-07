// src/lib/discord.ts
// Archivo centralizado para todas las funciones relacionadas con Discord

import { connectDiscordToUser as dbConnectDiscordToUser } from '@/utils/Endpoints/userService';

// Configuración para la integración con Discord
export const DISCORD_CONFIG = {
  CLIENT_ID: process.env.DISCORD_CLIENT_ID || '',
  CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET || '',
  BOT_TOKEN: process.env.DISCORD_BOT_TOKEN || '',
  GUILD_ID: process.env.DISCORD_GUILD_ID || '',
  REDIRECT_URI: process.env.DISCORD_REDIRECT_URI || `${process.env.APP_URL}/api/discord/callback`,
};

// Verificar si un usuario está en el servidor de Discord se cambio userId por discordId
export async function isUserInGuild(discordId: string): Promise<boolean> {
  try {
    if (!DISCORD_CONFIG.BOT_TOKEN || !DISCORD_CONFIG.GUILD_ID) {
      // console.error('Missing required environment variables for Discord integration');
      return false;
    }

    const response = await fetch(
      `https://discord.com/api/v10/guilds/${DISCORD_CONFIG.GUILD_ID}/members/${discordId}`,
      {
        headers: {
          Authorization: `Bot ${DISCORD_CONFIG.BOT_TOKEN}`,
        },
      }
    );

    return response.status === 200;
  } catch (error) {
    // console.error('Error verificando si el usuario está en el servidor:', error);
    return false;
  }
}

// TODO: SE AGREGO ESTA FUNCION!!! ------------------------------------------------------------------------

export async function getDiscordUserInfo(accessToken: string) {
  try {
    const response = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      // console.error('Discord user info fetch failed:', await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    // console.error('Error fetching Discord user info:', error);
    return null;
  }
}

// Conectar Discord a usuario (wrapper para la función de la base de datos)
export async function connectDiscordToUser(userId: string, discordId: string): Promise<boolean> {
  return await dbConnectDiscordToUser(userId, discordId);
}

// Verificar si un usuario tiene un rol específico
export async function userHasRole(userId: string, roleId: string): Promise<boolean> {
  try {
    if (!DISCORD_CONFIG.BOT_TOKEN || !DISCORD_CONFIG.GUILD_ID) {
      // console.error('Missing required environment variables for Discord integration');
      return false;
    }

    const response = await fetch(
      `https://discord.com/api/v10/guilds/${DISCORD_CONFIG.GUILD_ID}/members/${userId}`,
      {
        headers: {
          Authorization: `Bot ${DISCORD_CONFIG.BOT_TOKEN}`,
        },
      }
    );

    if (response.status !== 200) {
      // console.error('Error verificando roles del usuario:', response.status);
      return false;
    }

    const userData = await response.json();

    // Verificar si el usuario tiene el rol específico
    if (userData.roles && Array.isArray(userData.roles)) {
      return userData.roles.includes(roleId);
    }

    return false;
  } catch (error) {
    // console.error('Error verificando si el usuario tiene el rol:', error);
    return false;
  }
}

// Verificar si un usuario tiene un rol específico

// TODO: SE AGREGO ESTA FUNCION!!! ------------------------------------------------------------------------

// Invitar a un usuario al servidor de Discord
export async function inviteUserToGuild(): Promise<string | null> {
  try {
    if (!DISCORD_CONFIG.BOT_TOKEN || !DISCORD_CONFIG.GUILD_ID) {
      // console.error('Missing required environment variables for Discord integration');
      return null;
    }

    // Crear una invitación al servidor
    const inviteResponse = await fetch(
      `https://discord.com/api/v10/guilds/${DISCORD_CONFIG.GUILD_ID}/invites`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bot ${DISCORD_CONFIG.BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          max_age: 86400, // Duración de la invitación en segundos (24 horas)
          max_uses: 1, // Número máximo de veces que se puede usar la invitación
          unique: true, // Para asegurar que sea una invitación única
        }),
      }
    );

    const inviteData = await inviteResponse.json();
    if (inviteResponse.status === 201) {
      // console.log(`Invitación creada: ${inviteData.url}`);
      return inviteData.url; // Retorna la URL de la invitación
    } else {
      // console.error('Error al crear invitación:', inviteResponse.status, inviteData);
      return null;
    }
  } catch (error) {
    // console.error('Error al invitar al usuario al servidor:', error);
    return null;
  }
}

// TODO: SE AGREGO ESTA FUNCION!!! ------------------------------------------------------------------------

// Asignar rol a un usuario en el servidor de Discord
export async function assignRoleToUser(discordUserId: string, roleId: string): Promise<boolean> {
  try {
    if (!DISCORD_CONFIG.BOT_TOKEN || !DISCORD_CONFIG.GUILD_ID) {
      // console.error('Missing required environment variables for Discord integration');
      return false;
    }

    // Asignar el rol al usuario
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${DISCORD_CONFIG.GUILD_ID}/members/${discordUserId}/roles/${roleId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bot ${DISCORD_CONFIG.BOT_TOKEN}`,
        },
      }
    );

    if (response.status === 200) {
      // console.log(`Rol ${roleId} asignado al usuario ${discordUserId}`);
      return true;
    } else {
      // console.error('Error al asignar rol al usuario:', response.status);
      return false;
    }
  } catch (error) {
    // console.error('Error al asignar rol al usuario:', error);
    return false;
  }
}
