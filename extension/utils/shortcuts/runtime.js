export const rm = m => chrome.runtime.sendMessage(m);
export const ol = c => chrome.runtime.onMessage.addListener(c);
export const s = chrome.storage.local;
export const st = chrome.storage.sync;
export const t = chrome.tabs;
export const w = chrome.windows;
