import { initializeServices, getServices } from "../services.js";
import { getApiKey } from "../utils/api-key.js";

export async function handleClassifySegments(request, sendResponse) {
    const { transcript, settings } = request;
    const apiKey = settings?.apiKey || (await getApiKey());
    if (!apiKey) {
        sendResponse({ success: false, error: "API Key not configured" });
        return;
    }

    await initializeServices(apiKey);
    const { segmentClassification } = getServices();

    const segments = await segmentClassification.classifyTranscript({
        transcript,
        metadata: {},
    });
    sendResponse({ success: true, data: segments });
}
