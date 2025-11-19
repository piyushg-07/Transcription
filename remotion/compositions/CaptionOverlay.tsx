import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { CaptionSegment, CaptionStyle } from '@/types';
import {
  hasDevanagari,
  splitByScript,
  calculateWordTimings,
  breakIntoLines,
} from '@/lib/caption-utils';

interface CaptionOverlayProps {
  caption: CaptionSegment;
  style: CaptionStyle;
  currentTime: number;
  fontFamily: string;
  fontFamilyDevanagari: string;
}

export const CaptionOverlay: React.FC<CaptionOverlayProps> = ({
  caption,
  style,
  currentTime,
  fontFamily,
  fontFamilyDevanagari,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate animation progress
  const captionDuration = caption.end - caption.start;
  const captionProgress = (currentTime - caption.start) / captionDuration;

  // Fade animation
  let opacity = 1;
  if (style.animation === 'fade') {
    const fadeInFrames = fps * 0.2; // 0.2 second fade in
    const fadeOutFrames = fps * 0.2; // 0.2 second fade out
    const captionStartFrame = caption.start * fps;
    const captionEndFrame = caption.end * fps;

    if (frame < captionStartFrame + fadeInFrames) {
      opacity = interpolate(
        frame,
        [captionStartFrame, captionStartFrame + fadeInFrames],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      );
    } else if (frame > captionEndFrame - fadeOutFrames) {
      opacity = interpolate(
        frame,
        [captionEndFrame - fadeOutFrames, captionEndFrame],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      );
    }
  }

  // Slide animation
  let translateY = 0;
  if (style.animation === 'slide') {
    const slideFrames = fps * 0.3;
    const captionStartFrame = caption.start * fps;

    if (frame < captionStartFrame + slideFrames) {
      translateY = interpolate(
        frame,
        [captionStartFrame, captionStartFrame + slideFrames],
        [50, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      );
    }
  }

  // Position styling
  const positionStyle: React.CSSProperties = {
    top: style.position === 'top' ? style.padding : undefined,
    bottom: style.position === 'bottom' ? style.padding : undefined,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent:
      style.textAlign === 'center'
        ? 'center'
        : style.textAlign === 'right'
        ? 'flex-end'
        : 'flex-start',
    alignItems: style.position === 'center' ? 'center' : 'flex-start',
  };

  // Text styling
  const textStyle: React.CSSProperties = {
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    color: style.color,
    textAlign: style.textAlign,
    lineHeight: style.lineHeight,
    maxWidth: style.maxWidth,
    padding: style.padding,
    opacity,
    transform: `translateY(${translateY}px)`,
    textShadow:
      style.strokeWidth > 0
        ? `
          -${style.strokeWidth}px -${style.strokeWidth}px 0 ${style.strokeColor},
          ${style.strokeWidth}px -${style.strokeWidth}px 0 ${style.strokeColor},
          -${style.strokeWidth}px ${style.strokeWidth}px 0 ${style.strokeColor},
          ${style.strokeWidth}px ${style.strokeWidth}px 0 ${style.strokeColor}
        `
        : undefined,
  };

  // Background styling
  const backgroundStyle: React.CSSProperties =
    style.backgroundOpacity > 0
      ? {
          backgroundColor: style.backgroundColor,
          opacity: style.backgroundOpacity,
          padding: style.padding / 2,
          borderRadius: 8,
        }
      : {};

  // Render caption with mixed fonts for Hinglish
  const renderMixedText = (text: string) => {
    const segments = splitByScript(text);

    return segments.map((segment, index) => (
      <span
        key={index}
        style={{
          fontFamily: segment.isHindi ? fontFamilyDevanagari : fontFamily,
        }}
      >
        {segment.text}
      </span>
    ));
  };

  // Karaoke animation
  const renderKaraokeText = () => {
    const words = calculateWordTimings(caption);
    const lines = breakIntoLines(caption.text);

    return lines.map((line, lineIndex) => (
      <div key={lineIndex} style={{ marginBottom: 8 }}>
        {line.split(/\s+/).map((word, wordIndex) => {
          const wordTiming = words.find((w) => w.word === word);
          const isActive =
            wordTiming &&
            currentTime >= wordTiming.start &&
            currentTime <= wordTiming.end;

          return (
            <span
              key={wordIndex}
              style={{
                color: isActive ? '#FFD700' : style.color,
                fontFamily: hasDevanagari(word) ? fontFamilyDevanagari : fontFamily,
                marginRight: 8,
                transition: 'color 0.1s ease',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    ));
  };

  return (
    <AbsoluteFill style={positionStyle}>
      <div style={backgroundStyle}>
        <div style={textStyle}>
          {style.animation === 'karaoke'
            ? renderKaraokeText()
            : renderMixedText(caption.text)}
        </div>
      </div>
    </AbsoluteFill>
  );
};
