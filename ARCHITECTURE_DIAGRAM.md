# Architecture Diagram

## Request Flow

```
User Action (Analyze Video)
    ↓
Content Script
    ↓
Background Service Worker
    ↓
GeminiService.generateSummary()
    ↓
GeminiClient.generateContent()
    ↓
┌─────────────────────────────────┐
│ Rate Limiter (Token Bucket)    │
│ - Check: Available slots?       │
│ - Queue if limit reached        │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ HTTP Client (Enhanced Fetch)    │
│ - Timeout: 30s                  │
│ - Retry: Exponential backoff    │
│ - Error: Classification         │
└─────────────────────────────────┘
    ↓
Gemini API
    ↓
Response / Error
    ↓
┌─────────────────────────────────┐
│ Error Handler                   │
│ - Classify: Retryable?          │
│ - Message: User-friendly        │
└─────────────────────────────────┘
    ↓
User Interface
```

## Module Dependencies

```
GeminiService
    ├── GeminiClient
    │   ├── HttpClient
    │   ├── RateLimiter
    │   └── ErrorHandler
    └── ModelManager
```

See ARCHITECTURE.md for details.
