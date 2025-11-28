import { initializeServices, getServices } from "../services.js";
import { getApiKey } from "../utils/api-key.js";

export async function handleAnalyzeComments(request, sendResponse) {
    const { comments } = request;
    console.log(
        "[AnalyzeComments] Received comments count:",
        comments?.length
    );
    console.log(
        "[AnalyzeComments] First comment structure:",
        comments?.[0]
    );
    console.log(
        "[AnalyzeComments] Sample comments:",
        comments?.slice(0, 3)
    );

    const apiKey = await getApiKey();
    if (!apiKey) {
        sendResponse({ success: false, error: "API Key not configured" });
        return;
    }

    await initializeServices(apiKey);
    const { gemini } = getServices();

    console.log("[AnalyzeComments] Calling analyzeCommentSentiment...");
    const analysis = await gemini.analyzeCommentSentiment(comments);
    console.log("[AnalyzeComments] Analysis result:", analysis?.substring(0, 200));
    sendResponse({ success: true, analysis });
}
