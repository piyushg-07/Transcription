import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

/**
 * Get video metadata using FFmpeg
 */
export async function getVideoMetadata(videoPath: string): Promise<{
  duration: number;
  width: number;
  height: number;
  fps: number;
}> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const videoStream = metadata.streams.find((s) => s.codec_type === 'video');
      if (!videoStream) {
        reject(new Error('No video stream found'));
        return;
      }

      const duration = metadata.format.duration || 0;
      const width = videoStream.width || 1920;
      const height = videoStream.height || 1080;
      const fps = eval(videoStream.r_frame_rate || '30/1');

      resolve({ duration, width, height, fps });
    });
  });
}

/**
 * Extract audio from video
 */
export async function extractAudio(
  videoPath: string,
  outputPath: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .audioBitrate('128k')
      .audioChannels(1)
      .audioFrequency(16000)
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .run();
  });
}

/**
 * Check if FFmpeg is installed
 */
export async function checkFFmpegInstalled(): Promise<boolean> {
  try {
    await execAsync('ffmpeg -version');
    return true;
  } catch {
    return false;
  }
}

/**
 * Convert video to a standard format if needed
 */
export async function normalizeVideo(
  inputPath: string,
  outputPath: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .format('mp4')
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .run();
  });
}

/**
 * Get file size in MB
 */
export async function getFileSizeMB(filePath: string): Promise<number> {
  const stats = await fs.stat(filePath);
  return stats.size / (1024 * 1024);
}

/**
 * Ensure directory exists
 */
export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Clean up temporary files
 */
export async function cleanupFiles(filePaths: string[]): Promise<void> {
  await Promise.all(
    filePaths.map(async (filePath) => {
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error(`Failed to delete ${filePath}:`, err);
      }
    })
  );
}

/**
 * Generate unique filename
 */
export function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${name}-${timestamp}-${random}${ext}`;
}
