// JSON3 Transcript Parser (YouTube JSON3 format)
// Used by YouTube's official timedtext API responses

/**
 * Parse YouTube JSON3 transcript format
 * @param {Object} data - JSON3 response with events array
 * @returns {Array} Normalized transcript segments
 *
 * Format:
 * {
 *   "events": [
 *     {
 *       "tStartMs": 120,        // Start time in milliseconds
 *       "dDurationMs": 3559,    // Duration in milliseconds
 *       "wWinId": 1,            // Window ID
 *       "segs": [               // Text segments with word-level timing
 *         {"utf8": "I'm", "acAsrConf": 0},
 *         {"utf8": " about", "tOffsetMs": 160, "acAsrConf": 0}
 *       ]
 *     }
 *   ]
 * }
 */
export function parseJSON3(data) {
    if (!data?.events) return []

    return data.events
        .filter(e => e.segs && Array.isArray(e.segs))
        .map(e => ({
            start: e.tStartMs / 1000,
            duration: (e.dDurationMs || 0) / 1000,
            text: e.segs
                .map(s => s.utf8 || '')
                .join('')
                .trim()
        }))
        .filter(seg => seg.text.length > 0) // Remove empty segments
}
