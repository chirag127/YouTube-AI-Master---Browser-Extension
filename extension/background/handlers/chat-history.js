import { initializeServices, getServices } from "../services.js";
import { getApiKey } from "../utils/api-key.js";

export async function handleSaveChatMessage(request, sendResponse) {
    const { videoId, message } = request;
    const apiKey = await getApiKey();
    if (apiKey) await initializeServices(apiKey);

    const { storage } = getServices();
    if (storage) {
        await storage.saveChatMessage(videoId, message);
    }
    sendResponse({ success: true });
}
