// Method 2: Invidious API (Primary Backup)
export const name = 'Invidious API';
export const priority = 2;

export const extract = async (videoId, lang = 'en') => {
  const response = await chrome.runtime.sendMessage({
    action: 'FETCH_INVIDIOUS_TRANSCRIPT',
    videoId,
    lang,
  });
  if (!response.success) throw new Error(response.error || 'Invidious failed');
  return response.data;
};
