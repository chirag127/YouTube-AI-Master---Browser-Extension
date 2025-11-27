# YouTube AI Master - Security & Architecture Documentation

## MV3 Security Compliance (2025)

### ✅ Implemented Security Measures

#### 1. Message Passing Security

-   **Sender Verification**: `extension/background/security/sender-check.js`
    -   Validates sender.id matches chrome.runtime.id
    -   Verifies content scripts are from youtube.com
    -   Blocks unauthorized message sources

#### 2. Input Validation & Sanitization

-   **Input Validator**: `extension/background/security/validator.js`
    -   Whitelisted action types (ALLOWED_ACTIONS)
    -   Video ID regex validation (11-char alphanumeric)
    -   String length limits (prevents DoS)
    -   Transcript size limits (5MB max)
    -   HTML tag stripping from user inputs

#### 3. Service Worker Security

-   All message handlers use sanitized inputs
-   No eval() or unsafe code execution
-   All code is local (no remote loading)
-   CSP compliant

### Transcript Extraction Architecture

#### Priority Order (5 Methods)

1. **XHR Interceptor** (Fastest) - `strategies/xhr-intercept.js`

    - Intercepts fetch/XHR to timedtext endpoint
    - Zero latency, exact official data
    - Requires MAIN world injection

2. **Invidious API** (Primary Backup) - `strategies/invidious.js`

    - CORS-free, reliable, JSON format
    - Multiple instance fallback
    - 5-minute instance cache

3. **YouTube Direct API** (Legacy) - `strategies/youtube-direct.js`

    - Direct timedtext endpoint call
    - Supports JSON3, SRV3, XML formats
    - May fail due to CORS

4. **Background Proxy** (Service Worker) - `strategies/background-proxy.js`

    - Proxies requests through service worker
    - Bypasses CORS restrictions
    - Fallback for content script failures

5. **DOM Parser** (Last Resort) - `strategies/dom-parser.js`
    - Parses ytInitialPlayerResponse
    - Scrapes transcript panel if open
    - Slowest but always available

#### Parser Strategies

Each extraction method returns different formats:

-   **VTT Parser**: `parsers/vtt.js` (Invidious, Piped)
-   **JSON3 Parser**: `parsers/json3.js` (YouTube JSON format)
-   **XML Parser**: `parsers/xml.js` (YouTube SRV3 format)

### Segment Classification

#### Rules Engine

Location: `extension/services/segments/rules/`

**Segment Types:**

1. **Sponsor** - Paid promotions (TWO timestamps)
2. **Interaction** - Like/subscribe reminders (TWO timestamps)
3. **Self Promotion** - Own merch/courses (TWO timestamps)
4. **Unpaid Promotion** - Charity/shoutouts (TWO timestamps)
5. **Highlight** - Most important part (ONE timestamp only)
6. **Preview/Recap** - Coming up/previously (TWO timestamps)
7. **Intro/Outro** - Greetings/sign-offs (TWO timestamps)
8. **Filler** - Tangents/jokes (TWO timestamps)

#### Timestamp Rules

-   **Highlight**: Only START timestamp (single point in time)
-   **All Others**: START + END timestamps (both clickable)
-   Validation: `services/segments/timestamp-validator.js`
-   UI: Both timestamps are clickable in `ui/renderers/segments.js`

### File Structure (Maximum Modularity)

```
extension/
├── background/
│   ├── service-worker.js (main orchestrator)
│   └── security/
│       ├── sender-check.js (origin verification)
│       └── validator.js (input sanitization)
├── content/
│   └── transcript/
│       ├── strategy-manager.js (priority orchestrator)
│       ├── strategies/ (extraction methods)
│       │   ├── xhr-intercept.js (Method 1)
│       │   ├── invidious.js (Method 2)
│       │   ├── youtube-direct.js (Method 3)
│       │   ├── background-proxy.js (Method 4)
│       │   └── dom-parser.js (Method 5)
│       └── service.js (legacy comprehensive service)
├── services/
│   ├── transcript/
│   │   └── parsers/
│   │       ├── vtt.js (WebVTT format)
│   │       ├── json3.js (YouTube JSON3)
│   │       └── xml.js (XML/SRV3)
│   └── segments/
│       ├── rules/ (classification rules)
│       │   ├── sponsor.js
│       │   ├── interaction.js
│       │   ├── highlight.js
│       │   ├── self-promotion.js
│       │   ├── preview.js
│       │   ├── intro.js
│       │   └── filler.js
│       └── timestamp-validator.js
```

### Token Optimization Strategy

-   Arrow functions: `const fn=()=>` vs `function fn()`
-   Destructured imports: `import{a,b}from'x'`
-   Ternary operators over if/else
-   Short variable names in loops
-   Minimal comments (only complex logic)
-   Combined expressions

### Best Practices Applied

✅ Service worker with type: "module"
✅ Sender verification on all messages
✅ Input sanitization before processing
✅ No remote code execution
✅ CSP compliant
✅ Minimal permissions (storage, activeTab, scripting)
✅ Host permissions only for required APIs
✅ Modular architecture (many small files)
✅ Error handling with fallbacks
✅ Caching to reduce API calls

### Security Checklist

-   [x] Validate all messages from content scripts
-   [x] Sanitize user inputs (videoId, text, etc.)
-   [x] Verify sender origin
-   [x] Whitelist allowed actions
-   [x] Limit string/data sizes
-   [x] No eval() or Function() constructors
-   [x] No remote code loading
-   [x] CSP compliant manifest
-   [x] Secure message passing (chrome.runtime)
-   [x] Error messages don't leak sensitive data
