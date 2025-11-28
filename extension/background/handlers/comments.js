import { initializeServices, getServices } from "../services.js";
import { getApiKey } from "../utils/api-key.js";

export async function handleAnalyzeComments(request, sendResponse) {
    const { comments } = request;
    const apiKey = await getApiKey();
    if (!apiKey) {
        sendResponse({ success: false, error: "API Key not configured" });
        return;
    }

    await initializeServices(apiKey);
    const { gemini } = getServices();

    const analysis = await gemini.analyzeCommentSentiment(comments);
    sendResponse({ success: true, analysis });
}
