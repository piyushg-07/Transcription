# Remotion Captioning Platform

<div align="center">

## 🎥 Demo Video

<video src="https://drive.google.com/uc?export=download&id=1Znbe_XFDkcdK8y-6LkHjp61Pmmt20JSw" controls></video>

🎬 **Production-Ready Video Captioning Platform with AI Transcription**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Remotion](https://img.shields.io/badge/Remotion-4.0-blue)](https://remotion.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)](https://tailwindcss.com/)

</div>

---

## 🌟 Features

- **🎤 AI-Powered Transcription**: Automatic speech-to-text using OpenAI Whisper or AssemblyAI
- **🌐 Hinglish Support**: Perfect rendering of Hindi and English with proper font pairing (Noto Sans + Noto Sans Devanagari)
- **🎨 Style Presets**: Netflix-style, News-style, and Karaoke caption styles with animations
- **✏️ Caption Editor**: Edit captions inline with real-time preview
- **🎬 Video Rendering**: Export final MP4 with embedded captions using Remotion
- **📄 SRT Export**: Download captions in standard SRT format
- **⚡ Real-Time Preview**: See caption styles applied instantly in Remotion Player
- **🎯 Drag & Drop Upload**: Simple video upload interface
- **📱 Responsive Design**: Works on all devices

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: >= 18.0.0
- **FFmpeg**: Required for video processing
- **API Keys**: OpenAI (for Whisper) or AssemblyAI

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd remotion-captioning-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Install FFmpeg**

**Windows (PowerShell):**
```powershell
# Using Chocolatey
choco install ffmpeg

# Or download from: https://ffmpeg.org/download.html
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg  # Ubuntu/Debian
sudo yum install ffmpeg      # CentOS/RHEL
```

4. **Set up environment variables**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your API keys
```

**.env configuration:**
```env
# Choose either OpenAI or AssemblyAI
TRANSCRIPTION_SERVICE=openai

# OpenAI API Key (for Whisper)
OPENAI_API_KEY=your_openai_api_key_here

# OR AssemblyAI API Key
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here

# Application settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

5. **Create required directories**
```bash
mkdir -p public/uploads public/renders tmp output
```

6. **Run the development server**
```bash
npm run dev
```

7. **Open your browser**
```
http://localhost:3000
```

---

## 📖 Usage Guide

### 1. Upload Video
- Drag and drop an MP4 video file or click to browse
- Supported formats: MP4, MOV
- Maximum size: 500MB

### 2. Generate Captions
- Click **"Auto-Generate Captions"** button
- The system will:
  - Extract audio from video
  - Send to AI transcription service
  - Return timestamped caption segments

### 3. Edit Captions (Optional)
- Click edit button (✏️) on any caption
- Modify text directly
- Save or cancel changes

### 4. Choose Caption Style
Select from 3 presets:
- **📺 Netflix Style**: Bottom-centered with fade animation
- **📰 News Style**: Top-bar with slide animation
- **🎤 Karaoke Style**: Word-by-word highlighting

### 5. Render Final Video
- Click **"Render Video"** to create final MP4
- Download the rendered video with embedded captions

### 6. Export SRT (Optional)
- Click **"Export SRT"** to download captions as .srt file
- Use with any video player that supports subtitles

---

## 🏗️ Project Structure

```
remotion-captioning-platform/
├── app/
│   ├── api/
│   │   ├── upload/route.ts          # Video upload handler
│   │   ├── transcribe/route.ts      # AI transcription endpoint
│   │   ├── render/route.ts          # Video rendering endpoint
│   │   └── export-srt/route.ts      # SRT export endpoint
│   ├── layout.tsx                    # Root layout with fonts
│   ├── page.tsx                      # Main application page
│   └── globals.css                   # Global styles
├── components/
│   ├── VideoUploader.tsx            # Drag & drop upload UI
│   ├── VideoEditor.tsx              # Main editor component
│   ├── StyleSelector.tsx            # Caption style presets
│   └── CaptionTimeline.tsx          # Caption list & editor
├── remotion/
│   ├── index.ts                     # Remotion entry point
│   ├── Root.tsx                     # Remotion root component
│   └── compositions/
│       ├── CaptionedVideo.tsx       # Main video composition
│       └── CaptionOverlay.tsx       # Caption rendering logic
├── lib/
│   ├── caption-styles.ts            # Style preset definitions
│   ├── caption-utils.ts             # Caption processing utilities
│   ├── ffmpeg-utils.ts              # FFmpeg helpers
│   └── transcription.ts             # AI transcription logic
├── types/
│   └── index.ts                     # TypeScript type definitions
├── scripts/
│   └── render-video.js              # CLI rendering script
├── public/
│   ├── uploads/                     # Uploaded videos
│   └── renders/                     # Rendered videos
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
└── README.md
```

---

## 🎨 Caption Style Presets

### Netflix Style
- **Position**: Bottom center
- **Font Size**: 48px
- **Background**: Semi-transparent black (80%)
- **Animation**: Fade in/out
- **Use Case**: Standard subtitles for movies/series

### News Style
- **Position**: Top bar
- **Font Size**: 40px
- **Background**: Dark blue with high opacity (95%)
- **Animation**: Slide in from top
- **Use Case**: News tickers, announcements

### Karaoke Style
- **Position**: Bottom center
- **Font Size**: 56px
- **Background**: Transparent
- **Animation**: Word-by-word color highlight
- **Stroke**: 4px black outline
- **Use Case**: Sing-along videos, lyric videos

---

## 🔧 API Integration

### OpenAI Whisper API

1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Add to `.env`:
```env
TRANSCRIPTION_SERVICE=openai
OPENAI_API_KEY=sk-...
```

**Features:**
- High accuracy transcription
- Multi-language support
- Word-level timestamps
- Good for Hinglish content

**Pricing:** ~$0.006 per minute

### AssemblyAI

1. Get API key from [AssemblyAI](https://www.assemblyai.com/)
2. Add to `.env`:
```env
TRANSCRIPTION_SERVICE=assemblyai
ASSEMBLYAI_API_KEY=...
```

**Features:**
- Real-time transcription
- Speaker diarization
- Sentiment analysis
- Excellent Hindi support

**Pricing:** Free tier available, ~$0.00025 per second

---

## 🖥️ CLI Rendering (Alternative)

If you need to render videos locally without the web interface:

```bash
node scripts/render-video.js <videoPath> <captionsJson> <styleName>
```

**Example:**
```bash
node scripts/render-video.js ./video.mp4 ./captions.json netflix
```

**captions.json format:**
```json
[
  {
    "id": "1",
    "start": 0.5,
    "end": 3.2,
    "text": "Hello, यह एक test है"
  },
  {
    "id": "2",
    "start": 3.5,
    "end": 6.8,
    "text": "This is Hinglish caption"
  }
]
```

---

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Configure environment variables**
```bash
vercel env add OPENAI_API_KEY
vercel env add TRANSCRIPTION_SERVICE
```

3. **Deploy**
```bash
vercel --prod
```

**⚠️ Important Notes:**
- Vercel has a 50MB response limit
- Video rendering may timeout on serverless functions (10-60 second limit)
- For production rendering, consider:
  - Using Remotion Lambda for cloud rendering
  - Self-hosting on a VPS with proper resources
  - Using the CLI rendering script locally

### Deploy to Render

1. **Create new Web Service** on [Render](https://render.com/)
2. **Connect GitHub repository**
3. **Configure:**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Add environment variables in dashboard

4. **Upgrade to paid plan** for video rendering (requires more memory)

### Self-Hosted (Recommended for Production)

For best performance with video rendering:

```bash
# Clone repo on your VPS
git clone <your-repo>
cd remotion-captioning-platform

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
npm i -g pm2
pm2 start npm --name "captioning-platform" -- start
```

**Requirements:**
- 2GB+ RAM
- FFmpeg installed
- Node.js 18+
- Sufficient disk space for uploads/renders

---

## 🎬 Sample Video Demo

**Input Video:** `https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4`

**After Processing:**
- Auto-generated captions with Hinglish support
- Applied Netflix-style preset
- Exported with embedded captions

**Output:** Downloadable from the web interface or saved in `public/renders/`

---

## 🔥 Advanced Features

### Custom Caption Styling

Modify `lib/caption-styles.ts` to create custom presets:

```typescript
export const CAPTION_PRESETS = {
  custom: {
    preset: 'custom',
    fontSize: 60,
    fontWeight: '800',
    color: '#FFD700',
    backgroundColor: '#FF1493',
    backgroundOpacity: 0.5,
    textAlign: 'center',
    position: 'center',
    padding: 30,
    strokeWidth: 3,
    strokeColor: '#FFFFFF',
    animation: 'fade',
    maxWidth: 1400,
    lineHeight: 1.6,
  },
};
```

### Import SRT Files

Add SRT import functionality by extending `lib/caption-utils.ts`:

```typescript
// Already included parseSRT function
const captions = parseSRT(srtContent);
setCaptions(captions);
```

### Word-Level Karaoke

The karaoke preset automatically calculates word timings. For more precise control, use transcription APIs that provide word-level timestamps.

---

## 🐛 Troubleshooting

### FFmpeg not found
```bash
# Verify installation
ffmpeg -version

# Add to PATH if needed (Windows)
setx PATH "%PATH%;C:\path\to\ffmpeg\bin"
```

### Out of memory during rendering
- Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096 npm run dev`
- Use CLI rendering instead of web interface
- Reduce video resolution

### Transcription fails
- Check API key is correct
- Verify API credits/quota
- Check audio extraction succeeded
- Try alternative service (OpenAI ↔ AssemblyAI)

### Hindi text not rendering
- Ensure Noto Sans Devanagari font is loaded
- Check UTF-8 encoding in all files
- Verify font installation in Remotion composition

### Deployment timeout
- Use Remotion Lambda for serverless rendering
- Switch to VPS deployment
- Render locally using CLI script

---

## 📝 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | Yes* | OpenAI API key for Whisper | `sk-proj-...` |
| `ASSEMBLYAI_API_KEY` | Yes* | AssemblyAI API key | `abc123...` |
| `TRANSCRIPTION_SERVICE` | Yes | Which service to use | `openai` or `assemblyai` |
| `NEXT_PUBLIC_APP_URL` | No | Public URL of app | `https://yourdomain.com` |
| `NODE_ENV` | No | Environment | `development` or `production` |

*Required: Choose one of the transcription services

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - feel free to use in personal and commercial projects.

---

## 🙏 Credits

- **Next.js** - React framework
- **Remotion** - Video generation library
- **OpenAI Whisper** - Speech-to-text AI
- **AssemblyAI** - Audio intelligence platform
- **TailwindCSS** - Utility-first CSS framework
- **FFmpeg** - Video processing
- **Google Fonts** - Noto Sans font families

---

## 📞 Support

For issues, questions, or feature requests:
- Open a GitHub issue
- Check existing documentation
- Review troubleshooting section

---

<div align="center">

**Built with ❤️ for the Hinglish content creator community**

</div>
