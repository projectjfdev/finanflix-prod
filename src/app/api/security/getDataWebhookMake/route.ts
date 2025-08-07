import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { newData } = await req.json();

  if (!newData) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
  }

  const webhookRes = await fetch(`${process.env.WEBHOOK_MAKE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  });

  if (!webhookRes.ok) {
    // console.error('Error enviando a Make:', await webhookRes.text());
    return NextResponse.json({ error: 'Error al enviar a Make' }, { status: 500 });
  }

  return NextResponse.json({ newData });
}
