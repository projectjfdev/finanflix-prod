import { NextResponse } from 'next/server';
import { createProduct } from '@/lib/Paypal';

export async function POST(req: Request) {
  const formData = await req.formData();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  const product = {
    name,
    description,
    type: 'SERVICE',
    category: 'SOFTWARE',
  };

  try {
    const data = await createProduct(product);

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
