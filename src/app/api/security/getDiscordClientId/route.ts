import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;
  const scope = encodeURIComponent('identify guilds.join');
  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: 'Missing configuration' }, { status: 500 });
  }
  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;
  return NextResponse.json({ inviteUrl });
}
