export async function handleGetSettings(sendResponse) {
    const settings = await chrome.storage.sync.get([
        "apiKey",
        "model",
        "summaryLength",
        "outputLanguage",
        "customPrompt",
        "enableSegments",
        "autoSkipSponsors",
        "autoSkipIntros",
        "saveHistory",
    ]);
    sendResponse({ success: true, data: settings });
}
