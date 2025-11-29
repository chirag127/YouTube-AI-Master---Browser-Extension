import { id, ss, sl, l, cw, ct, url, cr, st } from '../utils/shortcuts.js';
const a = id('api-status'),
  p = id('page-status'),
  b = id('analyze-btn'),
  h = id('history-btn'),
  o = id('options-btn'),
  m = id('message'),
  g = id('setup-guide-btn');
function showMsg(t, y = 'info') {
  m.textContent = t;
  m.className = `show ${y}`;
  st(() => m.classList.remove('show'), 3000);
}
async function checkApi() {
  try {
    const s = await ss.get(['apiKey', 'onboardingCompleted']),
      lc = await sl.get('geminiApiKey'),
      k = s.apiKey || lc.geminiApiKey;
    if (k) {
      a.innerHTML = '<span>✅ Configured</span>';
      a.className = 'value success';
      return true;
    }
    a.innerHTML = '<span>⚠️ Not configured</span>';
    a.className = 'value warning';
    if (!s.onboardingCompleted) {
      g.style.display = 'block';
      g.onclick = () => cr.openOptionsPage();
    }
    return false;
  } catch (x) {
    cw('API check failed:', x);
    return false;
  }
}
async function checkPage() {
  try {
    const [t] = await ct.query({ active: true, currentWindow: true });
    if (t && t.url && t.url.includes('youtube.com/watch')) {
      p.innerHTML = '<span>✅ YouTube Video</span>';
      p.className = 'value success';
      b.disabled = false;
      return true;
    }
    p.innerHTML = '<span>⚠️ Not on YouTube</span>';
    p.className = 'value warning';
    b.disabled = true;
    return false;
  } catch (x) {
    cw('Page check failed:', x);
    return false;
  }
}
b.onclick = async () => {
  try {
    const [t] = await ct.query({ active: true, currentWindow: true });
    if (!t) return;
    await ct.sendMessage(t.id, { action: 'ANALYZE_VIDEO' });
    showMsg('Analysis started!', 'success');
  } catch (x) {
    showMsg('Failed to start analysis', 'error');
  }
};
h.onclick = () => ct.create({ url: url('history/history.html') });
o.onclick = () => cr.openOptionsPage();
(async () => {
  await checkApi();
  await checkPage();
})();
