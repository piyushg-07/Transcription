'use client';

import { useState } from 'react';
import { Player } from '@remotion/player';
import { CaptionSegment, CaptionStyle, UploadResponse } from '@/types';
import { CaptionedVideo } from '@/remotion/compositions/CaptionedVideo';
import CaptionTimeline from './CaptionTimeline';
import StyleSelector from './StyleSelector';
import axios from 'axios';

interface VideoEditorProps {
  video: UploadResponse;
  captions: CaptionSegment[];
  onCaptionsChange: (captions: CaptionSegment[]) => void;
  selectedStyle: CaptionStyle;
  onStyleChange: (style: CaptionStyle) => void;
}

export default function VideoEditor({
  video,
  captions,
  onCaptionsChange,
  selectedStyle,
  onStyleChange,
}: VideoEditorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [renderedVideoUrl, setRenderedVideoUrl] = useState<string | null>(null);

  const handleGenerateCaptions = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await axios.post('/api/transcribe', {
        filename: video.filename,
      });

      if (response.data.success) {
        onCaptionsChange(response.data.captions);
      } else {
        setError(response.data.error || 'Transcription failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transcription failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRenderVideo = async () => {
    if (captions.length === 0) {
      setError('Please generate captions first');
      return;
    }

    setIsRendering(true);
    setRenderProgress(0);
    setError(null);

    try {
      const response = await axios.post('/api/render', {
        filename: video.filename,
        captions,
        style: selectedStyle,
      });

      if (response.data.success) {
        setRenderedVideoUrl(response.data.outputUrl);
        setRenderProgress(100);
      } else {
        setError(response.data.error || 'Rendering failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rendering failed');
    } finally {
      setIsRendering(false);
    }
  };

  const handleExportSRT = async () => {
    if (captions.length === 0) {
      setError('No captions to export');
      return;
    }

    try {
      const response = await axios.post(
        '/api/export-srt',
        { captions },
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'captions.srt';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Video Player */}
      <div className="bg-gray-800/50 rounded-xl overflow-hidden">
        <div className="aspect-video bg-black">
          <Player
            component={CaptionedVideo}
            inputProps={{
              videoSrc: video.videoUrl,
              captions,
              style: selectedStyle,
            }}
            durationInFrames={Math.round(video.duration * 30)}
            fps={30}
            compositionWidth={1920}
            compositionHeight={1080}
            style={{
              width: '100%',
              height: '100%',
            }}
            controls
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleGenerateCaptions}
          disabled={isGenerating || captions.length > 0}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              Generating Captions...
            </>
          ) : (
            <>
              <span>🎤</span>
              {captions.length > 0 ? 'Captions Generated' : 'Auto-Generate Captions'}
            </>
          )}
        </button>

        {captions.length > 0 && (
          <>
            <button
              onClick={handleRenderVideo}
              disabled={isRendering}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              {isRendering ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Rendering Video...
                </>
              ) : (
                <>
                  <span>🎬</span>
                  Render Video
                </>
              )}
            </button>

            <button
              onClick={handleExportSRT}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <span>📄</span>
              Export SRT
            </button>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Render Progress */}
      {isRendering && (
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold">Rendering...</span>
            <span className="text-gray-400">{renderProgress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${renderProgress}%` }}
            />
          </div>
          <p className="text-gray-400 text-sm mt-2">
            This may take a few minutes depending on video length...
          </p>
        </div>
      )}

      {/* Rendered Video Download */}
      {renderedVideoUrl && (
        <div className="p-6 bg-green-500/10 border border-green-500 rounded-lg">
          <h3 className="text-white font-semibold mb-2">✅ Video Rendered Successfully!</h3>
          <a
            href={renderedVideoUrl}
            download
            className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
          >
            Download Rendered Video
          </a>
        </div>
      )}

      {/* Style Selector */}
      {captions.length > 0 && (
        <StyleSelector selectedStyle={selectedStyle} onStyleChange={onStyleChange} />
      )}

      {/* Caption Timeline */}
      {captions.length > 0 && (
        <CaptionTimeline
          captions={captions}
          onCaptionsChange={onCaptionsChange}
          duration={video.duration}
        />
      )}
    </div>
  );
}
