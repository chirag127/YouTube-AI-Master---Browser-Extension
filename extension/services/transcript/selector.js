import { CAPTION_KIND, DEFAULT_LANGUAGE } from './constants.js';
import { fn } from '../../utils/shortcuts/array.js';

export function findTrackByLanguage(t, l) {
  return fn(t, x => x.languageCode === l) || null;
}
export function getManualTrack(t, l) {
  return fn(t, x => x.languageCode === l && x.kind !== CAPTION_KIND.ASR) || null;
}
export function selectBestTrack(t, l = DEFAULT_LANGUAGE) {
  if (!t || t.length === 0) return null;
  const m = getManualTrack(t, l);
  if (m) return m;
  const p = findTrackByLanguage(t, l);
  if (p) return p;
  return t[0];
}
