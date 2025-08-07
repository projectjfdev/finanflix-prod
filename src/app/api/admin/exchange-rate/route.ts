import { connectDB } from '@/lib/dbConfig';
import { validateAdminSession } from '@/lib/security';
import exchangeRate from '@/models/exchangeRate';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

// Solo puede haber uno
export async function POST(request: Request) {
  await connectDB();
  try {
    const { rate } = await request.json();

    const validationResponse = await validateAdminSession();
    if (validationResponse) {
      return validationResponse;
    }

    // Verifica si ya existe un tipo de cambio
    const existingRate = await exchangeRate.findOne({});
    if (existingRate) {
      return NextResponse.json(
        {
          message: 'Ya existe un tipo de cambio. No se puede crear otro.',
          success: false,
        },
        { status: 400 }
      );
    }

    const newExchangeRate = new exchangeRate({
      rate,
    });

    await newExchangeRate.save();

    return NextResponse.json(
      {
        message: 'Nuevo tipo de cambio creado',
        success: true,
        newExchangeRate,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error en la creacion' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  await connectDB();
  try {
    const rate = await exchangeRate.findOne({});

    if (!rate) {
      return NextResponse.json({ message: 'No ningún tipo de cambio creado' }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: 'Tipo de cambio encontrado',
        data: rate,
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error en la consulta' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  await connectDB();
  try {
    const { rate } = await request.json();
    const validationResponse = await validateAdminSession();
    if (validationResponse) {
      return validationResponse;
    }
    // Validar el nuevo valor de rate
    if (!rate) {
      return NextResponse.json(
        { message: 'No existe un tipo de cambio para actualizar' },
        { status: 400 }
      );
    }
    // Validar el nuevo valor de rate
    if (rate <= 0) {
      return NextResponse.json(
        { message: 'El tipo de cambio debe ser un número positivo.' },
        { status: 400 }
      );
    }
    const now = Date.now();
    // Buscar y actualizar el tipo de cambio existente
    const updatedRate = await exchangeRate.findOneAndUpdate(
      {},
      { rate, updatedAt: now },
      { new: true } // Devuelve el documento actualizado
    );

    // Si no hay un tipo de cambio, devolver un error
    if (!updatedRate) {
      return NextResponse.json(
        { message: 'No existe ningún tipo de cambio para actualizar.' },
        { status: 404 }
      );
    }
    revalidatePath(`/api/admin/exchange-rate`);
    return NextResponse.json(
      {
        message: 'Tipo de cambio actualizado exitosamente.',
        data: updatedRate,
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Error al actualizar el tipo de cambio.' },
      { status: 500 }
    );
  }
}
