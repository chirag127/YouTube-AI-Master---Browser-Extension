# YouTube AI Master - Architecture Documentation

## Overview

YouTube AI Master is a production-grade Chrome extension that leverages Google's Gemini AI to provide intelligent video analysis. This document details the architectural decisions, patterns, and best practices implemented in the codebase.

---

## Core Architecture Principles

### 1. Maximum Modularity, Minimum Tokens

Every module follows the **Single Responsibility Principle**. Files are atomic units of functionality, making the codebase:

-   Easy to test in isolation
-   Simple to understand and maintain
-   Highly reusable across features
-   Minimal in token count per file

### 2. Fault-Tolerant by Design

The system assumes **every external call can fail** and implements:

-   Exponential backoff retry logic
-   Graceful degradation
-   User-friendly error messages
-   Circuit breaker patterns

### 3. Zero-Crash Guarantee

No missing API key, network failure, or rate limit should crash the extension. All integrations are **optional** and fail gracefully.

---

## Module Structure

### API Layer (`extension/api/`)

#### Core Infrastructure (`extension/api/core/`)

**`http-client.js`** - Enhanced HTTP client

-   Exponential backoff retry (configurable attempts/delays)
-   Request timeout via AbortController
-   Error classification (retryable vs fatal)
-   Structured logging

**`rate-limiter.js`** - Token bucket rate limiter

-   Prevents exceeding API rate limits (15 RPM for Gemini free tier)
-   Request queuing when limit reached
-   Auto-release after time window
-   Real-time stats tracking

**`error-handler.js`** - Error classification & messaging

-   Maps HTTP status codes to user-friendly messages
-   Distinguishes retryable vs non-retryable errors
-   Provides actionable guidance (check API key, retry, etc.)

#### Gemini Integration

**`gemini-client.js`** - Low-level Gemini API client

-   Uses http-client for retry/timeout
-   Integrates rate-limiter
-   Handles API-specific error responses
-   Exposes rate limit statistics

**`gemini.js`** - High-level Gemini service

-   Model fallback strategy (tries multiple models)
-   Specialized methods (summary, chat, segments, FAQ)
-   Context-aware prompt generation
-   JSON parsing with fallbacks

**`models.js`** - Model discovery & management

-   Fetches available Gemini models
-   Caches model list
-   Provides model selection logic

---

## Key Patterns

### 1. Exponential Backoff Retry

```javascript
// Retry with exponential delays: 1s, 2s, 4s, 8s (capped at 10s)
for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
        return await fetch(url);
    } catch (error) {
        if (!isRetryable(error)) throw error;
        await sleep(Math.min(delay * 2, maxDelay));
    }
}
```

**Why:** Transient failures (rate limits, server errors) often resolve quickly. Exponential backoff prevents overwhelming the service while maximizing success rate.

### 2. Token Bucket Rate Limiting

```javascript
// Track request timestamps in sliding window
timestamps = timestamps.filter((ts) => now - ts < windowMs);

if (timestamps.length < maxRequests) {
    // Allow request
    timestamps.push(now);
} else {
    // Queue and wait
    const waitTime = windowMs - (now - timestamps[0]);
    setTimeout(() => processQueue(), waitTime);
}
```

**Why:** Prevents hitting API rate limits (429 errors) by proactively throttling requests. More efficient than reactive retry.

### 3. Model Fallback Strategy

```javascript
const models = [
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash",
];

for (const model of models) {
    try {
        return await client.generateContent(prompt, model);
    } catch (error) {
        if (!error.retryable) throw error; // Don't fallback on auth errors
        // Try next model
    }
}
```

**Why:** Different models have different availability and rate limits. Fallback ensures maximum uptime.

### 4. Graceful Degradation

```javascript
// Context Manager fetches 10+ APIs in parallel
const results = await Promise.allSettled(tasks);

results.forEach((result) => {
    if (result.status === "fulfilled") {
        context[name] = result.value;
    } else {
        console.warn(`${name} failed, continuing without it`);
    }
});
```

**Why:** Missing data from one API shouldn't block the entire analysis. The AI works with whatever context is available.

---

## Error Handling Strategy

### Error Classification

| Status  | Type          | Retryable | User Message                       |
| ------- | ------------- | --------- | ---------------------------------- |
| 401/403 | AUTH_ERROR    | No        | "API key is invalid or expired"    |
| 429     | RATE_LIMIT    | Yes       | "Rate limit exceeded, please wait" |
| 400     | BAD_REQUEST   | No        | "Content too large or invalid"     |
| 500-599 | SERVER_ERROR  | Yes       | "Service temporarily unavailable"  |
| Timeout | TIMEOUT       | Yes       | "Request timed out"                |
| Network | NETWORK_ERROR | Yes       | "Check your internet connection"   |

### Error Flow

```
1. HTTP Client catches error
2. Error Handler classifies error
3. If retryable → Retry with backoff
4. If non-retryable → Create user-friendly error
5. Propagate to UI with actionable message
```

---

## Performance Optimizations

### 1. Parallel API Calls

```javascript
// Context Manager executes 10+ API calls simultaneously
const tasks = [
    tmdb.searchMovie(title),
    musicbrainz.searchArtist(author),
    wikidata.searchEntity(title),
    // ... 7 more APIs
];

const results = await Promise.allSettled(tasks);
```

**Impact:** Reduces context fetching from ~30s (sequential) to ~3s (parallel).

### 2. Request Caching

```javascript
// Storage Service caches video analysis
if (cached?.summary && cached?.segments) {
    return cached; // Skip expensive AI call
}
```

**Impact:** Instant results for previously analyzed videos.

### 3. Service Worker Keep-Alive

```javascript
// Prevent service worker termination during long operations
const keepAliveInterval = setInterval(
    () => chrome.runtime.getPlatformInfo(() => {}),
    20000
);
```

**Impact:** Prevents analysis interruption on long videos.

---

## Security

### Input Validation

```javascript
// All external data is sanitized before use
const sanitized = {
    videoId: sanitizeVideoId(req.videoId), // Regex validation
    question: sanitizeString(req.question, 5000), // Length limit
    title: sanitizeString(req.title, 500),
};
```

### Sender Verification

```javascript
// Only accept messages from extension pages
if (!verifySender(sender)) {
    sendResponse({ success: false, error: "Unauthorized" });
    return false;
}
```

### API Key Storage

-   Keys stored in `chrome.storage.sync` (encrypted by Chrome)
-   Never logged or exposed in errors
-   Only sent to official API endpoints

---

## Configuration

### Gemini Client Configuration

```javascript
new GeminiClient(apiKey, {
    maxRetries: 2, // Number of retry attempts
    initialDelay: 1000, // Initial retry delay (ms)
    timeout: 30000, // Request timeout (ms)
    maxRequestsPerMinute: 15, // Rate limit (free tier)
});
```

### HTTP Client Configuration

```javascript
new HttpClient({
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    timeout: 30000,
});
```

---

## Monitoring & Observability

### Rate Limit Stats

```javascript
const stats = geminiService.getRateLimitStats();
// {
//     activeRequests: 12,
//     maxRequests: 15,
//     queueLength: 3,
//     available: 3
// }
```

### Structured Logging

```javascript
cl("[Module] Info message", data); // Console log with prefix
cw("[Module] Warning", error); // Console warn
ce("[Module] Error", error); // Console error
```

---

## Testing Strategy

### Unit Testing (Recommended)

```javascript
// Test http-client retry logic
test("retries on 429 error", async () => {
    const client = new HttpClient({ maxRetries: 2 });
    // Mock fetch to return 429, then 200
    // Assert: 2 attempts made
});
```

### Integration Testing

```javascript
// Test full Gemini flow
test("generates summary with fallback", async () => {
    const service = new GeminiService(apiKey);
    const summary = await service.generateSummary(transcript);
    expect(summary).toBeTruthy();
});
```

---

## Future Enhancements

### 1. Circuit Breaker Pattern

Temporarily disable failing APIs after N consecutive failures:

```javascript
class CircuitBreaker {
    constructor(threshold = 5, timeout = 60000) {
        this.failures = 0;
        this.state = "CLOSED"; // CLOSED, OPEN, HALF_OPEN
    }

    async execute(fn) {
        if (this.state === "OPEN") {
            throw new Error("Circuit breaker is OPEN");
        }
        // Execute and track failures
    }
}
```

### 2. Telemetry & Metrics

Track API performance for optimization:

```javascript
class Telemetry {
    trackApiCall(api, duration, success) {
        // Store metrics
        // Calculate: avg latency, success rate, p95, p99
    }
}
```

### 3. Request Batching

Combine multiple small requests into one:

```javascript
// Instead of 3 separate calls
await gemini.generateSummary(transcript);
await gemini.generateFAQ(transcript);
await gemini.extractSegments(transcript);

// Batch into single call
await gemini.generateComprehensive(transcript);
```

---

## Troubleshooting

### Rate Limit Errors (429)

**Symptom:** "Rate limit exceeded" errors

**Solution:**

1. Check rate limit stats: `geminiService.getRateLimitStats()`
2. Reduce `maxRequestsPerMinute` in config
3. Implement request queuing in UI

### Timeout Errors

**Symptom:** "Request timeout after 30000ms"

**Solution:**

1. Increase timeout in config
2. Reduce transcript size (chunk large videos)
3. Use faster model (gemini-flash vs gemini-pro)

### Auth Errors (401/403)

**Symptom:** "API key is invalid or expired"

**Solution:**

1. Verify API key in extension settings
2. Check key has Gemini API enabled
3. Verify billing is active (if using paid tier)

---

## Contributing

When adding new features:

1. **Create atomic modules** - One responsibility per file
2. **Use http-client** - Don't implement custom retry logic
3. **Handle errors gracefully** - Never crash on external failures
4. **Add logging** - Use cl/cw/ce for structured logs
5. **Document decisions** - Update this file with architectural changes

---

## References

-   [Gemini API Documentation](https://ai.google.dev/docs)
-   [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)
-   [Exponential Backoff Best Practices](https://cloud.google.com/iot/docs/how-tos/exponential-backoff)
-   [Token Bucket Algorithm](https://en.wikipedia.org/wiki/Token_bucket)

---

**Last Updated:** 2025-11-28
**Version:** 2.0.0
**Maintainer:** YouTube AI Master Team
