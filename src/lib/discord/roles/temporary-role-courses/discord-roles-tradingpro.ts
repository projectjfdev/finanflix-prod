// src/lib/discord-roles.ts
// Archivo para manejar la secuencia de roles temporales
import { assignRoleToUser, removeRoleFromUser } from '../roleManager';

// Roles para Trading Pro
const TRADING_PRO_FIRST_ROLE = process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO || '';
const TRADING_PRO_SECOND_ROLE = process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO_SEGUNDO_ROL || '';
const TRADING_PRO_VENCIDO = process.env.NEXT_PUBLIC_DISCORD_ROLE_TRADING_PRO_VENCIDO || '';

const ONE_MINUTE_IN_MS = 1 * 60 * 1000; // 1 minuto en milisegundos
const ONE_MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000; // 1 mes en milisegundos
const THREE_MONTHS_IN_MS = 3 * 30 * 24 * 60 * 60 * 1000; // 3 meses en milisegundos (aproximadamente 90 días)

// Función para iniciar la secuencia de roles para Trading Pro
export async function startTradingProSequence(userId: string): Promise<void> {
  // console.log(`Iniciando secuencia de roles para Trading Pro para usuario ${userId}`);

  try {
    // Paso 1: Asignar el primer rol
    // console.log(`Asignando primer rol ${TRADING_PRO_FIRST_ROLE} al usuario ${userId}`);
    await assignRoleToUser(userId, TRADING_PRO_FIRST_ROLE);

    // Programar el cambio al segundo rol después de 1 mes
    setTimeout(async () => {
      try {
        // Quitar el primer rol
        // console.log(`Removiendo primer rol ${TRADING_PRO_SECOND_ROLE} al usuario ${userId}`);
        await removeRoleFromUser(userId, TRADING_PRO_FIRST_ROLE);

        // Asignar el segundo rol
        // console.log(`Asignando segundo rol ${TRADING_PRO_SECOND_ROLE} al usuario ${userId}`);
        await assignRoleToUser(userId, TRADING_PRO_SECOND_ROLE);

        // Programar la eliminación del segundo rol después de 3 meses
        setTimeout(async () => {
          try {
            // Quitar el segundo rol
            await removeRoleFromUser(userId, TRADING_PRO_SECOND_ROLE);
            // console.log(`Eliminando segundo rol de Trading Pro ${TRADING_PRO_SECOND_ROLE} del usuario ${userId}`);
            // Agregar el rol vencido
            await assignRoleToUser(userId, TRADING_PRO_VENCIDO);
            // console.log(`Se agrego el rol vencido de Trading Pro para usuario ${userId}`);
          } catch (error) {
            console.error(`Error al eliminar el segundo rol para usuario ${userId}:`, error);
          }
        }, ONE_MINUTE_IN_MS); // 3 meses
      } catch (error) {
        console.error(`Error en el cambio de roles para usuario ${userId}:`, error);
      }
    }, ONE_MINUTE_IN_MS);

    // 1 minuto
  } catch (error) {
    console.error(`Error al iniciar la secuencia de roles para usuario ${userId}:`, error);
  }
}
