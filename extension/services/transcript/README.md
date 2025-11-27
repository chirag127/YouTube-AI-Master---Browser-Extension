# Transcript Service

Modular transcript extraction service for YouTube videos.

## Architecture

```
transcript/
├── index.js          - Main API exports
├── constants.js      - Service constants
├── types.js          - TypeScript-style type definitions
├── errors.js         - Custom error classes
├── parser.js         - Parse ytInitialPlayerResponse
├── fetcher.js        - Fetch transcript data from API
├── selector.js       - Select best caption track
├── formatter.js      - Format transcript output
└── cache.js          - Cache transcript data
```

## Usage

```javascript
import {
    getAvailableCaptions,
    fetchTranscript,
    getTranscriptText,
    hasCaptions,
} from "./services/transcript/index.js";

// Check if captions available
if (hasCaptions()) {
    // Get available caption tracks
    const tracks = getAvailableCaptions();

    // Fetch transcript segments
    const segments = await fetchTranscript("en");

    // Get formatted text
    const text = await getTranscriptText("en", true);
}
```

## API

### `getAvailableCaptions()`

Returns array of available caption tracks.

### `fetchTranscript(languageCode?)`

Fetches and parses transcript segments.

### `getTranscriptText(languageCode?, includeTimestamps?)`

Returns formatted transcript text.

### `hasCaptions()`

Checks if captions are available.

## Data Flow

1. **Parser** extracts caption tracks from `ytInitialPlayerResponse`
2. **Selector** chooses best track based on language preference
3. **Fetcher** retrieves transcript data from YouTube API
4. **Formatter** converts segments to desired output format
5. **Cache** stores results to avoid repeated fetches
