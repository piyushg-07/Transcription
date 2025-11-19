import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { extractAudio, ensureDir, cleanupFiles } from '@/lib/ffmpeg-utils';
import { transcribeAudio, postProcessTranscription } from '@/lib/transcription';

export async function POST(request: NextRequest) {
  let tempAudioPath: string | null = null;

  try {
    const body = await request.json();
    const { filename } = body;

    if (!filename) {
      return NextResponse.json(
        { success: false, error: 'No filename provided' },
        { status: 400 }
      );
    }

    // Get video path
    const videoPath = path.join(process.cwd(), 'public', 'uploads', filename);

    // Create temp directory
    const tempDir = path.join(process.cwd(), 'tmp');
    await ensureDir(tempDir);

    // Extract audio
    tempAudioPath = path.join(tempDir, `audio-${Date.now()}.mp3`);
    console.log('Extracting audio...');
    await extractAudio(videoPath, tempAudioPath);

    // Transcribe audio
    console.log('Transcribing audio...');
    const transcription = await transcribeAudio(tempAudioPath);

    // Post-process segments
    const processedSegments = postProcessTranscription(transcription.segments);

    // Cleanup temp files
    await cleanupFiles([tempAudioPath]);

    return NextResponse.json({
      success: true,
      captions: processedSegments,
      duration: transcription.duration,
      language: transcription.language,
      words: transcription.words,
    });
  } catch (error) {
    console.error('Transcription error:', error);

    // Cleanup on error
    if (tempAudioPath) {
      await cleanupFiles([tempAudioPath]);
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Transcription failed',
      },
      { status: 500 }
    );
  }
}
