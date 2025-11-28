# Model Name Fix - Documentation

## Issue

The extension was experiencing errors when trying to use Gemini models:

```
✗ models/gemini-1.5-flash is not found for API version v1beta,
or is not supported for generateContent.
```

## Root Cause

The Gemini API expects model names **without** the `models/` prefix in the URL path:

**Correct:**

```
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent
```

**Incorrect:**

```
https://generativelanguage.googleapis.com/v1beta/models/models/gemini-1.5-flash:generateContent
```

The issue occurred because:

1. Model names were being stored with the `models/` prefix
2. Some code wasn't stripping the prefix before using the model name
3. The fallback model names didn't include the `-latest` suffix

## Solution

### 1. Updated Model Names

Changed all default/fallback model names to use correct format:

**Before:**

```javascript
const fallbackModels = ["gemini-1.5-flash", "gemini-1.5-pro"];
```

**After:**

```javascript
const fallbackModels = [
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-002",
    "gemini-1.5-flash-001",
    "gemini-1.5-pro-latest",
    "gemini-1.5-pro-002",
];
```

### 2. Added Prefix Stripping

Added checks to strip `models/` prefix in all places where model names are used:

#### Files Modified:

**extension/options/modules/ai-config.js**

-   Strip prefix when loading saved model
-   Strip prefix when saving model selection
-   Strip prefix in test connection

**extension/services/transcript/utils/music-classifier.js**

-   Strip prefix before using model

**extension/background/handlers/transcribe-audio.js**

-   Strip prefix before using model

**extension/onboarding/onboarding.js**

-   Use correct model name in API key test

### 3. Created Utility Functions

**extension/utils/model-utils.js**

```javascript
export function cleanModelName(modelName) {
    if (modelName?.startsWith("models/")) {
        return modelName.replace("models/", "");
    }
    return modelName;
}

export function getDefaultModel() {
    return "gemini-1.5-flash-latest";
}
```

### 4. Added Migration

**extension/utils/migrate-model-names.js**

-   Automatically cleans up stored model names on extension update
-   Runs once when extension is updated

**extension/background/service-worker.js**

-   Calls migration on update

## Testing

### Manual Test Steps

1. **Test with clean install:**

    ```
    - Install extension
    - Complete onboarding with API key
    - Test connection → Should succeed
    - Analyze a video → Should work
    ```

2. **Test with existing installation:**

    ```
    - Update extension
    - Migration runs automatically
    - Check storage: chrome.storage.sync.get(['model'])
    - Model name should not have 'models/' prefix
    ```

3. **Test model selection:**

    ```
    - Open settings
    - Refresh models list
    - Select a model
    - Check storage → Should be clean name
    ```

4. **Test API calls:**
    ```
    - Analyze video
    - Chat with video
    - Transcribe audio
    - All should use correct model names
    ```

## Verification

To verify the fix is working:

1. **Check browser console** - No more "models/gemini-..." errors
2. **Check network tab** - API URLs should have single `models/` in path
3. **Check storage** - Run in console:
    ```javascript
    chrome.storage.sync.get(["model"], (data) => {
        console.log("Stored model:", data.model);
        // Should NOT start with 'models/'
    });
    ```

## Files Changed

### New Files

-   `extension/utils/model-utils.js` - Model name utilities
-   `extension/utils/migrate-model-names.js` - Migration script
-   `MODEL_NAME_FIX.md` - This documentation

### Modified Files

-   `extension/api/gemini.js` - Updated fallback models
-   `extension/api/models.js` - Updated priority list
-   `extension/options/modules/ai-config.js` - Added prefix stripping
-   `extension/services/transcript/utils/music-classifier.js` - Added prefix stripping
-   `extension/background/handlers/transcribe-audio.js` - Added prefix stripping
-   `extension/onboarding/onboarding.js` - Fixed test model name
-   `extension/background/service-worker.js` - Added migration call

## Prevention

To prevent this issue in the future:

1. **Always use `cleanModelName()`** when reading model from storage
2. **Always use `getDefaultModel()`** for fallback values
3. **Never hardcode model names** without `-latest` or version suffix
4. **Test with network inspector** to verify API URLs are correct

## API Model Name Format

### Correct Formats

-   `gemini-1.5-flash-latest` ✅
-   `gemini-1.5-flash-002` ✅
-   `gemini-1.5-pro-latest` ✅
-   `gemini-2.0-flash-exp` ✅

### Incorrect Formats

-   `models/gemini-1.5-flash` ❌ (has prefix)
-   `gemini-1.5-flash` ❌ (no version/latest suffix)
-   `models/gemini-1.5-flash-latest` ❌ (has prefix)

## References

-   [Gemini API Documentation](https://ai.google.dev/api/rest)
-   [Model Names Reference](https://ai.google.dev/models/gemini)

---

**Status:** ✅ Fixed
**Version:** 2.0.0
**Date:** November 2024
