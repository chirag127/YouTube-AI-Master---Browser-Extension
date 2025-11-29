// Method 4: Background Proxy (CORS Fallback)
export const name = 'Background Proxy';
export const priority = 4;

export const extract = async (videoId, lang = 'en') => {
  // Proxy through background to bypass CORS
  const response = await chrome.runtime.sendMessage({
    action: 'FETCH_TRANSCRIPT',
    videoId,
    lang,
    useProxy: true,
  });
  if (!response.success) throw new Error(response.error || 'Proxy failed');
  return response.data;
};
