import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  ensureDir,
  getVideoMetadata,
  generateUniqueFilename,
} from '@/lib/ffmpeg-utils';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No video file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      return NextResponse.json(
        { success: false, error: 'File must be a video' },
        { status: 400 }
      );
    }

    // Create upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await ensureDir(uploadDir);

    // Generate unique filename
    const videoId = uuidv4();
    const filename = generateUniqueFilename(file.name);
    const filePath = path.join(uploadDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Get video metadata
    const metadata = await getVideoMetadata(filePath);

    // Return response
    return NextResponse.json({
      success: true,
      videoId,
      videoUrl: `/uploads/${filename}`,
      filename,
      duration: metadata.duration,
      width: metadata.width,
      height: metadata.height,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      },
      { status: 500 }
    );
  }
}
