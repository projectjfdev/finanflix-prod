import { assignSuscriptionRoleToUser } from '@/lib/discord/roles/roleManager';

export async function assignExpiredRoleBySubscriptionType(
  userDiscordId: string,
  type: string
): Promise<void> {
  const roleEnvMap: { [key: string]: string | undefined } = {
    icon: process.env.NEXT_PUBLIC_DISCORD_ROLE_ICON_VENCIDO,
    diamond: process.env.NEXT_PUBLIC_DISCORD_ROLE_DIAMOND_VENCIDO,
    basic: process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL_VENCIDO,
  };

  // Recorremos las claves del map para encontrar si el type incluye alguna y asignar el rol correspondiente
  for (const key in roleEnvMap) {
    if (type.toLowerCase().includes(key)) {
      const expiredRoleId = roleEnvMap[key];
      if (expiredRoleId) {
        const assigned = await assignSuscriptionRoleToUser(userDiscordId, expiredRoleId);
        // console.log(`Rol expirado asignado para ${key}:`, expiredRoleId, 'Asignado:', assigned);
      }
    }
  }
}
