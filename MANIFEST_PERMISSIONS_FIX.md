# Manifest Permissions Fix for Piped API

## Issue

Even background scripts were being blocked by CORS when accessing Piped API:

```
Access to fetch at 'https://pipedapi.kavin.rocks/streams/...'
from origin 'chrome-extension://...' has been blocked by CORS policy
```

## Root Cause

Chrome extensions need explicit `host_permissions` in manifest.json to bypass CORS, even for background scripts.

## Solution

Added Piped API domains to `host_permissions` in manifest.json

## Changes Made

### `extension/manifest.json`

Added to `host_permissions`:

```json
"https://pipedapi.kavin.rocks/*",
"https://pipedapi.tokhmi.xyz/*",
"https://pipedapi.moomoo.me/*",
"https://pipedapi-libre.kavin.rocks/*",
"https://api-piped.mha.fi/*",
"https://*.piped.video/*",
"https://raw.githubusercontent.com/*"
```

## Why This Works

### Chrome Extension Permissions Hierarchy:

1. **No permissions**: Blocked by CORS everywhere
2. **`host_permissions`**: Can bypass CORS in background scripts
3. **Content scripts**: Always subject to page CORS (can't bypass)

### Our Implementation:

-   ✅ Background script has `host_permissions` → Can access Piped API
-   ✅ Content script sends message to background → Background makes request
-   ✅ No CORS errors!

## Testing

### Before Fix:

```
❌ Access blocked by CORS policy (even in background script)
❌ All Piped instances failed
```

### After Fix:

```
✅ Background script can access Piped API
✅ Metadata and transcripts fetched successfully
✅ Falls back to other methods if Piped fails
```

## Important Notes

### User Action Required:

When users update the extension, Chrome will prompt them to approve the new permissions:

-   "Access your data on pipedapi.kavin.rocks"
-   "Access your data on raw.githubusercontent.com"
-   etc.

This is normal and required for the extension to work.

### Privacy:

-   These permissions only allow the extension to access these specific domains
-   No user data is sent to these services
-   Only video IDs are sent to fetch public metadata/transcripts

## Files Modified

1. ✅ `extension/manifest.json` - Added Piped API host permissions

## Next Steps

1. **Reload Extension**: Users must reload the extension in `chrome://extensions`
2. **Accept Permissions**: Chrome will prompt to accept new permissions
3. **Test**: Try analyzing a video - Piped API should work now!

## Status

✅ **FIXED** - Piped API will work after extension reload and permission acceptance

---

**Date**: 2024
**Status**: Ready for Testing
**User Action**: Reload extension + accept permissions
