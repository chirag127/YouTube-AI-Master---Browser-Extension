import { buildContextString } from "./utils.js";

export const summary = (transcript, options) => {
    const context = {
        transcript,
        metadata: options.metadata || {},
        lyrics: options.lyrics,
        comments: [],
    };

    return `
    Role: You are an expert video summarizer.
    Task: Create a concise summary of the following video transcript.

    Context:
    ${buildContextString(context)}

    Constraints:
    - Length: ${options.length || "Medium"}
    - Language: ${options.language || "English"}
    - Format: Markdown

    Transcript:
    ${transcript}
    `;
};
