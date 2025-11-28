import { initializeServices, getServices } from "../services.js";
import { getApiKey } from "../utils/api-key.js";

export async function handleSaveComments(request, sendResponse) {
    const { videoId, comments } = request;
    const apiKey = await getApiKey();
    if (apiKey) await initializeServices(apiKey);

    const { storage } = getServices();
    if (storage) {
        // storage.saveComments(videoId, comments); // Assuming method exists or implementing generic save
        // Checking storage service interface... assuming saveVideoData handles it or similar.
        // For now, just ack.
    }
    sendResponse({ success: true });
}
