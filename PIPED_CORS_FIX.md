# Piped API CORS Fix

## Issues Fixed

### 1. ❌ CORS Error

**Problem**: Content scripts cannot make cross-origin requests to Piped API instances

```
Access to fetch at 'https://pipedapi.kavin.rocks/streams/...' from origin 'https://www.youtube.com'
has been blocked by CORS policy
```

**Solution**: Moved Piped API calls to background script which can make cross-origin requests

### 2. ❌ JavaScript Error

**Problem**: `console[level] is not a function`

```javascript
console[level](`[PipedAPI] ${icons[level]} ${msg}`, ...args);
// When level = 'success', console.success doesn't exist!
```

**Solution**: Map log levels to actual console methods

```javascript
const logFn =
    level === "error"
        ? console.error
        : level === "warn"
        ? console.warn
        : console.log;
```

## Changes Made

### 1. Fixed Logging in `extension/services/piped/api.js`

```javascript
// Before
console[level](`[PipedAPI] ${icons[level]} ${msg}`, ...args);

// After
const logFn =
    level === "error"
        ? console.error
        : level === "warn"
        ? console.warn
        : console.log;
logFn(`[PipedAPI] ${icons[level]} ${msg}`, ...args);
```

### 2. Fixed Logging in `extension/content/metadata/extractor.js`

```javascript
// Before
console[level](`[MetadataExtractor] ${icons[level]} ${msg}`);

// After
const logFn =
    level === "error"
        ? console.error
        : level === "warn"
        ? console.warn
        : console.log;
logFn(`[MetadataExtractor] ${icons[level]} ${msg}`);
```

### 3. Added Background Handlers in `extension/background/service-worker.js`

#### New Message Handlers:

-   `FETCH_PIPED_METADATA` - Fetches video metadata from Piped
-   `FETCH_PIPED_TRANSCRIPT` - Fetches video transcript from Piped

#### New Functions:

-   `handleFetchPipedMetadata()` - Handles metadata requests
-   `handleFetchPipedTranscript()` - Handles transcript requests
-   `getPipedInstances()` - Fetches and caches Piped instance list

### 4. Updated Piped API Service

#### `getVideoMetadata()` - Now uses background script

```javascript
// Before: Direct fetch (CORS blocked)
const response = await fetch(`${instance}/streams/${videoId}`);

// After: Via background script (CORS allowed)
const response = await chrome.runtime.sendMessage({
    action: "FETCH_PIPED_METADATA",
    videoId: videoId,
});
```

#### `getTranscript()` - Now uses background script

```javascript
// Before: Direct fetch (CORS blocked)
const response = await fetch(`${instance}/streams/${videoId}`);

// After: Via background script (CORS allowed)
const response = await chrome.runtime.sendMessage({
    action: "FETCH_PIPED_TRANSCRIPT",
    videoId: videoId,
    lang: lang,
});
```

## How It Works Now

### Data Flow:

```
Content Script (Piped API)
    ↓ chrome.runtime.sendMessage()
Background Script (Service Worker)
    ↓ fetch() - CORS allowed
Piped API Instance
    ↓ Response
Background Script
    ↓ sendResponse()
Content Script
```

### Why This Works:

-   **Content Scripts**: Run in the context of web pages, subject to CORS
-   **Background Scripts**: Run in extension context, NOT subject to CORS
-   **Solution**: Content scripts send messages to background, which makes the actual API calls

## Testing

### Before Fix:

```
❌ CORS policy: No 'Access-Control-Allow-Origin' header
❌ console[level] is not a function
❌ All Piped instances failed
```

### After Fix:

```
✅ [PipedAPI] ℹ️ Fetching metadata for VIDEO_ID
✅ [PipedAPI] ℹ️ Trying instance 1: https://pipedapi.kavin.rocks
✅ [PipedAPI] ✅ Metadata fetched successfully
```

## Benefits

1. **CORS Bypass**: Background script can access any API
2. **Better Logging**: Proper console methods used
3. **Centralized**: All API calls in one place (background script)
4. **Caching**: Instance list cached in background
5. **Error Handling**: Consistent error handling

## Files Modified

1. ✅ `extension/services/piped/api.js` - Fixed logging, use background for API calls
2. ✅ `extension/content/metadata/extractor.js` - Fixed logging
3. ✅ `extension/background/service-worker.js` - Added Piped API handlers

## Status

✅ **FIXED** - Piped API now works correctly without CORS errors

---

**Date**: 2024
**Status**: Production Ready
**Breaking Changes**: None
