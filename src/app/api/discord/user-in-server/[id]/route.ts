import { NextRequest, NextResponse } from 'next/server';
import { isUserInGuild } from '@/lib/discord/discord';
import { connectDB } from '@/lib/dbConfig';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    if (!params.id) {
      return NextResponse.json({ error: 'No se encontró el id del usuario' }, { status: 400 });
    }
    const isMember = await isUserInGuild(params.id);

    return NextResponse.json({ isMember }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check membership' }, { status: 500 });
  }
}
