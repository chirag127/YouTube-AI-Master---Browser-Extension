# Development Guide

## Quick Start

```bash
# Clone and setup
git clone https://github.com/yourusername/youtube-ai-master.git
cd youtube-ai-master
npm install

# Load in Chrome
# 1. Open chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the "extension" folder
```

## Project Structure

```
extension/
├── manifest.json              # Extension configuration
├── background/
│   └── service-worker.js      # Background processing, API calls
├── content/
│   ├── main.js                # Entry point
│   ├── content.css            # Styles
│   ├── core/                  # State, observer, analyzer
│   ├── transcript/            # Transcript extraction
│   ├── ui/                    # UI components & renderers
│   └── utils/                 # Helper functions
├── services/
│   ├── gemini/                # AI service
│   ├── segments/              # Segment classification
│   ├── storage/               # History management
│   └── chunking/              # Text processing
├── options/                   # Settings page
├── popup/                     # Quick access popup
├── sidepanel/                 # Alternative UI
└── history/                   # History viewer
```

## Key Files

-   `background/service-worker.js` - Handles all API calls, processing
-   `content/main.js` - Injects UI into YouTube pages
-   `services/gemini/api.js` - Gemini API integration
-   `content/transcript/service.js` - Multi-method transcript extraction

## Development Workflow

1. Make changes to code
2. Reload extension in Chrome (click reload icon)
3. Refresh YouTube page
4. Check console for errors (F12)
5. Test features

## Testing

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Manual Testing Checklist

-   [ ] Load extension without errors
-   [ ] Widget appears on YouTube video page
-   [ ] Analyze video works
-   [ ] Summary displays correctly
-   [ ] Transcript is clickable
-   [ ] Segments are classified
-   [ ] Auto-skip works (if enabled)
-   [ ] Chat functionality works
-   [ ] Settings save correctly
-   [ ] History saves and loads

## Debugging

### Service Worker Console

```
chrome://extensions/ → YouTube AI Master → service worker → inspect
```

### Content Script Console

```
F12 on YouTube page → Console tab
```

### Common Issues

**Widget not appearing:**

-   Check content script loaded: `console.log` in main.js
-   Verify URL matches: `/watch?v=`
-   Check CSS injection

**API errors:**

-   Verify API key in options
-   Check service worker console
-   Confirm Gemini API quota

**Transcript fails:**

-   Video must have captions
-   Check all methods in fallback chain
-   Verify Invidious instances are working

## Code Style

-   Use ES6+ features (async/await, arrow functions)
-   Keep functions small (<50 lines)
-   Add JSDoc comments for complex functions
-   Use descriptive variable names
-   Follow existing patterns

## Performance Tips

-   Lazy load heavy libraries
-   Cache API responses
-   Use service worker keep-alive for long operations
-   Minimize DOM manipulations
-   Debounce user input

## Adding Features

1. Plan the feature (write it down)
2. Identify affected files
3. Implement in small steps
4. Test thoroughly
5. Update documentation
6. Submit PR

## Release Process

1. Update version in `manifest.json`
2. Update `CHANGELOG.md`
3. Test all features
4. Create git tag: `git tag v1.x.x`
5. Push: `git push --tags`
6. Create GitHub release

## Resources

-   [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
-   [Gemini API Docs](https://ai.google.dev/docs)
-   [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
