import React from 'react';
import {
  AbsoluteFill,
  Video,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from 'remotion';
import { CaptionSegment, CaptionStyle } from '@/types';
import { CaptionOverlay } from './CaptionOverlay';
import { loadFont } from '@remotion/google-fonts/NotoSans';
import { loadFont as loadFontDevanagari } from '@remotion/google-fonts/NotoSansDevanagari';

// Load fonts
const { fontFamily: notoSans } = loadFont();
const { fontFamily: notoSansDevanagari } = loadFontDevanagari();

interface CaptionedVideoProps {
  videoSrc: string;
  captions: CaptionSegment[];
  style: CaptionStyle;
}

export const CaptionedVideo: React.FC<CaptionedVideoProps> = ({
  videoSrc,
  captions,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Find active caption at current time
  const activeCaption = captions.find(
    (caption) => currentTime >= caption.start && currentTime <= caption.end
  );

  return (
    <AbsoluteFill>
      {/* Video Layer */}
      <Video src={videoSrc} />

      {/* Caption Overlay */}
      {activeCaption && (
        <CaptionOverlay
          caption={activeCaption}
          style={style}
          currentTime={currentTime}
          fontFamily={notoSans}
          fontFamilyDevanagari={notoSansDevanagari}
        />
      )}
    </AbsoluteFill>
  );
};
