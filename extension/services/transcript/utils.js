// Transcript utility functions

/**
 * Clean transcript text
 * @param {string} text - Raw transcript text
 * @returns {string} Cleaned text
 */
export function cleanText(text) {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\[.*?\]/g, '')
        .trim();
}

/**
 * Split transcript into chunks
 * @param {Array} segments - Transcript segments
 * @param {number} maxChunkSize - Max characters per chunk
 * @returns {Array} Text chunks
 */
export function splitIntoChunks(segments, maxChunkSize = 2000) {
    const chunks = [];
    let currentChunk = '';

    for (const segment of segments) {
        const text = segment.text + ' ';

        if (currentChunk.length + text.length > maxChunkSize) {
            if (currentChunk) {
                chunks.push(currentChunk.trim());
            }
            currentChunk = text;
        } else {
            currentChunk += text;
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}

/**
 * Find segment at specific time
 * @param {Array} segments - Transcript segments
 * @param {number} time - Time in seconds
 * @returns {Object|null} Segment at time or null
 */
export function findSegmentAtTime(segments, time) {
    return segments.find(seg =>
        time >= seg.start &&
        time < seg.start + seg.duration
    ) || null;
}
