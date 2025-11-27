# YouTube Transcript API Update

## Summary

Updated the transcript extraction system to prioritize YouTube's official timedtext API as the most reliable method for fetching video transcripts.

## Changes Made

### 1. Updated Strategy Priorities

The new priority order (lower number = higher priority):

1. **YouTube Direct API** (Priority 1) - Most reliable

    - Uses official `youtube.com/api/timedtext` endpoint
    - Includes all required parameters for maximum reliability
    - Supports JSON3 format (primary) with XML fallbacks

2. **XHR Interceptor** (Priority 2)

    - Captures live network requests
    - Fast when available

3. **Invidious API** (Priority 3)

    - CORS-free alternative
    - Multiple instance fallbacks

4. **Piped API** (Priority 4)

    - Privacy-friendly frontend
    - Multiple instance fallbacks

5. **Background Proxy** (Priority 5)

    - Service worker fallback

6. **DOM Parser** (Priority 6)
    - Last resort using ytInitialPlayerResponse

### 2. Enhanced YouTube Direct Strategy

**File**: `extension/services/transcript/strategies/youtube-direct-strategy.js`

**Key Improvements**:

-   Added comprehensive URL parameter building
-   Includes all required parameters: `caps`, `kind`, `xoaf`, `xowf`, `hl`, `ip`, `ipbits`
-   Better error handling and logging
-   Prioritizes JSON3 format for structured data
-   Graceful fallback to XML formats (srv3, srv2, srv1)

**API URL Format**:

```
https://www.youtube.com/api/timedtext?v={videoId}&lang={lang}&fmt=json3&caps=asr&kind=asr&xoaf=5&xowf=1&hl={lang}&ip=0.0.0.0&ipbits=0
```

### 3. Enhanced JSON3 Parser

**File**: `extension/services/transcript/parsers/json3-parser.js`

**Improvements**:

-   Added comprehensive documentation
-   Better handling of segment arrays
-   Filters out empty segments
-   Improved text extraction from word-level segments

**JSON3 Format Structure**:

```json
{
    "events": [
        {
            "tStartMs": 120,
            "dDurationMs": 3559,
            "wWinId": 1,
            "segs": [
                { "utf8": "I'm", "acAsrConf": 0 },
                { "utf8": " about", "tOffsetMs": 160, "acAsrConf": 0 }
            ]
        }
    ]
}
```

## Testing

To test the changes:

1. Load the extension in Chrome
2. Navigate to any YouTube video with captions
3. Open the extension popup or side panel
4. Check the console for log messages showing which strategy succeeded
5. Verify transcript extraction works correctly

Expected console output:

```
[Fetcher] Trying YouTube Direct API...
[YouTube Direct] ✅ JSON3 format: 450 segments
[Fetcher] ✅ YouTube Direct API succeeded: 450 segments
```

## Benefits

1. **Higher Reliability**: Direct API is more stable than third-party proxies
2. **Better Performance**: Fewer fallback attempts needed
3. **Structured Data**: JSON3 format provides word-level timing information
4. **Official Source**: Uses YouTube's official API endpoint
5. **Future-Proof**: Less likely to break with YouTube updates

## Backward Compatibility

All existing strategies remain functional as fallbacks. The system will automatically try each strategy in priority order until one succeeds.

## Related Files

-   `extension/services/transcript/fetcher.js` - Main orchestrator
-   `extension/services/transcript/strategies/youtube-direct-strategy.js` - Updated
-   `extension/services/transcript/strategies/xhr-strategy.js` - Priority updated
-   `extension/services/transcript/strategies/invidious-strategy.js` - Priority updated
-   `extension/services/transcript/strategies/piped-strategy.js` - Priority updated
-   `extension/services/transcript/strategies/background-proxy-strategy.js` - Priority updated
-   `extension/services/transcript/strategies/dom-strategy.js` - Priority updated
-   `extension/services/transcript/parsers/json3-parser.js` - Enhanced
