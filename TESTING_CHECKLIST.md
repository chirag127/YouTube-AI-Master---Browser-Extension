# Testing Checklist: Metadata Integration

## Pre-Testing Setup

-   [ ] Extension loaded in Chrome
-   [ ] Gemini API key configured
-   [ ] Developer console open for logs
-   [ ] Test YouTube videos ready

## Test Videos to Use

### Recommended Test Cases

1. **Tutorial Video** - Clear title/description (e.g., "How to Build X")
2. **Vlog** - Personal content with detailed description
3. **Music Video** - Minimal description
4. **Educational** - Academic content with keywords
5. **Short Video** - < 5 minutes
6. **Long Video** - > 30 minutes
7. **Non-English** - Different language captions

## Functional Tests

### 1. Metadata Extraction

-   [ ] Title extracted correctly
-   [ ] Description extracted (check if auto-expanded)
-   [ ] Author/channel name extracted
-   [ ] View count extracted
-   [ ] Keywords extracted (if available)
-   [ ] Category extracted (if available)
-   [ ] Duration extracted
-   [ ] Publish date extracted (if available)

**How to Test:**

```javascript
// In browser console on YouTube video page
import metadataExtractor from "./content/metadata/extractor.js";
const metadata = metadataExtractor.extract("VIDEO_ID");
console.log(metadata);
```

### 2. Cache Functionality

-   [ ] First extraction takes ~20-50ms
-   [ ] Second extraction (within 5 min) takes <1ms
-   [ ] Cache expires after 5 minutes
-   [ ] Cache cleared on page navigation

**How to Test:**

```javascript
// First call
console.time("first");
const m1 = metadataExtractor.extract("VIDEO_ID");
console.timeEnd("first");

// Second call (should be cached)
console.time("second");
const m2 = metadataExtractor.extract("VIDEO_ID");
console.timeEnd("second");

// Clear cache
metadataExtractor.clearCache();
```

### 3. Analysis Integration

-   [ ] Metadata passed to ANALYZE_VIDEO message
-   [ ] Service worker receives metadata
-   [ ] Gemini service receives metadata
-   [ ] Prompt includes metadata context
-   [ ] Summary references video topic
-   [ ] FAQs are relevant to video

**How to Test:**

1. Open YouTube video
2. Click "Analyze Video"
3. Check console for metadata logs
4. Verify summary mentions video title/topic
5. Check FAQs are relevant

### 4. Chat Integration

-   [ ] Metadata extracted on chat message
-   [ ] Metadata passed to CHAT_WITH_VIDEO
-   [ ] Chat responses reference video details
-   [ ] Responses are contextually aware

**How to Test:**

1. Analyze a video first
2. Ask: "What is this video about?"
3. Verify response mentions video title
4. Ask: "Who made this video?"
5. Verify response mentions channel name

### 5. Streaming Analysis

-   [ ] Metadata passed to streaming endpoint
-   [ ] Chunks include enhanced context
-   [ ] Progressive display works
-   [ ] Final result includes metadata-enhanced content

**How to Test:**

1. Click "Analyze Video"
2. Watch streaming output
3. Verify content is contextually relevant
4. Check final summary quality

## Quality Tests

### Summary Quality

-   [ ] Summary mentions video title/topic
-   [ ] Summary is contextually relevant
-   [ ] Key points align with video theme
-   [ ] Timestamps are accurate
-   [ ] Language/tone matches video type

**Example Questions:**

-   Does the summary mention the video title?
-   Are the key points relevant to the video topic?
-   Does it understand the video's purpose?

### FAQ Quality

-   [ ] Questions are relevant to video topic
-   [ ] Questions align with viewer interests
-   [ ] Answers reference video content
-   [ ] FAQs are helpful and informative

**Example Questions:**

-   Are FAQs about the video topic?
-   Would viewers actually ask these questions?
-   Do answers provide value?

### Key Insights Quality

-   [ ] Insights match video theme
-   [ ] Insights are meaningful
-   [ ] Insights reference video context
-   [ ] Insights add value beyond summary

**Example Questions:**

-   Do insights relate to the video topic?
-   Are they genuinely insightful?
-   Do they add value?

### Chat Quality

-   [ ] Responses reference video title
-   [ ] Responses mention channel when relevant
-   [ ] Answers are contextually aware
-   [ ] Responses are accurate

**Example Questions:**

-   "What is this video about?" → Should mention title
-   "Who made this?" → Should mention channel
-   "What's the main topic?" → Should reference description

## Edge Cases

### Missing Metadata

-   [ ] Works when title unavailable
-   [ ] Works when description empty
-   [ ] Works when keywords missing
-   [ ] Gracefully handles all missing fields

**How to Test:**
Test on videos with minimal metadata (e.g., old videos, music videos)

### Special Characters

-   [ ] Handles emojis in title
-   [ ] Handles special characters
-   [ ] Handles non-English characters
-   [ ] Handles HTML entities

**How to Test:**
Test on videos with emojis/special chars in title

### Long Content

-   [ ] Handles very long descriptions
-   [ ] Handles many keywords
-   [ ] Doesn't exceed token limits
-   [ ] Truncates gracefully if needed

**How to Test:**
Test on videos with extensive descriptions

### Performance

-   [ ] Extraction completes in <100ms
-   [ ] No noticeable delay in analysis
-   [ ] Cache improves performance
-   [ ] No memory leaks

**How to Test:**
Use Chrome DevTools Performance tab

## Regression Tests

### Existing Functionality

-   [ ] Analysis still works without metadata
-   [ ] Chat still works without metadata
-   [ ] Segment classification unaffected
-   [ ] Timeline rendering unaffected
-   [ ] History saving unaffected

**How to Test:**
Test all existing features to ensure nothing broke

### Backward Compatibility

-   [ ] Old cached data still works
-   [ ] Extension works on old Chrome versions
-   [ ] No breaking changes to API
-   [ ] All existing features functional

## Browser Compatibility

-   [ ] Chrome (latest)
-   [ ] Chrome (one version back)
-   [ ] Edge (Chromium-based)
-   [ ] Brave
-   [ ] Opera

## Console Checks

### Expected Logs

```
[MetadataExtractor] ℹ️ Extracting metadata for: VIDEO_ID
[MetadataExtractor] ✅ Metadata extracted: Video Title
[TranscriptService] ℹ️ Fetching transcript for video: VIDEO_ID
[Background] Received message: ANALYZE_VIDEO
```

### No Errors

-   [ ] No console errors
-   [ ] No console warnings (except expected)
-   [ ] No failed network requests
-   [ ] No undefined variables

## User Experience

### Loading States

-   [ ] "Extracting video metadata..." shown
-   [ ] Progress indicators work
-   [ ] No UI freezing
-   [ ] Smooth transitions

### Error Handling

-   [ ] Graceful degradation if metadata fails
-   [ ] Clear error messages
-   [ ] Retry mechanisms work
-   [ ] Fallbacks function properly

### Visual Feedback

-   [ ] Loading spinners display
-   [ ] Status messages update
-   [ ] Results render correctly
-   [ ] No layout shifts

## Performance Benchmarks

### Target Metrics

-   [ ] Metadata extraction: <50ms
-   [ ] Cache lookup: <1ms
-   [ ] Total overhead: <100ms
-   [ ] Memory usage: <5MB increase

### Actual Measurements

```
Metadata Extraction: _____ ms
Cache Lookup: _____ ms
Total Overhead: _____ ms
Memory Usage: _____ MB
```

## Comparison Tests

### Before vs After

Test the same video before and after the update:

#### Summary Quality

-   Before: **\_**/10
-   After: **\_**/10
-   Improvement: **\_**

#### FAQ Relevance

-   Before: **\_**/10
-   After: **\_**/10
-   Improvement: **\_**

#### Chat Accuracy

-   Before: **\_**/10
-   After: **\_**/10
-   Improvement: **\_**

## Final Checklist

-   [ ] All functional tests pass
-   [ ] All quality tests pass
-   [ ] All edge cases handled
-   [ ] No regressions found
-   [ ] Performance acceptable
-   [ ] User experience smooth
-   [ ] Documentation complete
-   [ ] Code reviewed
-   [ ] Ready for production

## Test Results Summary

**Date:** ****\_\_\_****
**Tester:** ****\_\_\_****
**Version:** ****\_\_\_****

**Overall Status:** ⬜ Pass ⬜ Fail ⬜ Needs Work

**Notes:**

---

---

---

**Issues Found:**

1. ***
2. ***
3. ***

**Recommendations:**

1. ***
2. ***
3. ***
