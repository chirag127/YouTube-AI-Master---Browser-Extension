# Transcript Extraction Methods

This document describes all implemented transcript extraction methods in the YouTube AI Master extension.

## Overview

The extension uses a **multi-method fallback system** to ensure reliable transcript extraction across different scenarios. Methods are tried in priority order until one succeeds.

## Priority Order

1. **XHR Interceptor** (Fastest if available)
2. **Invidious API** (Primary - CORS-free, reliable)
3. **YouTube Direct API** (Direct timedtext endpoint)
4. **Background Proxy** (Service worker fallback)
5. **DOM Parser** (ytInitialPlayerResponse)

---

## Method 0: XHR Interceptor

### Description
Intercepts network requests to capture transcript data as YouTube loads it. This is the fastest method when transcripts have already been loaded by YouTube's player.

### Implementation
- File: `extension/content/transcript/xhr-interceptor.js`
- Intercepts both `XMLHttpRequest` and `fetch` API calls
- Captures `/timedtext` endpoint responses
- Stores intercepted data in memory for instant retrieval

### Advantages
- ✅ Instant retrieval (no network request needed)
- ✅ No CORS issues
- ✅ Works even when other methods fail
- ✅ Captures multiple languages automatically

### Disadvantages
- ❌ Only works if YouTube has already loaded the transcript
- ❌ Requires page injection
- ❌ Data cleared on page navigation

### Usage
```javascript
import transcriptInterceptor from './xhr-interceptor.js'

// Get intercepted transcript
const transcript = transcriptInterceptor.getTranscript(videoId, 'en')

// Check available languages
const languages = transcriptInterceptor.getAvailableLanguages(videoId)
```

---

## Method 1: Invidious API (Primary)

### Description
Uses the Invidious API, a privacy-focused YouTube frontend with a public API. This is the primary method due to its reliability and CORS-free access.

### Implementation
- File: `extension/background/service-worker.js` (handler)
- Endpoint: `https://[instance]/api/v1/videos/{videoId}`
- Multiple public instances for redundancy
- Automatic instance fallback

### Advantages
- ✅ No CORS issues (runs through service worker)
- ✅ Comprehensive video metadata
- ✅ Multiple public instances for redundancy
- ✅ Well-documented API
- ✅ Returns caption URLs directly

### Disadvantages
- ❌ Depends on third-party service availability
- ❌ May be slower than direct YouTube API
- ❌ Instance availability varies

### API Response Structure
```javascript
{
  videoId: "dQw4w9WgXcQ",
  title: "Video Title",
  author: "Channel Name",
  lengthSeconds: 213,
  viewCount: 1234567,
  captions: [
    {
      label: "English",
      language_code: "en",
      url: "https://..."
    }
  ]
}
```

### Instance Management
The extension maintains a list of working Invidious instances:
```javascript
const instances = [
  'https://inv.perditum.com',
  'https://invidious.privacyredirect.com',
  'https://invidious.fdn.fr',
  'https://iv.ggtyler.dev',
  'https://invidious.protokolla.fi'
]
```

---

## Method 2: YouTube Direct API

### Description
Direct access to YouTube's timedtext API endpoint. This is YouTube's official caption delivery system.

### Implementation
- File: `extension/content/transcript/service.js`
- Endpoint: `https://www.youtube.com/api/timedtext`
- Supports multiple formats: json3, srv3, srv2, srv1

### Query Parameters
- `v` - Video ID
- `lang` - Language code (e.g., "en", "ja", "es")
- `tlang` - Translation language code (optional)
- `fmt` - Format (json3, srv3, srv2, srv1)

### Advantages
- ✅ Official YouTube API
- ✅ Fast response times
- ✅ Multiple format support
- ✅ Supports translations

### Disadvantages
- ❌ May have CORS issues in some browsers
- ❌ Requires video ID and language code
- ❌ May be rate-limited

### Response Format (JSON3)
```javascript
{
  events: [
    {
      tStartMs: 0,        // Start time in milliseconds
      dDurationMs: 2000,  // Duration in milliseconds
      segs: [
        {
          utf8: "Text content"  // The actual subtitle text
        }
      ]
    }
  ]
}
```

### ResponseFormat (XML/SRV)
```xml
<transcript>
  <text start="0.0" dur="2.0">Text content</text>
  <text start="2.0" dur="3.5">More text</text>
</transcript>
```

---

## Method 3: Background Proxy

### Description
Routes transcript requests through the extension's service worker to bypass CORS restrictions.

### Implementation
- File: `extension/background/service-worker.js`
- Message: `FETCH_TRANSCRIPT`
- Combines multiple methods in the background

### Advantages
- ✅ Bypasses CORS restrictions
- ✅ Can use multiple backend methods
- ✅ Centralized error handling
- ✅ Can implement caching

### Disadvantages
- ❌ Requires message passing overhead
- ❌ Depends on service worker being active
- ❌ Slightly slower than direct methods

### Usage
```javascript
const response = await chrome.runtime.sendMessage({
  action: 'FETCH_TRANSCRIPT',
  videoId: 'dQw4w9WgXcQ',
  lang: 'en'
})

if (response.success) {
  const transcript = response.data
}
```

---

## Method 4: DOM Parser (ytInitialPlayerResponse)

### Description
Extracts caption track information from YouTube's player response object embedded in the page HTML.

### Implementation