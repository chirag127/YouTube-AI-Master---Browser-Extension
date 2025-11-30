const gu = p => chrome.runtime.getURL(p);

const { e } = await import(gu('utils/shortcuts/log.js'));
const { oe } = await import(gu('utils/shortcuts/core.js'));
const { mp, jn } = await import(gu('utils/shortcuts/array.js'));
const { qs, ce } = await import(gu('utils/shortcuts/dom.js'));
const { CM: colors, LM } = await import(gu('utils/shortcuts/segments.js'));
export const renderLegend = () => {
  try {
    const h = jn(
      mp(
        oe(colors),
        ([apiLabel, c]) =>
          `<div class="seg-legend-item"><span class="seg-color" style="background:${c}"></span><span>${LM[apiLabel] || apiLabel}</span></div>`
      ),
      ''
    );
    return `<div class="seg-legend"><div class="seg-legend-title">Segment Types</div>${h}</div>`;
  } catch (err) {
    e('Err:renderLegend', err);
    return '';
  }
};
export const injectLegendStyles = () => {
  try {
    if (qs('#yt-ai-legend-styles')) return;
    const s = ce('style');
    s.id = 'yt-ai-legend-styles';
    s.textContent = `.seg-legend{margin:10px 0;padding:10px;background:#0f0f0f;border-radius:8px}.seg-legend-title{font-weight:600;margin-bottom:8px;font-size:13px}.seg-legend-item{display:flex;align-items:center;gap:8px;margin:4px 0;font-size:12px}.seg-color{width:16px;height:16px;border-radius:3px;display:inline-block}`;
    document.head.appendChild(s);
  } catch (err) {
    e('Err:injectLegendStyles', err);
  }
};
