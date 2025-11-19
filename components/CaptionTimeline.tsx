'use client';

import { useState } from 'react';
import { CaptionSegment } from '@/types';
import { formatTimeToSRT } from '@/lib/caption-utils';

interface CaptionTimelineProps {
  captions: CaptionSegment[];
  onCaptionsChange: (captions: CaptionSegment[]) => void;
  duration: number;
}

export default function CaptionTimeline({
  captions,
  onCaptionsChange,
  duration,
}: CaptionTimelineProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleEditStart = (caption: CaptionSegment) => {
    setEditingId(caption.id);
    setEditText(caption.text);
  };

  const handleEditSave = () => {
    if (editingId) {
      const updatedCaptions = captions.map((caption) =>
        caption.id === editingId ? { ...caption, text: editText } : caption
      );
      onCaptionsChange(updatedCaptions);
      setEditingId(null);
      setEditText('');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleDelete = (id: string) => {
    const updatedCaptions = captions.filter((caption) => caption.id !== id);
    onCaptionsChange(updatedCaptions);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">Caption Timeline</h3>
        <span className="text-gray-400 text-sm">
          {captions.length} caption{captions.length !== 1 ? 's' : ''}
        </span>
      </div>

      {captions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No captions yet. Click "Auto-Generate Captions" to get started.
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {captions.map((caption, index) => (
            <div
              key={caption.id}
              className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Index */}
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-grow">
                  {/* Time */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-400 text-sm font-mono">
                      {formatTime(caption.start)} → {formatTime(caption.end)}
                    </span>
                    <span className="text-gray-500 text-xs">
                      ({(caption.end - caption.start).toFixed(1)}s)
                    </span>
                  </div>

                  {/* Text */}
                  {editingId === caption.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white resize-none focus:outline-none focus:border-blue-500"
                        rows={2}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleEditSave}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-white font-sans">{caption.text}</p>
                  )}
                </div>

                {/* Actions */}
                {editingId !== caption.id && (
                  <div className="flex-shrink-0 flex gap-2">
                    <button
                      onClick={() => handleEditStart(caption)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(caption.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
