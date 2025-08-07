import { removeSubscriptionRoleFromUser } from "./roleManager";

const subscriptionRoles = {
  basic: process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL_VENCIDO,
  diamond: process.env.NEXT_PUBLIC_DISCORD_ROLE_DIAMOND_VENCIDO,
  icon: process.env.NEXT_PUBLIC_DISCORD_ROLE_ICON_VENCIDO,
};

type SubscriptionType = 'basic' | 'diamond' | 'icon';

export async function removeExpiredSubscriptionRoles(userDiscordId: string, type: string): Promise<boolean> {
  const loweredType = type.toLowerCase();

  const rolesToRemove: string[] = [];

  // Siempre quitamos todos los roles vencidos para asegurar limpieza
  if (subscriptionRoles.basic) rolesToRemove.push(subscriptionRoles.basic);
  if (subscriptionRoles.diamond) rolesToRemove.push(subscriptionRoles.diamond);
  if (subscriptionRoles.icon) rolesToRemove.push(subscriptionRoles.icon);

  let atLeastOneRemoved = false;

  for (const roleId of rolesToRemove) {
    try {
      const removed = await removeSubscriptionRoleFromUser(userDiscordId, roleId);

      console.log(`🧹 Subscription role removed (${roleId})?`, removed);

      if (removed) {
        atLeastOneRemoved = true;
      }
    } catch (error) {
      console.error(`❌ Error removing role ${roleId}:`, error);
    }
  }

  return atLeastOneRemoved;
}

