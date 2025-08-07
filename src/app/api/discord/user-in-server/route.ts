// C:\Users\jeroa\Desktop\JeroAlderete\1 - Finanflix\finanflix-prod-dev\src\app\api\discord\user-in-server\route.ts

import { NextRequest, NextResponse } from 'next/server';
import { isUserInGuild } from '@/lib/discord/discord';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/dbConfig';

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const discordId = session.user.discordId; // Este debería ser el ID de Discord
    console.log('session.user.discordId', discordId);

    const discordIdpreg = session?.user?.discordId; // Este debería ser el ID de Discord
    console.log('session?.user?.discordId', discordIdpreg);

    if (!discordId) {
      return NextResponse.json({ error: 'Discord ID is missing' }, { status: 400 });
    }
    const isMember = await isUserInGuild(discordId);
    console.log('isMember', isMember);
    return NextResponse.json({ isMember }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check membership' }, { status: 500 });
  }
}
