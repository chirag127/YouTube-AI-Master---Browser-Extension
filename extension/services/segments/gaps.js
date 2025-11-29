import { cw, ce } from '../../utils/shortcuts.js';

export function fillContentGaps(c, o) {
  if (!o || !o.length) {
    cw('[Gaps] No transcript provided to fillContentGaps');
    return [];
  }
  try {
    const l = o[o.length - 1];
    if (!l || typeof l.start === 'undefined') {
      cw('[Gaps] Invalid transcript format');
      return [];
    }
    const end = l.start + (l.duration || 0),
      s = (c || []).sort((a, b) => a.start - b.start),
      f = [];
    let t = 0;
    for (const seg of s) {
      if (seg.start > t + 1)
        f.push({ label: 'Content', start: t, end: seg.start, text: 'Main Content' });
      f.push({ ...seg, text: seg.description || seg.label });
      t = Math.max(t, seg.end);
    }
    if (t < end - 1) f.push({ label: 'Content', start: t, end, text: 'Main Content' });
    return f;
  } catch (x) {
    ce('[Gaps] Error in fillContentGaps:', x);
    return [];
  }
}
