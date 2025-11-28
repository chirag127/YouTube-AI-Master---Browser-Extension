# Quick Reference - YouTube AI Master v2.0

## 🚀 Quick Start

### Basic Usage

```javascript
import { GeminiService } from "./api/gemini.js";

const service = new GeminiService(apiKey);

// Generate summary
const summary = await service.generateSummary(transcript);

// Chat with video
const answer = await service.chatWithVideo(question, context);

// Analyze comments
const sentiment = await service.analyzeCommentSentiment(comments);

// Extract segments
const { segments, fullVideoLabel } = await service.extractSegments(context);
```

---

## 🔧 Configuration

### Custom Timeout

```javascript
import { GeminiClient } from "./api/gemini-client.js";

const client = new GeminiClient(apiKey, {
    timeout: 60000, // 60 seconds
});
```

### Custom Rate Limit

```javascript
const client = new GeminiClient(apiKey, {
    maxRequestsPerMinute: 60, // Paid tier
});
```

### Custom Retry

```javascript
const client = new GeminiClient(apiKey, {
    maxRetries: 3,
    initialDelay: 2000,
});
```

---

## 📊 Monitoring

### Rate Limit Stats

```javascript
const stats = service.getRateLimitStats();
console.log(stats);
// {
//     activeRequests: 12,
//     maxRequests: 15,
//     queueLength: 3,
//     available: 3
// }
```

---

## 🚨 Error Handling

### Enhanced Error Properties

```javascript
try {
    await service.generateSummary(transcript);
} catch (error) {
    console.log(error.message); // User-friendly message
    console.log(error.type); // AUTH_ERROR, RATE_LIMIT, etc.
    console.log(error.retryable); // true/false
}
```

### Error Types

| Type            | Retryable | Meaning           |
| --------------- | --------- | ----------------- |
| `AUTH_ERROR`    | No        | Invalid API key   |
| `RATE_LIMIT`    | Yes       | Too many requests |
| `BAD_REQUEST`   | No        | Invalid input     |
| `SERVER_ERROR`  | Yes       | Service down      |
| `TIMEOUT`       | Yes       | Request too slow  |
| `NETWORK_ERROR` | Yes       | No internet       |

---

## 🎯 Best Practices

### 1. Always Handle Errors

```javascript
try {
    const result = await service.generateSummary(transcript);
    showResult(result);
} catch (error) {
    if (error.retryable) {
        showRetryButton();
    } else {
        showError(error.message);
    }
}
```

### 2. Monitor Rate Limits

```javascript
function canMakeRequest() {
    const stats = service.getRateLimitStats();
    return stats.available > 0;
}

if (canMakeRequest()) {
    await service.generateSummary(transcript);
} else {
    showWarning("Rate limit reached, please wait");
}
```

### 3. Use Appropriate Timeouts

```javascript
// Short videos: default 30s
const client = new GeminiClient(apiKey);

// Long videos: increase timeout
const clientLong = new GeminiClient(apiKey, {
    timeout: 60000,
});
```

### 4. Leverage Model Fallback

```javascript
// Service automatically tries multiple models
// No need to handle model selection manually
const summary = await service.generateSummary(transcript);
```

---

## 🔍 Debugging

### Enable Verbose Logging

```javascript
import { cl, cw, ce } from "./utils/shortcuts.js";

cl("Info message", data); // Console log
cw("Warning", error); // Console warn
ce("Error", error); // Console error
```

### Check Rate Limit Status

```javascript
const stats = service.getRateLimitStats();
console.log(`Using ${stats.activeRequests}/${stats.maxRequests} requests`);
console.log(`Queue: ${stats.queueLength} waiting`);
```

### Inspect Error Details

```javascript
catch (error) {
    console.error("Type:", error.type);
    console.error("Retryable:", error.retryable);
    console.error("Original:", error.originalError);
}
```

---

## 📦 Module Structure

```
extension/api/
├── core/
│   ├── http-client.js      # Retry + timeout
│   ├── rate-limiter.js     # Rate limiting
│   └── error-handler.js    # Error classification
├── gemini-client.js        # Low-level client
├── gemini.js               # High-level service
└── models.js               # Model management
```

---

## 🎨 Common Patterns

### Pattern 1: Retry with User Feedback

```javascript
async function analyzeWithRetry(transcript, maxAttempts = 3) {
    for (let i = 0; i < maxAttempts; i++) {
        try {
            return await service.generateSummary(transcript);
        } catch (error) {
            if (!error.retryable || i === maxAttempts - 1) {
                throw error;
            }
            showMessage(`Retrying... (${i + 1}/${maxAttempts})`);
        }
    }
}
```

### Pattern 2: Rate Limit Warning

```javascript
function checkRateLimit() {
    const stats = service.getRateLimitStats();

    if (stats.available < 3) {
        showWarning(`Only ${stats.available} requests remaining`);
    }

    if (stats.queueLength > 0) {
        showInfo(`${stats.queueLength} requests queued`);
    }
}
```

### Pattern 3: Progressive Timeout

```javascript
async function analyzeWithProgressiveTimeout(transcript) {
    const timeouts = [30000, 60000, 90000];

    for (const timeout of timeouts) {
        try {
            const client = new GeminiClient(apiKey, { timeout });
            return await client.generateContent(prompt, model);
        } catch (error) {
            if (error.code !== "TIMEOUT") throw error;
        }
    }

    throw new Error("Video too long to analyze");
}
```

---

## 🔗 Useful Links

-   [Architecture Documentation](ARCHITECTURE.md)
-   [Migration Guide](MIGRATION_GUIDE.md)
-   [Changelog](CHANGELOG.md)
-   [Gemini API Docs](https://ai.google.dev/docs)

---

## 💡 Tips

1. **Rate Limits:** Free tier = 15 RPM, Paid tier = 60 RPM
2. **Timeouts:** Default 30s, increase for long videos
3. **Retries:** Automatic for transient failures (429, 500-599, timeout)
4. **Errors:** Always check `error.retryable` before showing retry button
5. **Monitoring:** Use `getRateLimitStats()` to prevent hitting limits

---

## 🆘 Troubleshooting

### "Rate limit exceeded"

→ Wait 60 seconds or upgrade to paid tier

### "Request timeout"

→ Increase timeout or reduce transcript size

### "API key invalid"

→ Check settings, verify key has Gemini API enabled

### "No content in response"

→ Model may be overloaded, retry or use fallback

---

**Version:** 2.0.0
**Last Updated:** 2025-11-28
