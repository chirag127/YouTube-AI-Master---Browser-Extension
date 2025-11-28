import { initializeServices, getServices } from "../services.js";
import { getApiKey } from "../utils/api-key.js";

export async function handleGetCachedData(request, sendResponse) {
    const { videoId } = request;
    const apiKey = await getApiKey();
    if (apiKey) await initializeServices(apiKey);

    const { storage } = getServices();
    if (!storage) {
        sendResponse({ success: false });
        return;
    }

    try {
        const data = await storage.getVideoData(videoId);
        sendResponse({ success: true, data });
    } catch (e) {
        sendResponse({ success: false, error: e.message });
    }
}
