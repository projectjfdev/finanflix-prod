import { NextResponse } from 'next/server';

const PAYPAL_AUTH_URL = 'https://api-m.paypal.com/v1/oauth2/token';

function getPayPalCredentials() {
  const clientId = process.env.PAYPAL_CLIENT_ID_PRODUCTION;
  const clientSecret = process.env.PAYPAL_SECRET_ID_PRODUCTION;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials are missing in environment variables.');
  }

  return { clientId, clientSecret };
}

async function fetchPayPalAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(PAYPAL_AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch PayPal token: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function GET() {
  try {
    const { clientId, clientSecret } = getPayPalCredentials();
    const accessToken = await fetchPayPalAccessToken(clientId, clientSecret);

    return NextResponse.json({ accessToken });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unexpected error occurred' },
      { status: 500 }
    );
  }
}
