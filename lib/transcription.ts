import OpenAI from 'openai';
import { AssemblyAI } from 'assemblyai';
import { CaptionSegment, TranscriptionResponse } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const assemblyAI = process.env.ASSEMBLYAI_API_KEY
  ? new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY })
  : null;

/**
 * Transcribe audio using OpenAI Whisper API
 */
async function transcribeWithWhisper(
  audioPath: string
): Promise<TranscriptionResponse> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  const fs = require('fs');
  const audioFile = fs.createReadStream(audioPath);

  const response = await openai.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-1',
    response_format: 'verbose_json',
    timestamp_granularities: ['segment', 'word'],
  });

  const segments: CaptionSegment[] = (response.segments || []).map((seg: any) => ({
    id: uuidv4(),
    start: seg.start,
    end: seg.end,
    text: seg.text.trim(),
  }));

  return {
    segments,
    words: response.words?.map((w: any) => ({
      word: w.word,
      start: w.start,
      end: w.end,
    })),
    duration: segments[segments.length - 1]?.end || 0,
    language: response.language,
  };
}

/**
 * Transcribe audio using AssemblyAI
 */
async function transcribeWithAssemblyAI(
  audioPath: string
): Promise<TranscriptionResponse> {
  if (!assemblyAI) {
    throw new Error('AssemblyAI API key not configured');
  }

  const transcript = await assemblyAI.transcripts.transcribe({
    audio: audioPath,
    language_code: 'hi', // Hindi/Hinglish
  });

  if (transcript.status === 'error') {
    throw new Error(`Transcription failed: ${transcript.error}`);
  }

  const segments: CaptionSegment[] = (transcript.words || []).reduce(
    (acc: CaptionSegment[], word, index, arr) => {
      // Group words into segments of ~5 seconds or ~10 words
      const lastSegment = acc[acc.length - 1];
      const wordStart = word.start / 1000; // Convert ms to seconds
      const wordEnd = word.end / 1000;

      if (
        !lastSegment ||
        wordStart - lastSegment.start > 5 ||
        lastSegment.text.split(' ').length >= 10
      ) {
        acc.push({
          id: uuidv4(),
          start: wordStart,
          end: wordEnd,
          text: word.text,
        });
      } else {
        lastSegment.end = wordEnd;
        lastSegment.text += ' ' + word.text;
      }

      return acc;
    },
    []
  );

  return {
    segments,
    words: transcript.words?.map((w) => ({
      word: w.text,
      start: w.start / 1000,
      end: w.end / 1000,
      confidence: w.confidence,
    })),
    duration: segments[segments.length - 1]?.end || 0,
    language: transcript.language_code,
  };
}

/**
 * Transcribe audio file using configured service
 */
export async function transcribeAudio(
  audioPath: string
): Promise<TranscriptionResponse> {
  const service = process.env.TRANSCRIPTION_SERVICE || 'openai';

  console.log(`Transcribing with ${service}...`);

  try {
    if (service === 'assemblyai') {
      return await transcribeWithAssemblyAI(audioPath);
    } else {
      return await transcribeWithWhisper(audioPath);
    }
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error(
      `Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Post-process transcription to improve Hinglish quality
 */
export function postProcessTranscription(
  segments: CaptionSegment[]
): CaptionSegment[] {
  return segments.map((segment) => ({
    ...segment,
    text: segment.text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/\s([.,!?;:])/g, '$1') // Remove space before punctuation
      .trim(),
  }));
}
