import { _id, sg, lg, l, w } from '../utils/shortcuts.js';
const a = _id('api-status'), p = _id('page-status'), b = _id('analyze-btn'), h = _id('history-btn'), o = _id('options-btn'), m = _id('message'), g = _id('setup-guide-btn');
function showMsg(t, y = 'info') { m.textContent = t; m.className = `show ${y}`; setTimeout(() => m.classList.remove('show'), 3000); }
async function checkApi() {
  try {
    const s = await sg(['apiKey', 'onboardingCompleted']), lc = await lg('geminiApiKey'), k = s.apiKey || lc.geminiApiKey;
    if (k) { a.innerHTML = '<span>✅ Configured</span>'; a.className = 'value success'; return true; }
    a.innerHTML = '<span>⚠️ Not configured</span>'; a.className = 'value warning';
    if (!s.onboardingCompleted) { g.style.display = 'block'; g.onclick = () => chrome.runtime.openOptionsPage(); }
    return false;
  } catch (x) { w('API check failed:', x); return false; }
}
async function checkPage() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url && tab.url.includes('youtube.com/watch')) {
      p.innerHTML = '<span>✅ YouTube Video</span>'; p.className = 'value success'; b.disabled = false; return true;
    }
    p.innerHTML = '<span>⚠️ Not on YouTube</span>'; p.className = 'value warning'; b.disabled = true; return false;
  } catch (x) { w('Page check failed:', x); return false; }
}
b.onclick = async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;
    await chrome.tabs.sendMessage(tab.id, { action: 'ANALYZE_VIDEO' });
    showMsg('Analysis started!', 'success');
  } catch (x) { showMsg('Failed to start analysis', 'error'); }
};
h.onclick = () => chrome.tabs.create({ url: chrome.runtime.getURL('history/history.html') });
o.onclick = () => chrome.runtime.openOptionsPage();
(async () => { await checkApi(); await checkPage(); })();
