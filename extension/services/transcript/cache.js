import { sw } from '../../utils/shortcuts.js';

const c = new Map();
function k(v, l) {
  return `${v}_${l}`;
}
export function getCached(v, l) {
  return c.get(k(v, l)) || null;
}
export function setCached(v, l, t) {
  c.set(k(v, l), t);
}
export function clearVideo(v) {
  for (const k of c.keys()) {
    if (sw(k, v)) c.delete(k);
  }
}
export function clearAll() {
  c.clear();
}
