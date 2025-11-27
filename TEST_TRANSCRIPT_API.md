# Testing the YouTube Transcript API

## Quick Test

You can test the new YouTube Direct API method directly in the browser console:

### Test 1: Direct API Call

```javascript
// Test with the video ID from your example
const videoId = "6kvsXhHUhSs";
const lang = "en";

const url = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}&fmt=json3&caps=asr&kind=asr&xoaf=5&xowf=1&hl=${lang}&ip=0.0.0.0&ipbits=0`;

fetch(url)
    .then((res) => res.json())
    .then((data) => {
        console.log("Total events:", data.events.length);
        console.log("First 3 segments:", data.events.slice(0, 3));
    })
    .catch((err) => console.error("Error:", err));
```

### Test 2: Using the Extension's Transcript Extractor

```javascript
// In the YouTube page console (after extension is loaded)
const extractor = window.transcriptExtractor;

if (extractor) {
    extractor
        .extract("6kvsXhHUhSs", { lang: "en" })
        .then((segments) => {
            console.log("Extracted segments:", segments.length);
            console.log("First segment:", segments[0]);
            console.log(
                "Sample text:",
                segments
                    .slice(0, 5)
                    .map((s) => s.text)
                    .join(" ")
            );
        })
        .catch((err) => console.error("Extraction failed:", err));
}
```

### Test 3: Check Available Languages

```javascript
// Get available caption tracks for current video
const extractor = window.transcriptExtractor;

if (extractor) {
    const languages = extractor.getAvailableLanguages();
    console.log("Available languages:", languages);
}
```

## Expected Results

### JSON3 Response Structure

```json
{
  "wireMagic": "pb3",
  "pens": [{}],
  "wsWinStyles": [...],
  "wpWinPositions": [...],
  "events": [
    {
      "tStartMs": 120,
      "dDurationMs": 3559,
      "wWinId": 1,
      "segs": [
        {"utf8": "I'm", "acAsrConf": 0},
        {"utf8": " about", "tOffsetMs": 160, "acAsrConf": 0},
        {"utf8": " to", "tOffsetMs": 320, "acAsrConf": 0}
      ]
    }
  ]
}
```

### Parsed Segment Format

```javascript
{
  start: 0.12,           // Start time in seconds
  duration: 3.559,       // Duration in seconds
  text: "I'm about to"   // Combined text from all segments
}
```

## Console Output Examples

### Successful Extraction

```
[Fetcher] Trying YouTube Direct API...
[YouTube Direct] ✅ JSON3 format: 450 segments
[Fetcher] ✅ YouTube Direct API succeeded: 450 segments
[TranscriptExtractor] ✅ 450 segments extracted
```

### Fallback Scenario

```
[Fetcher] Trying YouTube Direct API...
[YouTube Direct] JSON3 failed: Network error
[Fetcher] YouTube Direct API failed: Network error
[Fetcher] Trying XHR Interceptor...
[Fetcher] ✅ XHR Interceptor succeeded: 450 segments
```

## Troubleshooting

### Issue: "No transcript available"

-   Check if the video has captions enabled
-   Try a different language code
-   Check browser console for specific error messages

### Issue: "CORS error"

-   This shouldn't happen with the direct API
-   If it does, the extension will automatically fall back to other strategies

### Issue: "Empty segments"

-   The parser now filters empty segments automatically
-   Check if the video actually has transcript data

## Performance Benchmarks

Expected performance for the YouTube Direct API:

-   **Response Time**: 200-500ms (typical)
-   **Success Rate**: 95%+ (for videos with captions)
-   **Fallback Time**: <100ms per strategy
-   **Total Time**: Usually <1 second including fallbacks

## Video Test Cases

Test with these video IDs:

1. **Your Example**: `6kvsXhHUhSs` - Tech tutorial with auto-generated captions
2. **TED Talk**: `8S0FDjFBj8o` - Professional captions
3. **Music Video**: Various - Often has manual captions
4. **Live Stream**: Check for auto-generated captions

## Debugging Tips

Enable verbose logging:

```javascript
// In console
localStorage.setItem("debug_transcript", "true");
```

Check strategy order:

```javascript
// The strategies are sorted by priority in fetcher.js
// Lower priority number = tried first
```

Monitor network requests:

```javascript
// Open DevTools > Network tab
// Filter by "timedtext"
// You should see the API calls
```
