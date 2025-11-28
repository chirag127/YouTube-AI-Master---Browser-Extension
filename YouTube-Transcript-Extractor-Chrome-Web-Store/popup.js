let currentTabId;

// Function to check URL and update button visibility
function checkUrlAndButtons() {
  chrome.tabs.get(currentTabId, (tab) => {
    const fullPlayerButton = document.getElementById('fullPlayerButton');
    if (tab.url.includes('youtube.com/shorts')) {
      fullPlayerButton.style.display = 'block';
    } else {
      fullPlayerButton.style.display = 'none';
    }

    const extractButton = document.getElementById('extractButton');
    if (tab.url.includes('youtube.com/watch')) {
      extractButton.style.display = 'block';
    } else {
      extractButton.style.display = 'none';
    }
  });
}

// Initialize: get current tab and set up URL change listener
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  currentTabId = tabs[0].id;
  checkUrlAndButtons();

  // Set up a listener for URL changes
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tabId === currentTabId && changeInfo.url) {
      checkUrlAndButtons();
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const fullPlayerButton = document.getElementById("fullPlayerButton");
  const extractButton = document.getElementById("extractButton");
  const copyButton = document.getElementById("copyButton");
  const resultDiv = document.getElementById("result");

  let extractedTranscript = "";

  fullPlayerButton.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    chrome.tabs.sendMessage(tab.id, { action: "checkUrl" });
  });

  extractButton.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    chrome.tabs.sendMessage(
      tab.id,
      { action: "extractTranscript" },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          resultDiv.textContent =
            "An error occurred while extracting the transcript.";
        } else if (response && response.transcript) {
          extractedTranscript = response.transcript;
          resultDiv.textContent = extractedTranscript;
          copyButton.style.display = "block";
        } else {
          resultDiv.textContent = "No transcript found or error occurred.";
          copyButton.style.display = "none";
        }
      }
    );
  });

  copyButton.addEventListener("click", () => {
    navigator.clipboard
      .writeText(extractedTranscript)
      .then(() => {
        resultDiv.textContent = "Transcript copied to clipboard!";
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        alert("Failed to copy to clipboard. Please try again.");
      });
  });
});
