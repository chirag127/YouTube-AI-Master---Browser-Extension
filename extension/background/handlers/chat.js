import { initializeServices, getServices } from "../services.js";
import { getApiKey } from "../utils/api-key.js";

export async function handleChatWithVideo(request, sendResponse) {
    const { question, context, metadata } = request;
    const apiKey = await getApiKey();
    if (!apiKey) {
        sendResponse({ success: false, error: "API Key not configured" });
        return;
    }

    await initializeServices(apiKey);
    const { gemini } = getServices();

    const contextString = `Video Metadata:\nTitle: ${
        metadata?.title || "Unknown"
    }\nChannel: ${
        metadata?.author || "Unknown"
    }\n\nTranscript Context:\n${context}\n`;
    const answer = await gemini.chatWithVideo(question, contextString, null);
    sendResponse({ success: true, answer });
}
