import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConfig';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import billingDetails from '@/models/billingDetails';

export async function POST(request: Request) {
  try {
    await connectDB();
    let { userId, firstName, lastName, email, phone, country, address, postalCode, dni } =
      await request.json();

    // Validaciones
    if (!userId) {
      return NextResponse.json(
        {
          message: 'Por favor, registrate para poder realizar pagos en nuestra plataforma',
        },
        { status: 400 }
      );
    }

    if (!firstName || !lastName) {
      return NextResponse.json(
        { message: 'El nombre y apellido son obligatorios' },
        { status: 400 }
      );
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ message: 'El email no tiene un formato válido' }, { status: 400 });
    }

    if (!/^\d{6,15}$/.test(phone.number)) {
      return NextResponse.json(
        { message: 'El número de teléfono debe tener entre 6 y 15 dígitos' },
        { status: 400 }
      );
    }

    if (postalCode && !/^\d{4,10}$/.test(postalCode)) {
      return NextResponse.json(
        { message: 'El código postal debe tener entre 4 y 10 dígitos' },
        { status: 400 }
      );
    }

    if (dni && !/^\d{6,12}$/.test(dni)) {
      return NextResponse.json(
        { message: 'El DNI debe tener entre 6 y 12 dígitos' },
        { status: 400 }
      );
    }

    const newBillingDetails = new billingDetails({
      userId,
      firstName,
      lastName,
      email,
      phone,
      country,
      address,
      postalCode,
      dni,
    });

    await newBillingDetails.save();

    return NextResponse.json(
      {
        message: 'Datos de facturación verificados.',
        success: true,
        data: newBillingDetails,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Error en la creación de los detalles de la compra',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const session = await getServerSession(authOptions);
    const currentBillingDetails = await billingDetails.findOne({
      userId: session?.user._id,
    });

    if (!currentBillingDetails)
      return NextResponse.json(
        {
          message: 'Detalles de la compra no encontrada',
        },
        {
          status: 404,
        }
      );

    // Validaciones
    if (body.email && !/\S+@\S+\.\S+/.test(body.email)) {
      return NextResponse.json({ message: 'El email no tiene un formato válido' }, { status: 400 });
    }
    if (body.phone?.countryCode && !/^\+\d{1,4}$/.test(body.phone.countryCode)) {
      return NextResponse.json(
        {
          message: 'El código de país del teléfono no tiene un formato válido',
        },
        { status: 400 }
      );
    }
    if (body.phone?.number && !/^\d{6,15}$/.test(body.phone.number)) {
      return NextResponse.json(
        { message: 'El número de teléfono debe tener entre 6 y 15 dígitos' },
        { status: 400 }
      );
    }
    if (body.postalCode && !/^\d{4,10}$/.test(body.postalCode)) {
      return NextResponse.json(
        { message: 'El código postal debe tener entre 4 y 10 dígitos' },
        { status: 400 }
      );
    }
    if (body.dni && !/^\d{6,12}$/.test(body.dni)) {
      return NextResponse.json(
        { message: 'El DNI debe tener entre 6 y 12 dígitos' },
        { status: 400 }
      );
    }

    let updatePreference = { ...body };

    const billingDetailsUpdated = await billingDetails.findByIdAndUpdate(
      currentBillingDetails._id,
      updatePreference,
      {
        new: true,
      }
    );

    if (!billingDetailsUpdated)
      return NextResponse.json(
        {
          message: 'Detalles de la compra no encontrada al momento de actualizar',
        },
        {
          status: 404,
        }
      );

    return NextResponse.json(
      {
        success: true,
        message: 'Datos de facturación verificados.',
        data: billingDetailsUpdated,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Error en la actualización',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);
  try {
    const billingDetailsUser = await billingDetails.findOne({
      userId: session?.user._id,
    });

    return NextResponse.json({
      message: 'Detalles de la compra',
      data: billingDetailsUser,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error en la consulta' }, { status: 500 });
  }
}
