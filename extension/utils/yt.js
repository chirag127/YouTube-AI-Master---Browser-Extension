import { l, e } from './shortcuts/log.js';
export const log = (m, ...a) => l(`[YT]${m}`, ...a);
export const err = (m, x) => e(`[YT]${m}`, x?.message || x);
export const ok = (m, ...a) => l(`[YT]✅${m}`, ...a);
const c = new Map();
export const cached = (k, ttl = 3e5) => ({
  get: () => {
    const i = c.get(k);
    return i && Date.now() - i.t < ttl ? i.v : null;
  },
  set: v => c.set(k, { v, t: Date.now() }),
});
