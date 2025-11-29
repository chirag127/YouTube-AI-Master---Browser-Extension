export const sg = k => chrome.storage.sync.get(k);
export const ss = (k, v) => chrome.storage.sync.set(typeof k === 'string' ? { [k]: v } : k);
export const sr = k => chrome.storage.sync.remove(k);
export const sc = () => chrome.storage.sync.clear();
export const lg = k => chrome.storage.local.get(k);
export const ls = (k, v) => chrome.storage.local.set(typeof k === 'string' ? { [k]: v } : k);
export const lr = k => chrome.storage.local.remove(k);
export const lc = () => chrome.storage.local.clear();
