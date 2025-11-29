export async function getApiKey() {
  const s = await chrome.storage.sync.get('apiKey');
  if (s.apiKey) return s.apiKey;
  const l = await chrome.storage.local.get('geminiApiKey');
  return l.geminiApiKey || null;
}
