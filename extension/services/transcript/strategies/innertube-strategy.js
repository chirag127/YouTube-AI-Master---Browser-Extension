// InnerTube Transcript Strategy - Priority 0 (PRIMARY)
// Uses message passing to background script where YouTube.js is loaded

export const strategy = {
    name: 'InnerTube API',
    priority: 0,

    async fetch(videoId, lang = 'en') {
        try {
            console.log(`[InnerTube] Fetching transcript: ${videoId} (${lang})`);

            const response = await chrome.runtime.sendMessage({
                action: 'INNERTUBE_GET_TRANSCRIPT',
                videoId,
                lang
            });

            if (!response.success) {
                throw new Error(response.error || 'InnerTube fetch failed');
            }

            console.log(`[InnerTube] ✅ ${response.segments.length} segments fetched`);
            return response.segments;

        } catch (e) {
            console.error('[InnerTube] ❌ Transcript fetch failed:', e);
            throw e;
        }
    }
};
