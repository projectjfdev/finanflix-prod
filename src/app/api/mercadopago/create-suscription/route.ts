import { NextResponse } from 'next/server';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';

// ID DE SUSCRIPCION PARA PROBAR WEBHOOK - 9b814451b3524a71b436b1453164b410

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      // suscriptionId,
      userId,
      userEmail,
      payerEmail,
      price,
      name,
      frequencyMonths,
      currency,
      username,
      nextMonth,
    } = body;

    if (!userEmail) {
      throw new Error('El email es obligatorio.');
    }

    const autoRecurring: {
      frequency: any;
      frequency_type: string;
      transaction_amount: any;
      currency_id: string;
      start_date?: string;
      free_trial?: {
        frequency: number;
        frequency_type: string;
      };
    } = {
      frequency: frequencyMonths,
      frequency_type: 'months',
      transaction_amount: nextMonth ? 20 : price,
      currency_id: 'ARS',
    };

    if (nextMonth) {
      autoRecurring.start_date = nextMonth;
      autoRecurring.free_trial = {
        frequency: 1, // 1 unidad
        frequency_type: 'months', // Unidad es meses
      };
    }

    const suscription = await new PreApproval(mercadopago).create({
      body: {
        reason: `Suscripción Finanflix - mensualidad ${frequencyMonths} ${
          nextMonth ? ' [PRIMER MES GRATUITO]' : ''
        }`,
        // back_url: 'https://dirty-planes-wave.loca.lt',
        back_url: `${process.env.MERCADOPAGO_URL_WEBHOOK}`,
        auto_recurring: autoRecurring,
        payer_email: payerEmail,
        status: 'pending',
        external_reference: JSON.stringify({
          userId,
          userEmail,
          //  payerEmail,
          price,
          currency,
          username,
          name,
        }),
      },
    });

    return NextResponse.json({ url: suscription.init_point });
  } catch (error) {
    // console.error('Error creando la suscripción:', error);
    return NextResponse.json({ error: error || 'Error desconocido' }, { status: 500 });
  }
}
