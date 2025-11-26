# YouTube AI Master - Browser Extension

**YouTube AI Master** is a powerful Chromium-based browser extension that leverages the **Google Gemini Free API** to revolutionize how you interact with YouTube videos. It provides intelligent summaries, segment classification, and an interactive chat interface for video content.

## Features

*   **Dynamic Model Selection**: Automatically fetches available Gemini models and selects the best one based on token limits.
*   **Smart Summarization**: Generates concise summaries of video content with customizable length and language.
*   **Segment Classification**: Identifies and labels video segments (e.g., Sponsor, Content, Intro) using AI.
*   **Interactive Chat**: Chat with the video to ask questions and get answers based on the transcript.
*   **Insights Dashboard**: View top comments analysis (sentiment) and auto-generated FAQs.
*   **Transcript History**: Saves video transcripts and metadata for future reference.
*   **Click-to-Seek**: Jump to specific timestamps directly from the transcript or segment list.
*   **Modular Architecture**: Clean, maintainable codebase with separated services and UI components.

## Installation

1.  Clone this repository.
2.  Open Chrome/Edge/Brave and navigate to `chrome://extensions`.
3.  Enable **Developer Mode** (toggle in the top right).
4.  Click **Load unpacked**.
5.  Select the `extension` folder from this repository.

## Usage

1.  **API Key Setup**:
    *   Click the extension icon and select "Options" (or right-click > Options).
    *   Enter your Google Gemini API Key.
2.  **Analyze a Video**:
    *   Open a YouTube video.
    *   Open the Side Panel (via the browser toolbar).
    *   The extension will automatically fetch the transcript and metadata.
3.  **Interact**:
    *   View the summary and classified segments.
    *   Click on any segment timestamp to seek the video.
    *   Use the chat interface to ask questions about the video.

## Development

### Prerequisites

*   Node.js & npm

### Setup

```bash
npm install
```

### Testing

Run the test suite (Vitest):

```bash
npm test
```

### Linting & Formatting

Uses Biome for fast linting and formatting:

```bash
npm run lint      # Check for issues
npm run format    # Format code
npm run lint:fix  # Auto-fix issues
```

## Project Structure

*   `extension/`: Core extension files.
    *   `background/`: Service worker.
    *   `content/`: Content scripts for DOM interaction.
    *   `popup/`: Extension popup UI.
    *   `sidepanel/`: Main UI logic.
    *   `options/`: Options page.
    *   `services/`: Core logic (Gemini, Transcript, Storage).
*   `docs/`: Documentation and task lists.

## License

MIT
