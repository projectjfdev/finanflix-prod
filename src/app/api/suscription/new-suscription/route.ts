import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConfig';
import subscriptionPlanModel from '@/models/subscriptionPlanModel';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const plans = await subscriptionPlanModel.find().sort({ frequency: 1 });

    // Verificar si hay planes
    if (!plans || plans.length === 0) {
      return NextResponse.json({
        message: 'No se encontraron planes de suscripción',
        success: true,
        data: [],
      });
    }

    return NextResponse.json({
      message: 'Planes de suscripción encontrados',
      success: true,
      data: plans,
    });
  } catch (error) {
    // console.error('Error al obtener los planes:', error);

    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    let { name, price, frequency, features, frequencyType, offerMessage } = await request.json();

    //TODO: PONER VALIDACIONES
    // Validaciones
    if (!name || !price || !features || !frequencyType) {
      return NextResponse.json(
        { message: 'Todos los campos requeridos deben estar completos.' },
        { status: 400 }
      );
    }

    // Validación de precio
    // const priceRegex = /^(?!0\d)(\d+)(\.\d{1,2})?$/;
    // if (isNaN(price) || !priceRegex.test(price.toString())) {
    //   return NextResponse.json(
    //     {
    //       message:
    //         "Precio incorrecto. Se permite enteros y decimales con hasta 2 dígitos. Ej: 10.50",
    //     },
    //     { status: 400 }
    //   );
    // }

    const newSuscriptionPlan = new subscriptionPlanModel({
      name,
      price,
      frequency,
      features,
      frequencyType,
      offerMessage,
    });

    await newSuscriptionPlan.save();

    return NextResponse.json(
      {
        message: 'Plan de suscripción creado correctamente',
        success: true,
        data: newSuscriptionPlan,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Error en la creación del plan de suscripción.',
      },
      { status: 500 }
    );
  }
}
