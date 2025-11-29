// Method 5: DOM Parser (Last Resort)
export const name = 'DOM Parser';
export const priority = 5;

export const extract = async (videoId, lang = 'en') => {
  // Try ytInitialPlayerResponse
  if (window.ytInitialPlayerResponse?.captions) {
    const captions = window.ytInitialPlayerResponse.captions;
    const tracks = captions.playerCaptionsTracklistRenderer?.captionTracks;
    if (tracks) {
      const track = tracks.find(t => t.languageCode === lang) || tracks[0];
      if (track?.baseUrl) {
        const segments = await fetchAndParse(track.baseUrl);
        if (segments.length > 0) return segments;
      }
    }
  }

  // Try transcript panel if open
  const panel = document.querySelector('#segments-container');
  if (panel) {
    const segments = parseTranscriptPanel(panel);
    if (segments.length > 0) return segments;
  }

  throw new Error('DOM parsing failed');
};

const fetchAndParse = async url => {
  try {
    const res = await fetch(url);
    const text = await res.text();
    return parseVTT(text);
  } catch (e) {
    return [];
  }
};

const parseVTT = vtt => {
  const segments = [];
  const lines = vtt.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line.includes('-->')) {
      const [start, end] = line.split('-->').map(t => parseTime(t.trim()));
      i++;
      let text = '';
      while (i < lines.length && lines[i].trim() && !lines[i].includes('-->')) {
        text += lines[i].trim() + ' ';
        i++;
      }
      text = text.trim().replace(/<[^>]+>/g, '');
      if (text) segments.push({ start, duration: end - start, text });
    }
    i++;
  }
  return segments;
};

const parseTime = t => {
  const parts = t.split(':');
  if (parts.length === 3) {
    const [h, m, s] = parts;
    return parseFloat(h) * 3600 + parseFloat(m) * 60 + parseFloat(s);
  }
  if (parts.length === 2) {
    const [m, s] = parts;
    return parseFloat(m) * 60 + parseFloat(s);
  }
  return parseFloat(parts[0]);
};

const parseTranscriptPanel = panel => {
  const segments = [];
  const items = panel.querySelectorAll('ytd-transcript-segment-renderer');
  items.forEach(item => {
    const timeEl = item.querySelector('[class*="time"]');
    const textEl = item.querySelector('[class*="segment-text"]');
    if (timeEl && textEl) {
      const start = parseTimeString(timeEl.textContent);
      segments.push({ start, duration: 0, text: textEl.textContent.trim() });
    }
  });
  return segments;
};

const parseTimeString = str => {
  const parts = str.split(':').map(p => parseInt(p, 10));
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
};
