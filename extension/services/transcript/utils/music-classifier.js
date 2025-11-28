import { GeminiClient } from "../../../api/gemini-client.js";

/**
 * Classify if a video is a music video using Gemini
 * @param {string} title - Video title
 * @param {string} channel - Channel name
 * @returns {Promise<boolean>}
 */
export async function isMusicVideo(title, channel) {
    try {
        const settings = await chrome.storage.sync.get(["apiKey", "model"]);
        if (!settings.apiKey) return false;

        const client = new GeminiClient(settings.apiKey);
        let model = settings.model || "gemini-2.5-flash-preview-09-2025";

        // Strip models/ prefix if present
        if (model.startsWith('models/')) {
            model = model.replace('models/', '');
        }

        const prompt = `
            Analyze this YouTube video metadata:
            Title: "${title}"
            Channel: "${channel}"

            Is this a music video (official music video, lyric video, or audio track)?
            Return ONLY "true" or "false".
        `;

        const result = await client.generateContent(prompt, model);
        return result.trim().toLowerCase() === "true";
    } catch (e) {
        console.warn("[MusicClassifier] Failed to classify:", e);
        return false;
    }
}
