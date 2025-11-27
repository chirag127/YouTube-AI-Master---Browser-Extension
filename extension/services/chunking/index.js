import { chunkText } from './text.js'
import { chunkSegments } from './segments.js'
export class ChunkingService {
    constructor() {
        // Increased for gemini-2.5-flash-lite-preview-09-2025 (1M token context)
        this.defaultChunkSize = 500000; // ~500K chars = ~125K tokens
        this.defaultOverlap = 1000;
    }
    chunkText(t, s, o) { return chunkText(t, s || this.defaultChunkSize, o || this.defaultOverlap) }
    chunkSegments(segs, s) { return chunkSegments(segs, s || this.defaultChunkSize) }
}
