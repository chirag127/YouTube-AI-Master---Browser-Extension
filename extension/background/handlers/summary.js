import { initializeServices, getServices } from "../services.js";
import { getApiKey } from "../utils/api-key.js";

export async function handleGenerateSummary(request, sendResponse) {
    const { transcript, settings, metadata } = request;
    const apiKey = settings?.apiKey || (await getApiKey());
    if (!apiKey) {
        sendResponse({ success: false, error: "API Key not configured" });
        return;
    }

    await initializeServices(apiKey);
    const { gemini } = getServices();

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, "0")}`;
    };

    const transcriptString = Array.isArray(transcript)
        ? transcript.map((t) => `[${formatTime(t.start)}] ${t.text}`).join("\n")
        : transcript;

    const contextString = `Video Metadata:\nTitle: ${
        metadata?.title || "Unknown"
    }\nChannel: ${
        metadata?.author || "Unknown"
    }\n\nTranscript:\n${transcriptString}\n`;

    const summary = await gemini.generateSummary(
        contextString,
        settings?.customPrompt,
        settings?.model,
        {
            length: settings?.summaryLength,
            language: settings?.outputLanguage,
        }
    );

    sendResponse({ success: true, data: summary });
}
