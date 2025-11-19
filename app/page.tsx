'use client';

import { useState } from 'react';
import VideoUploader from '@/components/VideoUploader';
import VideoEditor from '@/components/VideoEditor';
import { CaptionSegment, CaptionStyle, UploadResponse } from '@/types';
import { getStylePreset } from '@/lib/caption-styles';

export default function Home() {
  const [uploadedVideo, setUploadedVideo] = useState<UploadResponse | null>(null);
  const [captions, setCaptions] = useState<CaptionSegment[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<CaptionStyle>(
    getStylePreset('netflix')
  );

  const handleUploadSuccess = (response: UploadResponse) => {
    setUploadedVideo(response);
    setCaptions([]);
  };

  const handleReset = () => {
    setUploadedVideo(null);
    setCaptions([]);
    setSelectedStyle(getStylePreset('netflix'));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                🎬 Remotion Captioning Platform
              </h1>
              <p className="text-gray-400 mt-1">
                AI-powered video captioning with Hinglish support
              </p>
            </div>
            {uploadedVideo && (
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                New Video
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!uploadedVideo ? (
          <VideoUploader onUploadSuccess={handleUploadSuccess} />
        ) : (
          <VideoEditor
            video={uploadedVideo}
            captions={captions}
            onCaptionsChange={setCaptions}
            selectedStyle={selectedStyle}
            onStyleChange={setSelectedStyle}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-900/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>
            Built with Next.js, Remotion, and AI transcription • Supports Hinglish
            (Hindi + English)
          </p>
        </div>
      </footer>
    </main>
  );
}
