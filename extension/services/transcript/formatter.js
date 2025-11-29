import { mf, pd, js } from '../../utils/shortcuts.js';

export function formatTime(s) {
  const h = mf(s / 3600),
    m = mf((s % 3600) / 60),
    sc = mf(s % 60);
  return h > 0 ? `${h}:${pad(m)}:${pad(sc)}` : `${m}:${pad(sc)}`;
}
function pad(n) {
  return pd(n.toString(), 2, '0');
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
