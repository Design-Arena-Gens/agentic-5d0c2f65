import { NextResponse } from 'next/server';
import { getConnectedUsername } from '@/lib/instagram-client';

export async function GET() {
  const connectedUsername = getConnectedUsername();
  return NextResponse.json({
    connected: !!connectedUsername || !!(process.env.INSTAGRAM_USERNAME && process.env.INSTAGRAM_PASSWORD),
    username: connectedUsername || process.env.INSTAGRAM_USERNAME || null,
  });
}
