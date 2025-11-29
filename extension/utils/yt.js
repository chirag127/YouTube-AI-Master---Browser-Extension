import { l, e as er, now } from './shortcuts/index.js';
export const log = (m, ...a) => l(`[YT]${m}`, ...a);
export const err = (m, e) => er(`[YT]${m}`, e?.message || e);
export const ok = (m, ...a) => l(`[YT]✅${m}`, ...a);
const c = new Map();
export const cached = (k, ttl = 3e5) => ({
  get: () => {
    const i = c.get(k);
    return i && now() - i.t < ttl ? i.v : null;
  },
  set: v => c.set(k, { v, t: now() }),
});
