chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "convertToWatch") {
    const watchUrl = `https://www.youtube.com/watch?v=${request.videoId}`;
    chrome.tabs.update(sender.tab.id, { url: watchUrl });
  }
});
