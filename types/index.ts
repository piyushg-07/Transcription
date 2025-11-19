export interface CaptionSegment {
  id: string;
  start: number; // in seconds
  end: number; // in seconds
  text: string;
}

export interface CaptionWord {
  word: string;
  start: number;
  end: number;
  confidence?: number;
}

export interface TranscriptionResponse {
  segments: CaptionSegment[];
  words?: CaptionWord[];
  duration: number;
  language?: string;
}

export type CaptionStylePreset = 'netflix' | 'news' | 'karaoke';

export interface CaptionStyle {
  preset: CaptionStylePreset;
  fontSize: number;
  fontWeight: string;
  color: string;
  backgroundColor: string;
  backgroundOpacity: number;
  textAlign: 'left' | 'center' | 'right';
  position: 'top' | 'center' | 'bottom';
  padding: number;
  strokeWidth: number;
  strokeColor: string;
  animation: 'none' | 'fade' | 'slide' | 'karaoke';
  maxWidth: number;
  lineHeight: number;
}

export interface VideoProject {
  id: string;
  videoUrl: string;
  videoFile: string;
  duration: number;
  captions: CaptionSegment[];
  style: CaptionStyle;
  createdAt: Date;
  updatedAt: Date;
}

export interface RenderRequest {
  videoFile: string;
  captions: CaptionSegment[];
  style: CaptionStyle;
  outputFile: string;
}

export interface UploadResponse {
  success: boolean;
  videoId: string;
  videoUrl: string;
  duration: number;
  filename: string;
}

export interface RenderResponse {
  success: boolean;
  outputUrl: string;
  renderTime: number;
}
