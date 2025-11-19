'use client';

import { CaptionStyle, CaptionStylePreset } from '@/types';
import { CAPTION_PRESETS, getStylePreset } from '@/lib/caption-styles';

interface StyleSelectorProps {
  selectedStyle: CaptionStyle;
  onStyleChange: (style: CaptionStyle) => void;
}

export default function StyleSelector({
  selectedStyle,
  onStyleChange,
}: StyleSelectorProps) {
  const presets: Array<{
    id: CaptionStylePreset;
    name: string;
    description: string;
    icon: string;
  }> = [
    {
      id: 'netflix',
      name: 'Netflix Style',
      description: 'Bottom-centered subtitles with fade animation',
      icon: '📺',
    },
    {
      id: 'news',
      name: 'News Style',
      description: 'Top-bar captions with slide animation',
      icon: '📰',
    },
    {
      id: 'karaoke',
      name: 'Karaoke Style',
      description: 'Word-by-word highlighting effect',
      icon: '🎤',
    },
  ];

  const handlePresetSelect = (preset: CaptionStylePreset) => {
    onStyleChange(getStylePreset(preset));
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Caption Style Presets</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetSelect(preset.id)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedStyle.preset === preset.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
            }`}
          >
            <div className="text-3xl mb-2">{preset.icon}</div>
            <h4 className="text-white font-semibold mb-1">{preset.name}</h4>
            <p className="text-gray-400 text-sm">{preset.description}</p>
          </button>
        ))}
      </div>

      {/* Style Details */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-700/30 rounded-lg">
        <div>
          <label className="text-gray-400 text-sm">Font Size</label>
          <p className="text-white font-semibold">{selectedStyle.fontSize}px</p>
        </div>
        <div>
          <label className="text-gray-400 text-sm">Position</label>
          <p className="text-white font-semibold capitalize">{selectedStyle.position}</p>
        </div>
        <div>
          <label className="text-gray-400 text-sm">Animation</label>
          <p className="text-white font-semibold capitalize">
            {selectedStyle.animation}
          </p>
        </div>
        <div>
          <label className="text-gray-400 text-sm">Background</label>
          <p className="text-white font-semibold">
            {selectedStyle.backgroundOpacity > 0 ? 'Yes' : 'No'}
          </p>
        </div>
      </div>
    </div>
  );
}
