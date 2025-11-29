// Method 1: XHR Interceptor (Fastest - Main World Injection)
export const name = 'XHR Interceptor';
export const priority = 1;

export const extract = async (videoId, lang = 'en') => {
  // Check if interceptor captured data
  const event = await waitForInterceptedData(videoId, lang, 3000);
  if (event?.detail?.segments) return event.detail.segments;
  throw new Error('No intercepted transcript data');
};

const waitForInterceptedData = (videoId, lang, timeout) =>
  new Promise(resolve => {
    const handler = e => {
      if (e.detail?.videoId === videoId || e.detail?.lang === lang) {
        window.removeEventListener('transcriptIntercepted', handler);
        resolve(e);
      }
    };
    window.addEventListener('transcriptIntercepted', handler);
    setTimeout(() => {
      window.removeEventListener('transcriptIntercepted', handler);
      resolve(null);
    }, timeout);
  });
