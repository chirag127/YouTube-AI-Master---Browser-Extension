export async function handleSaveToHistory(request, sendResponse) {
    const { videoId, title, summary, timestamp } = request.data || request;
    const result = await chrome.storage.local.get("summaryHistory");
    const history = result.summaryHistory || [];
    history.unshift({
        videoId,
        title,
        summary,
        timestamp: timestamp || Date.now(),
    });
    await chrome.storage.local.set({ summaryHistory: history.slice(0, 100) });
    sendResponse({ success: true });
}
