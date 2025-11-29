// Method 3: YouTube Direct API (Legacy)
export const name = 'YouTube Direct API';
export const priority = 3;

export const extract = async (videoId, lang = 'en') => {
  const response = await chrome.runtime.sendMessage({
    action: 'FETCH_TRANSCRIPT',
    videoId,
    lang,
  });
  if (!response.success) throw new Error(response.error || 'YouTube Direct failed');
  return response.data;
};
