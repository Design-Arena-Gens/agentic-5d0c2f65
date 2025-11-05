import { NextRequest, NextResponse } from 'next/server';
import { IgApiClient } from 'instagram-private-api';
import axios from 'axios';
import { getIgClient, setIgClient } from '@/lib/instagram-client';

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const { videoUrl, caption = '' } = await request.json();

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    if (!process.env.INSTAGRAM_USERNAME || !process.env.INSTAGRAM_PASSWORD) {
      return NextResponse.json(
        { error: 'Instagram credentials not configured' },
        { status: 500 }
      );
    }

    let igClient = getIgClient();
    if (!igClient) {
      igClient = new IgApiClient();
      igClient.state.generateDevice(process.env.INSTAGRAM_USERNAME);
      await igClient.account.login(
        process.env.INSTAGRAM_USERNAME,
        process.env.INSTAGRAM_PASSWORD
      );
      setIgClient(igClient);
    }

    const videoResponse = await axios.get(videoUrl, {
      responseType: 'arraybuffer',
    });
    const videoBuffer = Buffer.from(videoResponse.data);

    const publishResult = await igClient.publish.video({
      video: videoBuffer,
      coverImage: videoBuffer,
      caption: caption,
    });

    return NextResponse.json({
      success: true,
      postId: publishResult.media.id,
      message: 'Video posted successfully to Instagram',
    });
  } catch (error: any) {
    console.error('Instagram posting error:', error);

    if (error.message?.includes('challenge_required') ||
        error.message?.includes('consent_required')) {
      return NextResponse.json(
        { error: 'Instagram requires verification. Please login manually first.' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to post to Instagram' },
      { status: 500 }
    );
  }
}
