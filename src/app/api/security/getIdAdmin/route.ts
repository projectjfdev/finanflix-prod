import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }

  const userId = session.user._id.toString();
  const secretId = process.env.FINANFLIX_SECRET_ID;

  const isAdmin = userId === secretId;

  return NextResponse.json({ isAdmin });
}
