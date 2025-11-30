const gu = p => chrome.runtime.getURL(p);

const { e } = await import(gu('utils/shortcuts/log.js'));
const { qs: $, ce } = await import(gu('utils/shortcuts/dom.js'));
const { CM: colors, LM } = await import(gu('utils/shortcuts/segments.js'));
export const renderTimeline = (segs, dur) => {
  try {
    const bar = $('.ytp-progress-bar-container');
    if (!bar) return;
    const ex = $('#yt-ai-timeline-markers');
    if (ex) ex.remove();
    const c = ce('div');
    c.id = 'yt-ai-timeline-markers';
    c.style.cssText =
      'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:40';
    segs.forEach(s => {
      const m = ce('div');
      const left = (s.start / dur) * 100,
        w = ((s.end - s.start) / dur) * 100;
      m.style.cssText = `position:absolute;left:${left}%;width:${w}%;height:100%;background:${colors[s.label] || '#999'};opacity:0.6;pointer-events:auto;cursor:pointer`;
      m.title = `${LM[s.label] || s.label}: ${s.description}`;
      m.onclick = () => {
        const v = $('video');
        if (v) v.currentTime = s.start;
      };
      c.appendChild(m);
    });
    bar.appendChild(c);
  } catch (err) {
    e('Err:renderTimeline', err);
  }
};
export const clearTimeline = () => {
  try {
    const ex = $('#yt-ai-timeline-markers');
    if (ex) ex.remove();
  } catch (err) {
    e('Err:clearTimeline', err);
  }
};
