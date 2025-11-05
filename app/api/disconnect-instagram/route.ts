import { NextResponse } from 'next/server';
import { setIgClient, setConnectedUsername } from '@/lib/instagram-client';

export async function POST() {
  setIgClient(null);
  setConnectedUsername(null);

  return NextResponse.json({
    success: true,
    message: 'Disconnected from Instagram',
  });
}
