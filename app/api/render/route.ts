import { NextRequest, NextResponse } from 'next/server';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import { ensureDir, generateUniqueFilename } from '@/lib/ffmpeg-utils';
import { CaptionSegment, CaptionStyle } from '@/types';

export const maxDuration = 300; // 5 minutes max execution time

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, captions, style } = body as {
      filename: string;
      captions: CaptionSegment[];
      style: CaptionStyle;
    };

    if (!filename || !captions || !style) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Paths
    const videoPath = path.join(process.cwd(), 'public', 'uploads', filename);
    const outputDir = path.join(process.cwd(), 'public', 'renders');
    await ensureDir(outputDir);

    const outputFilename = generateUniqueFilename('rendered-video.mp4');
    const outputPath = path.join(outputDir, outputFilename);

    // Bundle Remotion
    console.log('Bundling Remotion...');
    const bundleLocation = await bundle({
      entryPoint: path.join(process.cwd(), 'remotion', 'index.ts'),
      webpackOverride: (config) => config,
    });

    // Get composition
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'CaptionedVideo',
      inputProps: {
        videoSrc: videoPath,
        captions,
        style,
      },
    });

    // Render video
    console.log('Rendering video...');
    const startTime = Date.now();

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: {
        videoSrc: videoPath,
        captions,
        style,
      },
      concurrency: 1,
      onProgress: ({ progress }) => {
        console.log(`Rendering progress: ${Math.round(progress * 100)}%`);
      },
    });

    const renderTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      outputUrl: `/renders/${outputFilename}`,
      renderTime,
    });
  } catch (error) {
    console.error('Render error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Render failed',
      },
      { status: 500 }
    );
  }
}
