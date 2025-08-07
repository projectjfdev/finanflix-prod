import { connectDB } from '@/lib/dbConfig';
import userModel from '@/models/userModel';
import { NextResponse } from 'next/server';

import moment from 'moment'; // Asegurate de tener instalada moment

export async function PUT(req: Request) {
  await connectDB();

  try {
    const users = await userModel.find({ 'suscription.type': { $exists: true } });

    for (const user of users) {
      const { suscription } = user;

      if (!suscription) continue;

      // 1. Set status to 'active'
      suscription.status = 'active';

      // 2. Calculate endDate
      const orderDate = suscription.orderDate || new Date(); // fallback si no tiene
      let endDate = new Date(orderDate);

      const type = suscription.type.toLowerCase();

      if (type.includes('mensual')) {
        endDate = moment(orderDate).add(30, 'days').toDate();
      } else if (type.includes('semestral')) {
        endDate = moment(orderDate).add(6, 'months').toDate();
      } else if (type.includes('anual')) {
        endDate = moment(orderDate).add(1, 'year').toDate();
      }

      suscription.endDate = endDate;

      await user.save();
    }

    return NextResponse.json({ message: 'Suscripciones actualizadas correctamente' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error al actualizar suscripciones' }, { status: 500 });
  }
}

// Funcion para pasar Suscripcion basic - Mensual a "mensual" en minuscula. Lo mismo con semestral y anual
// export async function PUT(req: Request) {
//   await connectDB();

//   try {
//     const users = await userModel.find({ 'suscription.type': { $exists: true } });

//     for (const user of users) {
//       const { suscription } = user;

//       if (suscription?.type) {
//         let newType = suscription.type;

//         newType = newType.replace('Mensual', 'mensual');
//         newType = newType.replace('Semestral', 'semestral');
//         newType = newType.replace('Anual', 'anual');

//         if (newType !== suscription.type) {
//           user.suscription.type = newType;
//           await user.save();
//         }
//       }
//     }

//     return NextResponse.json({ message: 'Suscripciones actualizadas correctamente' });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ message: 'Error al actualizar suscripciones' }, { status: 500 });
//   }
// }
