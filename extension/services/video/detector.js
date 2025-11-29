import { m, loc } from '../../utils/shortcuts.js';

export function extractVideoId(u) {
  const ps = [/[?&]v=([^&]+)/, /\/embed\/([^/?]+)/, /\/v\/([^/?]+)/, /youtu\.be\/([^/?]+)/];
  for (const p of ps) {
    const r = m(u, p);
    if (r) return r[1];
  }
  return null;
}
export function getCurrentVideoId() {
  return extractVideoId(loc.href);
}
export function isVideoPage() {
  return loc.pathname === '/watch';
}
