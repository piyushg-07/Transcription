import { NextRequest, NextResponse } from 'next/server';
import { exportToSRT } from '@/lib/caption-utils';
import { CaptionSegment } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { captions } = body as { captions: CaptionSegment[] };

    if (!captions || !Array.isArray(captions)) {
      return NextResponse.json(
        { success: false, error: 'Invalid captions data' },
        { status: 400 }
      );
    }

    const srtContent = exportToSRT(captions);

    return new NextResponse(srtContent, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'attachment; filename="captions.srt"',
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed',
      },
      { status: 500 }
    );
  }
}
