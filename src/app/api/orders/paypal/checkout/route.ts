import paypal from '@paypal/checkout-server-sdk';
import { NextRequest, NextResponse } from 'next/server';

const { PAYPAL_CLIENT_ID_PRODUCTION, PAYPAL_SECRET_ID_PRODUCTION } = process.env;

const environment = new paypal.core.SandboxEnvironment(
  PAYPAL_CLIENT_ID_PRODUCTION ?? '',
  PAYPAL_SECRET_ID_PRODUCTION ?? ''
);
const client = new paypal.core.PayPalHttpClient(environment);

export const POST = async (req: NextRequest) => {
  const request = new paypal.orders.OrdersCreateRequest();
  const body = await req.json();
  const { price, description } = body;

  try {
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: price.toString(),
          },
          description: description,
        },
      ],
    });

    const response = await client.execute(request);
    //   console.log(response);

    return NextResponse.json({
      id: response.result.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
};
