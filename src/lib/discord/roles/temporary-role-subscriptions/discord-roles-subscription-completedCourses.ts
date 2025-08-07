// // C:\Users\Ecotech\Desktop\Jeronimo Alderete\finanflix-prod-main\src\lib\discord\roles\temporary-role-subscriptions\discord-roles-subscription-completedCourses.ts

// // Archivo para manejar la secuencia de roles temporales

// import { DISCORD_CONFIG, userHasRole } from '@/lib/discord/discord';
// import {
//   getRoleIdForSubscription,
//   assignSuscriptionRoleToUser,
//   removeSubscriptionRoleFromUser,
//   removeRoleFromUser,
// } from '../roleManager';


// function getDurationInMs(subscriptionType: string): number {
//   const normalizedType = subscriptionType.toLowerCase().trim();

//   //   if (normalizedType.includes("mensual")) return 30 * 24 * 60 * 60 * 1000 // 30 días
//   //   if (normalizedType.includes("semestral")) return 90 * 24 * 60 * 60 * 1000 // 3 meses (aproximado)
//   //   if (normalizedType.includes("anual")) return 365 * 24 * 60 * 60 * 1000 // 12 meses

//   if (normalizedType.includes('mensual')) return 1 * 60 * 1000; // 1 minuto para testing
//   if (normalizedType.includes('semestral')) return 2 * 60 * 1000; // 2 minutos para testing
//   if (normalizedType.includes('anual')) return 3 * 60 * 1000; // 3 minutos para testing

//   //   return 30 * 24 * 60 * 60 * 1000; // Default: 30 días
//   return 1 * 60 * 1000; // 1 minuto para testing
// }

// const ONE_MINUTE_IN_MS = 1 * 60 * 1000; // 1 minuto en milisegundos

// // Función para obtener el ID de rol seEigún la suscripcion
// export function getRoleIdForSuscriptionWithCompletedCourses(subscriptionType: string): string | null {
//   // Normalizar el nombre de la suscripcion para manejar mayúsculas/minúsculas y espacios
//   const normalizedType = subscriptionType.trim();

//   // Mapa de tipos de suscripción normalizados a variables de entorno DISCORD_ROLE_BASIC_MENSUAL_VENCIDO
//   const subscriptionRoleMap: Record<string, string> = {
//     'Suscripcion basic - mensual': process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL_THREE_COMPLETED_COURSES || '',
//     'Suscripcion basic - semestral': process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL_THREE_COMPLETED_COURSES || '',
//     'Suscripcion basic - anual': process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL_THREE_COMPLETED_COURSES || '',
//   };

//   const expiredRoleId = subscriptionRoleMap[normalizedType];

//   // DEBUG
//   //console.log(subscriptionRoleMap);
//   //console.log(normalizedType);
//   //console.log('Found role ID:', roleId);

//   return expiredRoleId || null;
// }


// // Función para obtener el ID de rol seEigún la suscripcion
// export function getRoleIdForSuscriptionWithCompletedCoursesExpired(subscriptionType: string): string | null {
//   // Normalizar el nombre de la suscripcion para manejar mayúsculas/minúsculas y espacios
//   const normalizedType = subscriptionType.trim();

//   // Mapa de tipos de suscripción normalizados a variables de entorno DISCORD_ROLE_BASIC_MENSUAL_VENCIDO
//   const subscriptionRoleMap: Record<string, string> = {
//     'Suscripcion basic - mensual': process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL_VENCIDO || '',
//     'Suscripcion basic - semestral': process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL_VENCIDO || '',
//     'Suscripcion basic - anual': process.env.NEXT_PUBLIC_DISCORD_ROLE_BASIC_MENSUAL_VENCIDO || '',
//   };

//   const expiredRoleId = subscriptionRoleMap[normalizedType];

//   // DEBUG
//   //console.log(subscriptionRoleMap);
//   //console.log(normalizedType);
//   //console.log('Found role ID:', roleId);

//   return expiredRoleId || null;
// }

// // Función para iniciar la secuencia de roles para suscripciones
// export async function startSuscriptionSequenceCompletedCourses(
//   userId: string,
//   subscriptionType: string
// ): Promise<void> {
//   console.log(`Iniciando secuencia de roles para ${subscriptionType} para usuario ${userId}`);

//   try {
//     // Obtener el ID del rol normal de la suscripcion
//     const suscriptionRoleId = getRoleIdForSuscriptionWithCompletedCourses(subscriptionType);
//     console.log(suscriptionRoleId, 'role id');
//     console.log(subscriptionType, 'subscription type');

//     // Obtener el ID del rol vencido de la suscripcion
//     const expiredRoleId = getRoleIdForSuscriptionWithCompletedCourses(subscriptionType);

//     console.log(expiredRoleId, 'expired role id');

//     if (!suscriptionRoleId || !expiredRoleId) {
//       console.error(`No se encontraron los IDs de roles para la suscripcion ${subscriptionType}`);
//       return;
//     }

//     console.log(`Roles encontrados: normal=${suscriptionRoleId}, vencido=${expiredRoleId}`);

//     // Asignar el rol normal primero
//     const assignResult = await assignSuscriptionRoleToUser(userId, suscriptionRoleId);

//     if (!assignResult) {
//       console.error(`Error al asignar el rol normal ${suscriptionRoleId} al usuario ${userId}`);
//       return;
//     }

//     console.log(`Rol normal ${suscriptionRoleId} asignado correctamente al usuario ${userId}`);

//     // llamamos a la funcion para determinar el tiempo segun el tipo de suscripcion
//     const durationMs = getDurationInMs(subscriptionType);

//      // Obtener el ID del rol vencido de la suscripcion
//     const expiredRoleId2 = getRoleIdForSuscriptionWithCompletedCoursesExpired(subscriptionType);

//       if (!expiredRoleId2) {
//       console.error(`No se encontraron los IDs de roles para la suscripcion ${subscriptionType}`);
//       return;
//     }


//     // Programar el cambio al rol vencido después de 1 minuto
//     setTimeout(async () => {
//       try {
//         console.log(`Tiempo de expiración para ${subscriptionType}: ${durationMs} ms`);

//         // Quitar el rol normal
//         const removeResult = await removeRoleFromUser(userId, suscriptionRoleId);

//         if (removeResult) {
//           console.log(
//             `Rol normal ${suscriptionRoleId} removido correctamente del usuario ${userId}`
//           );
//         } else {
//           console.error(
//             `Error al remover el rol normal ${suscriptionRoleId} del usuario ${userId}`
//           );
//         }

//         // Asignar el rol vencido
//         // const expiredAssignResult = await assignRoleToUser(userId, expiredRoleId);
//            const expiredAssignResult = await assignSuscriptionRoleToUser(userId, expiredRoleId2);

//         if (expiredAssignResult) {
//           console.log(`Rol vencido ${expiredRoleId2} asignado correctamente al usuario ${userId}`);
//         } else {
//           console.error(`Error al asignar el rol vencido ${expiredRoleId2} al usuario ${userId}`);
//         }
//       } catch (error) {
//         console.error(`Error en el cambio de roles para usuario ${userId}:`, error);
//       }
//     }, durationMs);

//     console.log(
//       `Temporizador configurado para cambiar roles en ${ONE_MINUTE_IN_MS}ms para usuario ${userId}`
//     );
//   } catch (error) {
//     console.error(`Error al iniciar la secuencia de roles para usuario ${userId}:`, error);
//   }
// }

// // Función para procesar todos la suscripcion de un usuario y aplicar la secuencia de roles
// export async function processUserSuscriptionCompletedCourses(
//   userId: string,
//   subscriptionTypes: string[]
// ): Promise<void> {
//   console.log(`Procesando ${subscriptionTypes.length} suscripcion para el usuario ${userId}`);

//   for (const subscriptionType of subscriptionTypes) {
//     // Obtener el ID del rol vencido para esta suscripcion
//     const expiredRoleId = getRoleIdForSuscriptionWithCompletedCourses(subscriptionType);

//     if (!expiredRoleId) {
//       console.log(
//         `No se encontró ID de rol vencido para la suscripcion ${subscriptionType}, continuando con secuencia normal`
//       );
//       await startSuscriptionSequenceCompletedCourses(userId, subscriptionType);
//       continue;
//     }

//     // Verificar si el usuario ya tiene el rol vencido
//     const hasExpiredRole = await userHasRole(userId, expiredRoleId);

//     if (hasExpiredRole) {
//       console.log(
//         `El usuario ${userId} ya tiene el rol vencido ${expiredRoleId} para la suscripcion ${subscriptionType}, saltando secuencia`
//       );
//       continue;
//     }

//     console.log(`Iniciando secuencia para suscripcion: ${subscriptionType}`);
//     await startSuscriptionSequenceCompletedCourses(userId, subscriptionType);
//   }
// }

// export async function removeSubscriptionExpiredRoleCompletedCourses(
//   userId: string,
//   subscriptionType: string
// ): Promise<void> {
//   try {
//     const expiredRoleId = getRoleIdForSuscriptionWithCompletedCourses(subscriptionType);

//     if (!expiredRoleId) {
//       console.error(`No se encontró un rol vencido para la suscripción ${subscriptionType}`);
//       return;
//     }

//     console.log(`Intentando remover el rol vencido ${expiredRoleId} del usuario ${userId}`);

//     // Usar la función específica para remover roles de suscripción vencidos
//     const result = await removeSubscriptionRoleFromUser(userId, expiredRoleId);

//     if (result) {
//       console.log(`Rol vencido ${expiredRoleId} removido correctamente del usuario ${userId}`);
//       await startSuscriptionSequenceCompletedCourses(userId, subscriptionType);
//     } else {
//       console.error(`Error al remover el rol vencido ${expiredRoleId} del usuario ${userId}`);
//     }
//   } catch (error) {
//     console.error(
//       `Error al remover el rol vencido para ${subscriptionType} del usuario ${userId}:`,
//       error
//     );
//   }
// }




// // Asignar rol a usuario
// export async function assignSuscriptionCompletedCoursesRoleToUser(userId: string, suscriptionRoleId: string): Promise<boolean> {
//   try {
//     if (!suscriptionRoleId || !userId) {
//       console.error('Missing required parameters:', { userId, suscriptionRoleId });
//       return false;
//     }

//     if (!DISCORD_CONFIG.BOT_TOKEN || !DISCORD_CONFIG.GUILD_ID) {
//       console.error('Missing required environment variables for Discord integration');
//       return false;
//     }

//     console.log(`Attempting to assign role ${suscriptionRoleId} to user ${userId}`);

//     const response = await fetch(
//       `https://discord.com/api/v10/guilds/${DISCORD_CONFIG.GUILD_ID}/members/${userId}/roles/${suscriptionRoleId}`,
//       {
//         method: 'PUT',
//         headers: {
//           Authorization: `Bot ${DISCORD_CONFIG.BOT_TOKEN}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     if (response.status === 204) {
//       console.log('Role assigned successfully');
//       return true;
//     } else {
//       const errorData = await response.text();
//       console.error('Discord API error:', response.status, errorData);
//       return false;
//     }
//   } catch (error) {
//     console.error('Error asignando rol al usuario:', error);
//     return false;
//   }
// }
