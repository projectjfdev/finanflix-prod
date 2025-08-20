import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const testData = {
      title: 'Curso de Prueba',
      priceArg: 1000,
      courseId: 'TEST123',
      email: 'tu-email@example.com', // Cambia esto por tu email real
    };

    const response = await fetch(
      `${process.env.APP_URL}/api/users/email/service-payment-confirmation-buyer`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      }
    );

    const result = await response.json();

    return NextResponse.json(result);
  } catch (error) {
    // console.error('Error in test email route:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
