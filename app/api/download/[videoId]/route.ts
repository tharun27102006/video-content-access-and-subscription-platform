import { NextResponse } from 'next/server';
import { videos } from '@/lib/videos';

type RouteContext = {
  params: Promise<{ videoId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { videoId } = await context.params;
  const video = videos.find((item) => item.id === videoId);

  if (!video) {
    return NextResponse.json({ error: 'Video not found.' }, { status: 404 });
  }

  const response = await fetch(video.source);

  if (!response.ok || !response.body) {
    return NextResponse.json({ error: 'Unable to prepare the download.' }, { status: 502 });
  }

  return new Response(response.body, {
    headers: {
      'Content-Type': response.headers.get('content-type') ?? 'video/mp4',
      'Content-Disposition': `attachment; filename="${video.fileName}"`,
      'Cache-Control': 'no-store'
    }
  });
}