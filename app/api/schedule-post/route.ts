import { NextRequest, NextResponse } from 'next/server';

interface ScheduledPost {
  id: string;
  prompt: string;
  caption: string;
  scheduledTime: string;
  status: 'pending' | 'completed' | 'failed';
}

const scheduledPosts: ScheduledPost[] = [];

export async function POST(request: NextRequest) {
  try {
    const { prompt, caption, scheduledTime } = await request.json();

    if (!prompt || !scheduledTime) {
      return NextResponse.json(
        { error: 'Prompt and scheduled time are required' },
        { status: 400 }
      );
    }

    const scheduledDate = new Date(scheduledTime);
    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        { error: 'Scheduled time must be in the future' },
        { status: 400 }
      );
    }

    const post: ScheduledPost = {
      id: Date.now().toString(),
      prompt,
      caption: caption || '',
      scheduledTime,
      status: 'pending',
    };

    scheduledPosts.push(post);

    setTimeout(async () => {
      await executeScheduledPost(post);
    }, scheduledDate.getTime() - Date.now());

    return NextResponse.json({
      success: true,
      post,
      message: 'Post scheduled successfully',
    });
  } catch (error: any) {
    console.error('Scheduling error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to schedule post' },
      { status: 500 }
    );
  }
}

async function executeScheduledPost(post: ScheduledPost) {
  try {
    const videoResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/generate-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: post.prompt }),
    });

    if (!videoResponse.ok) throw new Error('Failed to generate video');

    const { videoUrl } = await videoResponse.json();

    const postResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/post-to-instagram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoUrl, caption: post.caption }),
    });

    if (!postResponse.ok) throw new Error('Failed to post to Instagram');

    post.status = 'completed';
  } catch (error) {
    console.error('Failed to execute scheduled post:', error);
    post.status = 'failed';
  }
}
