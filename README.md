# YouTube AI Master

Free YouTube extension using Google Gemini AI for video summarization, segment classification, and interactive chat. A powerful open-source alternative to paid tools.

## Features

-   **AI Summaries**: Instant video overviews in 3 lengths (Short/Medium/Detailed)
-   **Smart Segments**: Auto-classify sponsors, intros, highlights, promotions
-   **Auto-Skip**: Skip sponsors/intros automatically with visual notifications
-   **Multilingual**: Summarize in 40+ languages
-   **Interactive Chat**: Ask questions about video content
-   **FAQ Generation**: Auto-generate FAQs from videos
-   **Transcript Export**: Clean, clickable transcripts with timestamps
-   **Comment Analysis**: Sentiment analysis of top comments
-   **History**: Save and search analyzed videos

## Installation

### Quick Start

1. Clone repository: `git clone https://github.com/yourusername/youtube-ai-master.git`
2. Open Chrome → `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" → Select `extension` folder
5. Get free Gemini API key from [Google AI Studio](https://ai.google.dev/)
6. Open extension options → Paste API key

### Requirements

-   Chrome/Edge browser
-   Free Gemini API key (no credit card required)

## Usage

1. Navigate to any YouTube video
2. Widget appears in sidebar automatically
3. Click "Analyze Video" or enable auto-analysis in settings
4. Switch tabs: Summary | Transcript | Segments | Comments
5. Click timestamps to jump to specific moments

### Keyboard Shortcuts

-   `Ctrl+Enter` - Send chat message
-   `Ctrl+K` - Focus chat input
-   `Ctrl+R` - Reanalyze video
-   `Esc` - Clear input

## Architecture

```
extension/
├── manifest.json          # Extension config
├── background/            # Service worker (API calls, processing)
├── content/               # YouTube page integration
│   ├── core/              # State management, video detection
│   ├── transcript/        # Multi-method transcript extraction
│   ├── ui/                # Widget components and renderers
│   └── utils/             # Time formatting, DOM helpers
├── services/              # Business logic
│   ├── gemini/            # AI service (API, models, streaming)
│   ├── segments/          # Segment classification
│   ├── storage/           # History management
│   └── chunking/          # Text processing
├── options/               # Settings page
├── popup/                 # Quick access popup
├── sidepanel/             # Alternative UI
└── history/               # Analysis history viewer
```

### Transcript Extraction

Multi-method fallback system:

1. **Invidious API** - Privacy-focused, CORS-free
2. **YouTube Direct API** - Official captions
3. **DOM Parsing** - ytInitialPlayerResponse fallback

### AI Models

Supports latest Gemini models:

-   `gemini-2.5-pro` - Most powerful
-   `gemini-2.0-flash` - Fast & capable
-   `gemini-2.5-flash-lite` - Lightweight
-   `gemini-1.5-pro` - Balanced
-   `gemini-1.5-flash` - Quick responses

## Development

```bash
# Install dependencies
npm install

# Lint code
npx biome check extension

# Load extension
# Chrome → chrome://extensions/ → Load unpacked → extension/
```

## Configuration

### Settings (chrome://extensions → YouTube AI Master → Options)

-   **API Key**: Your Gemini API key
-   **Model**: AI model selection
-   **Summary Length**: Short/Medium/Detailed
-   **Output Language**: 40+ languages
-   **Auto-Analysis**: Analyze videos on page load
-   **Auto-Skip**: Skip sponsors/intros automatically
-   **Save History**: Store analysis results

### API Limits (Free Tier)

-   15 requests/minute
-   1500 requests/day
-   1M token context window

## Troubleshooting

| Issue                     | Solution                                   |
| ------------------------- | ------------------------------------------ |
| "No captions found"       | Video lacks captions - try another video   |
| "API Key not configured"  | Add Gemini API key in options              |
| Widget not appearing      | Refresh page, check you're on `/watch` URL |
| Rate limiting (429)       | Wait 1 minute, reduce analysis frequency   |
| Service worker terminated | Extension auto-recovers, refresh if needed |

## Privacy

-   **100% Client-Side**: All processing in your browser
-   **No Tracking**: Zero analytics or telemetry
-   **Local Storage**: API key stored locally only
-   **No Third-Party**: Only connects to YouTube & Gemini API
-   **Open Source**: Audit the code yourself

## Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push branch: `git push origin feature-name`
5. Open Pull Request

## License

MIT License - Free forever, no restrictions

## Credits

-   **Google Gemini AI** - Powerful language models
-   **marked.js** - Markdown rendering
-   **Invidious** - Privacy-focused YouTube API

---

**Made with ❤️ for the YouTube learning community**

[Report Bug](https://github.com/yourusername/youtube-ai-master/issues) • [Request Feature](https://github.com/yourusername/youtube-ai-master/issues) • [Discussions](https://github.com/yourusername/youtube-ai-master/discussions)
