chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkUrl") {
    checkUrlForShorts();
  } else if (request.action === "extractTranscript") {
    (async () => {
      try {
        showTranscriptContainer();
        const transcript = await extractTranscript();
        hideTranscriptContainer();
        sendResponse({ transcript });
      } catch (error) {
        console.error('Error extracting transcript:', error);
        sendResponse({ error: 'Failed to extract transcript' });
      }
    })();
    return true;
  }
});

function checkUrlForShorts() {
  const currentUrl = window.location.href;
  const shortsUrlRegex =
    /https:\/\/(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]+)(?:\?.*)?$/;
  const match = currentUrl.match(shortsUrlRegex);

  if (match) {
    const videoId = match[1];
    chrome.runtime.sendMessage({ action: "convertToWatch", videoId: videoId });
  }
}

async function extractTranscript() {
  await showTranscript();
  
  const segmentTexts = document.querySelectorAll(".segment-text");
  const transcript = [];

  segmentTexts.forEach((segment) => {
    const text = segment.textContent.trim();
    const timestampElement = segment
      .closest(".segment")
      .querySelector(".segment-timestamp");
    const timestamp = timestampElement
      ? timestampElement.textContent.trim()
      : "";
    transcript.push(`${timestamp}: ${text}`);
  });

  return transcript.join("\n");
}

function hideTranscriptContainer() {
  const transcriptContainer = document.querySelector('#secondary #secondary-inner #panels');
  if (transcriptContainer) {
    transcriptContainer.style.display = "none";
  }
}
function showTranscriptContainer() {
  const transcriptContainer = document.querySelector('#secondary #secondary-inner #panels');
  if (transcriptContainer) {
    if(transcriptContainer.style.display === "none") {
      transcriptContainer.style.display = 'unset';
    }
  }
}

function waitForElement(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

async function waitForDocumentLoad() {
  return new Promise((resolve) => {
    if (document.readyState === "complete") {
      resolve();
    } else {
      window.addEventListener("load", resolve);
    }
  });
}

async function clickMoreButton() {
  const moreButton = await waitForElement("tp-yt-paper-button#expand");
  if (moreButton) {
    moreButton.click();
  } else {
    console.log("More button not found");
  }
}

async function clickShowTranscriptButton() {
  const showTranscriptButton = await waitForElement(
    '#primary-button button[aria-label="Show transcript"]'
  );
  if (showTranscriptButton) {
    showTranscriptButton.click();
  } else {
    console.log("Show transcript button not found");
  }
}

async function showTranscript(timeout = 2000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    await clickMoreButton();
    await clickShowTranscriptButton();

    const transcriptTextContent = document.querySelector(".segment-text");
    if (transcriptTextContent) {
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 400));
  }

  throw new Error("Timeout: Transcript container not found within the specified time.");
}

async function main() {}

main();

console.log("Hello from the console logger extension!");
