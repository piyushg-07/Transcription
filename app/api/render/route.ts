import { NextRequest, NextResponse } from 'next/server';
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

    // Check if running in Vercel serverless environment
    const isVercel = process.env.VERCEL === '1';
    
    if (isVercel) {
      return NextResponse.json(
        {
          success: false,
          error: 'Video rendering is not supported on Vercel due to serverless limitations. Please use the CLI rendering script locally: node scripts/render-video.js',
          message: 'Download the video and captions, then render locally using the provided CLI script.',
        },
        { status: 501 }
      );
    }

    // Only import Remotion in non-Vercel environments
    const { bundle } = await import('@remotion/bundler');
    const { renderMedia, selectComposition } = await import('@remotion/renderer');
    const path = await import('path');
    const { ensureDir, generateUniqueFilename } = await import('@/lib/ffmpeg-utils');

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
      webpackOverride: (config: any) => config,
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
      onProgress: ({ progress }: any) => {
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
