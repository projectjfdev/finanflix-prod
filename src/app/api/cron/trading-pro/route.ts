import Rol from '@/models/rolesModel';
import { NextResponse } from 'next/server';

export async function POST() {
  // si algun usuario que compro trading pro, su orderDate es mayor a 1 mes desde el dia de hoy
  // orderDate > 1 mes entonces q pase esto: hacer un update de su modelo rolesModel y va a cambiar el enum de 1 a 2 y el rolId va a pasar a ser otro

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const usersTradingPro = await Rol.find({
    courses: {
      $elemMatch: {
        title: 'Trading Pro',
        orderDate: { $lte: oneMonthAgo },
      },
    },
  });
  return NextResponse.json({ ok: true, usersConTPListosParaActualizar: usersTradingPro });
}
