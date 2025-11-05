import { NextRequest, NextResponse } from 'next/server';
import { IgApiClient } from 'instagram-private-api';
import { setIgClient, setConnectedUsername } from '@/lib/instagram-client';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const igClient = new IgApiClient();
    igClient.state.generateDevice(username);

    await igClient.account.login(username, password);

    setIgClient(igClient);
    setConnectedUsername(username);

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to Instagram',
      username: username,
    });
  } catch (error: any) {
    console.error('Instagram connection error:', error);

    if (error.message?.includes('challenge_required')) {
      return NextResponse.json(
        { error: 'Two-factor authentication detected. Please disable 2FA or verify via Instagram app first.' },
        { status: 403 }
      );
    }

    if (error.message?.includes('The password you entered is incorrect')) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to connect to Instagram' },
      { status: 500 }
    );
  }
}
