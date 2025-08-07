// C:\Users\Ecotech\Desktop\Jeronimo Alderete\finanflix-prod-main\src\utils\Endpoints\userService.ts

import { connectDB } from '@/lib/dbConfig';
import userModel from '@/models/userModel';

// Guarda el ID de Discord del usuario
// export async function connectDiscordToUser(userId: string, discordId: string): Promise<boolean> {
//   try {
//     await connectDB(); // Solo nos aseguramos de que Mongoose esté conectado

//     const result = await userModel.updateOne(
//       { _id: userId },
//       {
//         $set: {
//           discordId: discordId, // el id es fundamental para asignar roles y verificar si el usuario se encuentra en el server de discord
//           discordConnected: true, // propiedad para dejar asentado en la bd que se conecto a discord
//           discordConnectedAt: new Date(), // Esta propiedad es útil para saber cuándo se realizó la conexión a discord
//         },
//       }
//     );
//     console.log(result);

//     return result.modifiedCount > 0;
//   } catch (error) {
//     console.error('Error conectando Discord al usuario:', error);
//     return false;
//   }
// }

export async function connectDiscordToUser(userId: string, discordId: string): Promise<boolean> {
  try {
    await connectDB(); // Solo nos aseguramos de que Mongoose esté conectado

    // console.log('Connecting Discord to user:', { userId, discordId });

    const result = await userModel.updateOne(
      { _id: userId },
      {
        $set: {
          discordId: discordId,
          discordConnected: true,
          discordConnectedAt: new Date(),
        },
      }
    );

    // console.log('MongoDB update result:', JSON.stringify(result, null, 2));

    return result.modifiedCount > 0;
  } catch (error) {
    // console.error('Error conectando Discord al usuario:', error);
    return false;
  }
}

// Obtiene el ID de Discord de un usuario
export async function getDiscordIdForUser(userId: string): Promise<string | null> {
  try {
    await connectDB();

    const user = await userModel.findById(userId);
    console.log('Obteniendo ID de Discord para el usuario:', userId, '->', user?.discordId);

    return user?.discordId || null;
  } catch (error) {
    // console.error('Error obteniendo ID de Discord del usuario:', error);
    return null;
  }
}
