import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConfig';
import cloudinary from '@/lib/cloudinary';
import suscriptionOrderModel from '@/models/suscriptionOrderModel';
// Orden offline
export async function POST(request: Request) {
  try {
    await connectDB();
    let {
      userId,
      suscriptionId,
      price,
      currency,
      orderTitle,
      status,
      termsAndConditions,
      firstName,
      lastName,
      phone,
      email,
      username,
      paymentMethod,
      image,
      serviceDetail,
      country,
      address,
      postalCode,
      dni,
    } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 400 });
    }

    // if (!suscriptionId) {
    //   return NextResponse.json({ message: 'Suscripción no encontrada' }, { status: 400 });
    // }

    // Validaciones de campos obligatorios según la moneda y el precio
    if (!email || !firstName || !lastName || !phone) {
      return NextResponse.json(
        {
          message:
            'Antes de realizar la compra, por favor, actualiza los campos de nombre, apellido, email y teléfono',
        },
        { status: 400 }
      );
    }

    if (currency === 'USD') {
      if (!country || !address || !postalCode || !dni) {
        return NextResponse.json(
          {
            message:
              'Antes de realizar una compra en USD, por favor, actualiza los campos de país, dirección, código postal y DNI.',
          },
          { status: 400 }
        );
      }
    }

    if (currency === 'AR' && price > 100000) {
      if (!country || !address || !postalCode || !dni) {
        return NextResponse.json(
          {
            message:
              'Antes de realizar una compra mayor a $100.000 ARS, por favor, actualiza los campos de país, dirección, código postal y DNI',
          },
          { status: 400 }
        );
      }
    }

    if (image) {
      const newImage = await cloudinary.uploader.upload(image, {
        folder: 'images',
        transformation: [
          {
            crop: 'fill',
            quality: 60,
            format: 'auto',
            strip_metadata: true,
            delivery: 'auto',
            bytes_limit: 200000,
          },
        ],
      });
      image = {
        public_id: newImage.public_id,
        url: newImage.secure_url,
      };
    }

    const newOrder = new suscriptionOrderModel({
      userId,
      suscriptionId,
      price,
      currency,
      orderTitle,
      status,
      termsAndConditions,
      firstName,
      lastName,
      email,
      phone,
      username,
      paymentMethod,
      image,
      serviceDetail,
      country,
      address,
      postalCode,
      dni,
    });

    await newOrder.save();

    return NextResponse.json(
      {
        message: 'Orden creada correctamente',
        success: true,
        suscriptionId: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Error en la creación de la orden',
      },
      { status: 500 }
    );
  }
}
