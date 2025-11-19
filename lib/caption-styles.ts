import { CaptionStyle, CaptionStylePreset } from '@/types';

export const CAPTION_PRESETS: Record<CaptionStylePreset, CaptionStyle> = {
  netflix: {
    preset: 'netflix',
    fontSize: 48,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#000000',
    backgroundOpacity: 0.8,
    textAlign: 'center',
    position: 'bottom',
    padding: 20,
    strokeWidth: 0,
    strokeColor: '#000000',
    animation: 'fade',
    maxWidth: 1200,
    lineHeight: 1.4,
  },
  news: {
    preset: 'news',
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    backgroundColor: '#1a1a2e',
    backgroundOpacity: 0.95,
    textAlign: 'left',
    position: 'top',
    padding: 30,
    strokeWidth: 2,
    strokeColor: '#000000',
    animation: 'slide',
    maxWidth: 1600,
    lineHeight: 1.3,
  },
  karaoke: {
    preset: 'karaoke',
    fontSize: 56,
    fontWeight: '700',
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    backgroundOpacity: 0,
    textAlign: 'center',
    position: 'bottom',
    padding: 40,
    strokeWidth: 4,
    strokeColor: '#000000',
    animation: 'karaoke',
    maxWidth: 1400,
    lineHeight: 1.5,
  },
};

export const getStylePreset = (preset: CaptionStylePreset): CaptionStyle => {
  return { ...CAPTION_PRESETS[preset] };
};
