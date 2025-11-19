import { CaptionSegment } from '@/types';

/**
 * Check if text contains Devanagari (Hindi) characters
 */
export function hasDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

/**
 * Split text into segments based on script (English vs Hindi)
 */
export function splitByScript(text: string): Array<{ text: string; isHindi: boolean }> {
  const segments: Array<{ text: string; isHindi: boolean }> = [];
  let currentSegment = '';
  let isCurrentHindi = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isHindi = hasDevanagari(char);

    if (i === 0) {
      currentSegment = char;
      isCurrentHindi = isHindi;
    } else if (isHindi === isCurrentHindi) {
      currentSegment += char;
    } else {
      if (currentSegment.trim()) {
        segments.push({ text: currentSegment, isHindi: isCurrentHindi });
      }
      currentSegment = char;
      isCurrentHindi = isHindi;
    }
  }

  if (currentSegment.trim()) {
    segments.push({ text: currentSegment, isHindi: isCurrentHindi });
  }

  return segments;
}

/**
 * Format time in seconds to SRT format (HH:MM:SS,mmm)
 */
export function formatTimeToSRT(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')},${millis
    .toString()
    .padStart(3, '0')}`;
}

/**
 * Export captions to SRT format
 */
export function exportToSRT(captions: CaptionSegment[]): string {
  return captions
    .map((caption, index) => {
      return `${index + 1}\n${formatTimeToSRT(caption.start)} --> ${formatTimeToSRT(
        caption.end
      )}\n${caption.text}\n`;
    })
    .join('\n');
}

/**
 * Parse SRT format to caption segments
 */
export function parseSRT(srtContent: string): CaptionSegment[] {
  const segments: CaptionSegment[] = [];
  const blocks = srtContent.trim().split(/\n\s*\n/);

  blocks.forEach((block) => {
    const lines = block.split('\n');
    if (lines.length >= 3) {
      const timeLine = lines[1];
      const timeMatch = timeLine.match(
        /(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/
      );

      if (timeMatch) {
        const start =
          parseInt(timeMatch[1]) * 3600 +
          parseInt(timeMatch[2]) * 60 +
          parseInt(timeMatch[3]) +
          parseInt(timeMatch[4]) / 1000;

        const end =
          parseInt(timeMatch[5]) * 3600 +
          parseInt(timeMatch[6]) * 60 +
          parseInt(timeMatch[7]) +
          parseInt(timeMatch[8]) / 1000;

        const text = lines.slice(2).join('\n');

        segments.push({
          id: `caption-${Date.now()}-${Math.random()}`,
          start,
          end,
          text,
        });
      }
    }
  });

  return segments;
}

/**
 * Get active caption at a specific time
 */
export function getActiveCaption(
  captions: CaptionSegment[],
  currentTime: number
): CaptionSegment | null {
  return (
    captions.find(
      (caption) => currentTime >= caption.start && currentTime <= caption.end
    ) || null
  );
}

/**
 * Calculate word timing for karaoke effect
 */
export function calculateWordTimings(
  caption: CaptionSegment
): Array<{ word: string; start: number; end: number }> {
  const words = caption.text.split(/\s+/);
  const duration = caption.end - caption.start;
  const timePerWord = duration / words.length;

  return words.map((word, index) => ({
    word,
    start: caption.start + index * timePerWord,
    end: caption.start + (index + 1) * timePerWord,
  }));
}

/**
 * Sanitize text for safe rendering
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;')
    .trim();
}

/**
 * Break long caption text into multiple lines
 */
export function breakIntoLines(text: string, maxCharsPerLine: number = 42): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
      currentLine = currentLine ? currentLine + ' ' + word : word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
}
