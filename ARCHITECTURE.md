# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │VideoUploader│  │  VideoEditor │  │StyleSelector │       │
│  └──────┬──────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                  │               │
│         └─────────────────┴──────────────────┘               │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Routes (Next.js)                      │
│  ┌─────────┐  ┌───────────┐  ┌────────┐  ┌──────────┐      │
│  │ Upload  │  │Transcribe │  │ Render │  │Export SRT│      │
│  └────┬────┘  └─────┬─────┘  └───┬────┘  └────┬─────┘      │
└───────┼────────────┼─────────────┼────────────┼─────────────┘
        │            │             │            │
        ▼            ▼             ▼            ▼
┌────────────┐  ┌─────────┐  ┌──────────┐  ┌─────────┐
│   FFmpeg   │  │Whisper/ │  │ Remotion │  │Caption  │
│   Utils    │  │Assembly │  │ Renderer │  │ Utils   │
└────────────┘  └─────────┘  └──────────┘  └─────────┘
```

## Data Flow

### 1. Video Upload Flow
```
User selects video
    ↓
FormData created with video file
    ↓
POST /api/upload
    ↓
Save to public/uploads/
    ↓
Extract metadata with FFmpeg
    ↓
Return video info (ID, URL, duration, dimensions)
```

### 2. Transcription Flow
```
User clicks "Generate Captions"
    ↓
POST /api/transcribe with filename
    ↓
Extract audio from video (FFmpeg)
    ↓
Send audio to Whisper/AssemblyAI
    ↓
Receive segments with timestamps
    ↓
Post-process for Hinglish
    ↓
Return caption array
```

### 3. Rendering Flow
```
User clicks "Render Video"
    ↓
POST /api/render with video, captions, style
    ↓
Bundle Remotion compositions
    ↓
Select CaptionedVideo composition
    ↓
Render with renderMedia()
    ↓
Generate MP4 with embedded captions
    ↓
Save to public/renders/
    ↓
Return download URL
```

## Component Hierarchy

```
App (page.tsx)
├── VideoUploader
│   └── Drag & Drop Zone
│       ├── File Input
│       ├── Upload Progress
│       └── Error Display
│
└── VideoEditor
    ├── Remotion Player
    │   └── CaptionedVideo Composition
    │       ├── Video Layer
    │       └── CaptionOverlay
    │           ├── Netflix Style
    │           ├── News Style
    │           └── Karaoke Style
    ├── Action Buttons
    ├── StyleSelector
    │   └── Preset Cards
    └── CaptionTimeline
        └── Caption Items
            ├── Edit Button
            └── Delete Button
```

## Key Technologies

### Frontend
- **Next.js 14**: App Router, Server Components
- **React 18**: Hooks, Client Components
- **TailwindCSS**: Utility-first styling
- **Remotion Player**: Real-time video preview

### Backend
- **Next.js API Routes**: RESTful endpoints
- **FFmpeg**: Video/audio processing
- **Node.js Streams**: Efficient file handling

### Video Processing
- **Remotion**: Programmatic video generation
- **@remotion/renderer**: Server-side rendering
- **@remotion/bundler**: Webpack bundling
- **@remotion/player**: Browser playback

### AI Transcription
- **OpenAI Whisper**: Speech-to-text
- **AssemblyAI**: Alternative transcription
- **Word-level timestamps**: For karaoke effect

### Typography
- **Noto Sans**: English text
- **Noto Sans Devanagari**: Hindi text
- **Google Fonts API**: Font loading

## File Upload Strategy

### Storage Locations
```
public/uploads/    → Original uploaded videos
public/renders/    → Final rendered videos
tmp/               → Temporary audio extracts
output/            → CLI render outputs
```

### Cleanup Strategy
- Auto-cleanup temp files after transcription
- Keep uploads until user session ends
- Manual cleanup for old renders
- Consider cloud storage for production

## Caption Processing Pipeline

```
Raw Transcription
    ↓
Segment Grouping (5s or 10 words)
    ↓
Timestamp Alignment
    ↓
Text Normalization
    ↓
Script Detection (Hindi/English)
    ↓
Font Assignment
    ↓
Style Application
    ↓
Animation Calculation
    ↓
Render to Video
```

## Remotion Rendering Pipeline

```
Input Props (video, captions, style)
    ↓
Bundle Webpack Entry Point
    ↓
Load Video File
    ↓
Calculate Frame Count (duration × fps)
    ↓
For Each Frame:
    ├── Calculate Current Time
    ├── Find Active Caption
    ├── Apply Style & Animation
    └── Render Caption Overlay
    ↓
Encode to H.264 MP4
    ↓
Save Output File
```

## Performance Considerations

### Upload Optimization
- Chunked upload for large files
- Client-side validation
- Progress tracking
- File size limits

### Transcription Optimization
- Audio extraction at 16kHz mono
- Compressed MP3 format
- Parallel API requests (if multiple segments)
- Caching transcription results

### Rendering Optimization
- Concurrency: 1 (avoid memory issues)
- Quality: 80 (balance size/quality)
- Pixel format: yuv420p (compatibility)
- Timeout: 5 minutes max

### Frontend Optimization
- Lazy load components
- Debounce caption edits
- Memoize style calculations
- Virtual scrolling for long caption lists

## Security Considerations

### File Upload
- Validate file type
- Limit file size (500MB)
- Sanitize filenames
- Isolated storage directory

### API Endpoints
- Rate limiting (recommended)
- Authentication (add if needed)
- Input validation
- Error message sanitization

### Environment Variables
- Never commit .env
- Use Vercel secrets
- Rotate API keys regularly
- Restrict API key permissions

## Scalability Recommendations

### For High Traffic
1. Use cloud storage (S3/R2)
2. Implement queue system (Bull/BullMQ)
3. Deploy render workers separately
4. Use Remotion Lambda for rendering
5. Add Redis caching
6. CDN for rendered videos

### Database Integration (Optional)
- Store project metadata
- Track transcription usage
- User management
- Analytics

### Monitoring
- Sentry for error tracking
- LogRocket for session replay
- Custom analytics for usage patterns
- Performance monitoring (Web Vitals)

## Future Enhancements

### Planned Features
- [ ] Multi-language support beyond Hinglish
- [ ] Custom font upload
- [ ] Advanced timeline editor (drag to adjust timing)
- [ ] Batch processing
- [ ] Video trimming/editing
- [ ] Audio normalization
- [ ] Background music overlay
- [ ] Thumbnail generation
- [ ] Social media format presets (9:16, 1:1)
- [ ] Team collaboration
- [ ] Template library
- [ ] API for programmatic access

### Technical Improvements
- [ ] WebSocket for real-time progress
- [ ] Worker threads for CPU-intensive tasks
- [ ] FFmpeg.wasm for client-side processing
- [ ] Progressive Web App (PWA)
- [ ] Offline support
- [ ] Mobile app (React Native)

## Deployment Architecture

### Development
```
localhost:3000 (Next.js dev server)
    ↓
Local filesystem for uploads/renders
    ↓
API calls to Whisper/AssemblyAI
```

### Production (Vercel - Limited)
```
Vercel Edge Network
    ↓
Next.js Serverless Functions (10-60s timeout)
    ↓
Transcription works ✓
Rendering may timeout ⚠️
```

### Production (Self-Hosted - Recommended)
```
Nginx/Caddy Reverse Proxy
    ↓
Next.js App (PM2/Docker)
    ↓
Cloud Storage (S3/R2)
    ↓
Render Queue (Optional)
```

## Error Handling Strategy

### Upload Errors
- Invalid file type → User-friendly message
- File too large → Show size limit
- Network error → Retry mechanism

### Transcription Errors
- API failure → Try alternative service
- No audio detected → Clear error message
- Rate limit → Queue for retry

### Rendering Errors
- Out of memory → Reduce quality/resolution
- FFmpeg not found → Setup instructions
- Timeout → Use CLI rendering

### User Experience
- Loading states everywhere
- Clear error messages
- Recovery suggestions
- Graceful degradation
