import { classifyTranscript } from "./classifier.js";
import { fillContentGaps } from "./gaps.js";
export class SegmentClassificationService {
    constructor(g, c) {
        this.gemini = g;
        this.chunking = c;
    }
    async classifyTranscript(context) {
        const c = await classifyTranscript(context, this.gemini);
        return fillContentGaps(c, context.transcript);
    }
}
