import { mf as mfl } from '../../utils/shortcuts/math.js';
import { pI as pS, js } from '../../utils/shortcuts/core.js';

export function formatTime(s) {
  const h = mfl(s / 3600),
    m = mfl((s % 3600) / 60),
    sc = mfl(s % 60);
  return h > 0 ? `${h}:${pad(m)}:${pad(sc)}` : `${m}:${pad(sc)}`;
}
function pad(n) {
  return pS(n.toString(), 2, '0');
}
export function formatAsPlainText(s) {
  return s.map(x => x.text).join(' ');
}
export function formatWithTimestamps(s) {
  return s.map(x => `[${formatTime(x.start)}] ${x.text}`).join('\n');
}
export function formatAsJSON(s) {
  return js(s, null, 2);
}
