import { rp, tr } from '../../utils/shortcuts/string.js';
import { fn } from '../../utils/shortcuts/array.js';

export function cleanText(t) {
  return tr(rp(rp(t, /\s+/g, ' '), /\[.*?\]/g, ''));
}
export function splitIntoChunks(s, m = 2000) {
  const c = [];
  let cur = '';
  for (const seg of s) {
    const t = seg.text + ' ';
    if (cur.length + t.length > m) {
      if (cur) c.push(tr(cur));
      cur = t;
    } else cur += t;
  }
  if (cur) c.push(tr(cur));
  return c;
}
export function findSegmentAtTime(s, t) {
  return fn(s, x => t >= x.start && t < x.start + x.duration) || null;
}
