import { msg } from '../../../utils/shortcuts/runtime.js';

export async function fetchViaInvidious(v, l = 'en') {
  const r = await msg('FETCH_INVIDIOUS_TRANSCRIPT', { videoId: v, lang: l });
  if (!r.success || !r.data) throw new Error(r.error || 'Invidious API failed');
  return r.data;
}
export const strategy = { name: 'Invidious API', priority: 3, fetch: fetchViaInvidious };
