import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseId, price, title, userEmail, userId, username } = body;

    if (!courseId || !price || !title || !userEmail || !userId || !username) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const notificationUrl = `${process.env.MERCADOPAGO_URL_WEBHOOK}/api/mercadopago/webhooks`;

    if (!notificationUrl) {
      throw new Error('notification_url is undefined');
    }

    try {
      new URL(notificationUrl);
    } catch (error) {
      throw new Error('Invalid notification_url format');
    }

    const preference = await new Preference(mercadopago).create({
      body: {
        items: [
          {
            id: courseId,
            title: title,
            quantity: 1,
            unit_price: price,
          },
        ],
        external_reference: courseId, // ID de referencia externa para tu sistema
        payer: {
          email: userEmail, // Correo del comprador
          name: username, // Nombre del comprador
        },
        back_urls: {
          success: `${process.env.MERCADOPAGO_URL_WEBHOOK}/payment-success`, // NO USAR LOCALHOST MP NO TOMA COMO VALIDO - URL al éxito
          failure: `${process.env.MERCADOPAGO_URL_WEBHOOK}/failure`, // NO USAR LOCALHOST MP NO TOMA COMO VALIDO - URL al fallo
          pending: `${process.env.MERCADOPAGO_URL_WEBHOOK}/pending`, // NO USAR LOCALHOST MP NO TOMA COMO VALIDO - URL al estado pendiente
        },
        auto_return: 'approved', // Retorno automático al aprobar el pago
        notification_url: `${process.env.MERCADOPAGO_URL_WEBHOOK}/api/mercadopago/webhooks`, // VA CON EL /API MERCADOPAGO/WEBHOOOKS Y PROBANDO EN PRODUCTIVO FUNCIONA
        metadata: {
          courseId,
          price,
          title,
          userEmail,
          userId,
          username,
          notificationUrl,
        },
        payment_methods: {
          excluded_payment_types: [{ id: 'ticket' }], // 🔥 Acá bloqueás RapiPago y similares
        },
      },
    });

    return NextResponse.json({ url: preference.init_point });
  } catch (error) {
    // console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Error creating payment' }, { status: 500 });
  }
}

// a95e9a8c-25f2-4af6-aed9-a700294c7526
