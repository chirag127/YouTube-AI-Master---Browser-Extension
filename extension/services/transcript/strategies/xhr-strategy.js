// XHR Interceptor Strategy
// Priority: 2 (Fast if available, but less reliable than direct API)
// Captures live network requests via event communication with Main World interceptor

class XHRStrategy {
    constructor() {
        this.name = "XHR Interceptor";
        this.priority = 2;
        this.interceptedTranscripts = new Map();
        this.logger = this._createLogger("XHR-Strategy");

        this._initListener();
    }

    _createLogger(prefix) {
        return {
            info: (msg, ...args) =>
                console.log(`[${prefix}] ℹ️ ${msg}`, ...args),
            success: (msg, ...args) =>
                console.log(`[${prefix}] ✅ ${msg}`, ...args),
            warn: (msg, ...args) =>
                console.warn(`[${prefix}] ⚠️ ${msg}`, ...args),
            error: (msg, ...args) =>
                console.error(`[${prefix}] ❌ ${msg}`, ...args),
            debug: (msg, ...args) =>
                console.debug(`[${prefix}] 🔍 ${msg}`, ...args),
        };
    }

    _initListener() {
        window.addEventListener("transcriptIntercepted", (e) => {
            const { lang, videoId, segments } = e.detail;
            if (segments && segments.length > 0) {
                const key = `${videoId || "current"}_${lang}`;
                this.interceptedTranscripts.set(key, segments);
                this.logger.success(
                    `Received intercepted transcript for ${lang} (${segments.length} segments)`
                );
            }
        });
    }

    async fetch(videoId, lang = "en") {
        const key = `${videoId}_${lang}`;
        const currentKey = `current_${lang}`;

        // Check cache first
        if (this.interceptedTranscripts.has(key)) {
            return this.interceptedTranscripts.get(key);
        }
        if (this.interceptedTranscripts.has(currentKey)) {
            return this.interceptedTranscripts.get(currentKey);
        }

        // If not in cache, query the interceptor
        this.logger.info("Transcript not in cache, querying interceptor...");

        return new Promise((resolve, reject) => {
            // Set up a one-time listener for the response
            const handleResponse = (e) => {
                const {
                    lang: resLang,
                    videoId: resVideoId,
                    segments,
                } = e.detail;

                // Check if this response matches our request
                // We accept 'current' videoId if the requested one matches or is null
                const isMatch =
                    resLang === lang &&
                    (resVideoId === videoId ||
                        resVideoId === null ||
                        videoId === null);

                if (isMatch && segments && segments.length > 0) {
                    window.removeEventListener(
                        "transcriptIntercepted",
                        handleResponse
                    );
                    clearTimeout(timeoutId);

                    // Cache it
                    const cacheKey = `${resVideoId || "current"}_${resLang}`;
                    this.interceptedTranscripts.set(cacheKey, segments);

                    resolve(segments);
                }
            };

            window.addEventListener("transcriptIntercepted", handleResponse);

            // Dispatch query
            window.dispatchEvent(
                new CustomEvent("YTAI_QUERY_INTERCEPTOR", {
                    detail: { videoId, lang },
                })
            );

            // Timeout after 2 seconds
            const timeoutId = setTimeout(() => {
                window.removeEventListener(
                    "transcriptIntercepted",
                    handleResponse
                );
                reject(
                    new Error("No intercepted transcript available (timeout)")
                );
            }, 2000);
        });
    }
}

export const strategy = new XHRStrategy();
