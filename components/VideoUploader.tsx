'use client';

import { useCallback, useState } from 'react';
import { UploadResponse } from '@/types';
import axios from 'axios';

interface VideoUploaderProps {
  onUploadSuccess: (response: UploadResponse) => void;
}

export default function VideoUploader({ onUploadSuccess }: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      setError('Please upload a valid video file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });

      if (response.data.success) {
        onUploadSuccess(response.data);
      } else {
        setError(response.data.error || 'Upload failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleUpload(files[0]);
    }
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-600 bg-gray-800/50'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <h3 className="text-2xl font-semibold text-white mb-2">
            Upload Your Video
          </h3>
          <p className="text-gray-400 mb-6">
            Drag and drop your .mp4 video here, or click to browse
          </p>

          <input
            type="file"
            accept="video/mp4,video/quicktime"
            onChange={onFileSelect}
            className="hidden"
            id="video-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="video-upload"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg cursor-pointer transition-colors"
          >
            Select Video File
          </label>

          <p className="text-gray-500 text-sm mt-4">
            Supported formats: MP4, MOV • Max size: 500MB
          </p>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Uploading...</span>
              <span className="text-sm text-gray-400">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-gray-800/50 p-6 rounded-xl">
          <div className="text-3xl mb-3">🎤</div>
          <h4 className="text-white font-semibold mb-2">AI Transcription</h4>
          <p className="text-gray-400 text-sm">
            Automatic speech-to-text using OpenAI Whisper or AssemblyAI
          </p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl">
          <div className="text-3xl mb-3">🌐</div>
          <h4 className="text-white font-semibold mb-2">Hinglish Support</h4>
          <p className="text-gray-400 text-sm">
            Perfect rendering of Hindi and English with proper font pairing
          </p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl">
          <div className="text-3xl mb-3">🎨</div>
          <h4 className="text-white font-semibold mb-2">Style Presets</h4>
          <p className="text-gray-400 text-sm">
            Netflix, News, and Karaoke caption styles with custom animations
          </p>
        </div>
      </div>
    </div>
  );
}
