# YouTube AI Navigator

AI-powered YouTube analysis extension. Transcripts, insights, segments, comments analysis - all private, zero-config.

## Features

-   **AI Analysis**: Gemini-powered summaries, insights, FAQ
-   **Smart Transcripts**: Multi-strategy fetching (DOM, Invidious, Genius, Speech-to-Text)
-   **Segment Classification**: Auto-detect sponsors, intros, content sections
-   **Comment Analysis**: Sentiment analysis, key themes
-   **DeArrow Integration**: Community-sourced clickbait-free titles
-   **SponsorBlock**: Skip/speed through segments
-   **Privacy-First**: All processing client-side, no tracking

## Quick Start

```bash
npm install
```

Load `extension/` folder in Chrome as unpacked extension.

## Configuration

1. Click extension icon → Options
2. Add Gemini API key (free at ai.google.dev)
3. Configure transcript methods, segments, UI preferences

## Architecture

### Ultra-Compressed Design

-   **Shortcuts**: All common operations use 1-2 letter aliases (`l`=log, `$`=querySelector, `sg`=storage.get)
-   **Minimal Tokens**: Stripped comments, compressed keys, dense ES6+ syntax
-   **Modular**: Maximum files, minimum tokens per file

### Key Files

-   `utils/shortcuts.js` - 70+ ultra-short utility aliases
-   `utils/config.js` - Compressed config with short keys (ca, tr, co, md, ui, ai, etc.)
-   `services/transcript/fetcher.js` - Priority-based transcript strategies
-   `api/gemini.js` - Gemini API client with fallback models
-   `api/invidious.js` - Privacy-friendly YouTube API

### Storage Keys (Compressed)

-   `cfg` - Main config object
-   `obDone` - Onboarding completed
-   `apiKey` - Gemini API key

### Default Model

`gemini-2.5-flash-lite-preview-09-2025` - Fastest, most efficient Gemini model

## Transcript Strategies (Priority Order)

1. **DOM Automation** - Automates YouTube UI to extract captions
2. **Invidious API** - Privacy-friendly YouTube frontend
3. **Genius Lyrics** - Music videos only
4. **Speech-to-Text** - Gemini audio transcription fallback

## APIs Used

| Service      | Purpose                    | Key Required |
| ------------ | -------------------------- | ------------ |
| Gemini       | AI analysis, transcription | ✅ Required  |
| Invidious    | Transcripts, metadata      | ⚫ No key    |
| Genius       | Lyrics for music videos    | ⚫ No key    |
| SponsorBlock | Segment database           | ⚫ No key    |
| DeArrow      | Clickbait-free titles      | ⚫ No key    |
| TMDB         | Movie/TV metadata          | ⚪ Optional  |
| NewsData     | News context               | ⚪ Optional  |

## Development

### File Structure

```
extension/
├── api/           # External API clients (compressed)
├── background/    # Service worker, message handlers
├── content/       # Content scripts, UI injection
├── services/      # Core services (transcript, segments, storage)
├── utils/         # Shortcuts, config, helpers
├── options/       # Settings UI
├── sidepanel/     # Analysis panel
└── manifest.json
```

### Shortcuts Usage

```js
import { l, w, e, $, $$, sg, ss, ft, js, jp } from "./utils/shortcuts.js";

l("Log message"); // console.log
w("Warning"); // console.warn
const el = $(".selector"); // querySelector
const all = $$(".items"); // querySelectorAll
const cfg = await sg("cfg"); // storage.sync.get
await ss("key", val); // storage.sync.set
const data = await ft(url); // fetch with timeout
const str = js(obj); // JSON.stringify
const obj = jp(str); // JSON.parse
```

## License

MIT - See LICENSE file

## Credits

Built with Gemini AI, Invidious, SponsorBlock, DeArrow, and other open-source projects.
