// Transcript Fetcher - Strategy Orchestrator
import { strategy as domAutomationStrategy } from "./strategies/dom-automation-strategy.js";
import { strategy as invidiousStrategy } from "./strategies/invidious-strategy.js";
import { strategy as speechToTextStrategy } from "./strategies/speech-to-text-strategy.js";
import { strategy as geniusStrategy } from "./strategies/genius-strategy.js";

const STRATEGIES = [
    domAutomationStrategy, // Priority 1: Automates UI to open/scrape transcript
    invidiousStrategy, // Priority 2: Invidious API
    geniusStrategy, // Priority 3: Genius Lyrics (Music Videos only)
    speechToTextStrategy, // Priority 4: Fallback (Gemini Audio Transcription)
].sort((a, b) => a.priority - b.priority);

/**
 * Fetch transcript using priority-based fallback
 * @param {string} videoId - YouTube video ID
 * @param {string} lang - Language code
 * @param {number} timeout - Timeout per strategy (ms)
 * @returns {Promise<Array>} Transcript segments
 */
export async function fetchTranscript(videoId, lang = "en", timeout = 30000) {
    let lastError;

    // Load settings to get preferred method and language
    const stored = await chrome.storage.sync.get([
        "transcriptMethod",
        "transcriptLanguage",
    ]);
    const preferredMethod = stored.transcriptMethod || "auto";
    const preferredLang = stored.transcriptLanguage || lang;

    console.log(
        `[Fetcher] Settings - Method: ${preferredMethod}, Language: ${preferredLang}`
    );

    // Clone and sort strategies based on preference
    let strategiesToTry = [...STRATEGIES];

    if (preferredMethod !== "auto") {
        const preferredStrategy = strategiesToTry.find((s) => {
            if (preferredMethod === "dom-automation") return s.name === "DOM Automation";
            if (preferredMethod === "invidious") return s.name === "Invidious API";
            if (preferredMethod === "genius") return s.name === "Genius Lyrics";
            return false;
        });

        if (preferredStrategy) {
            strategiesToTry = strategiesToTry.filter((s) => s !== preferredStrategy);
            strategiesToTry.unshift(preferredStrategy);
        }
    }

    for (const strategy of strategiesToTry) {
        try {
            console.log(`[Fetcher] Trying ${strategy.name}...`);

            // Use preferred language from settings if available, otherwise fallback to arg
            const promise = strategy.fetch(videoId, preferredLang);
            const result = await Promise.race([
                promise,
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Timeout")), timeout)
                ),
            ]);

            if (result?.length) {
                console.log(
                    `[Fetcher] ✅ ${strategy.name} succeeded: ${result.length} segments`
                );
                return result;
            }
        } catch (e) {
            lastError = e;
            console.warn(`[Fetcher] ${strategy.name} failed:`, e.message);
        }
    }

    throw new Error(
        lastError?.message || "All transcript fetch strategies failed"
    );
}
