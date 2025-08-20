import { connectDB } from '@/lib/dbConfig';
import { validateAdminSession } from '@/lib/security';
import suscriptionOrderModel from '@/models/suscriptionOrderModel';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  await connectDB();

  try {
    const validationResponse = await validateAdminSession();
    if (validationResponse) {
      return validationResponse;
    }
    // Obtener los parámetros de consulta desde la URL
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    // Validar que start y end existan y sean fechas válidas
    if (!start || !end || isNaN(Date.parse(start)) || isNaN(Date.parse(end))) {
      return NextResponse.json(
        {
          message: "Los parámetros 'start' y 'end' son requeridos y deben ser fechas válidas",
        },
        { status: 400 }
      );
    }

    // Convertir los valores de los parámetros a objetos Date
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Consultar las órdenes en el rango de fechas con el estado "Pagado"
    const orders = await suscriptionOrderModel
      .find({
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .exec();

    return NextResponse.json({
      message: 'Órdenes encontradas',
      data: orders,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error en la consulta' }, { status: 500 });
  }
}
