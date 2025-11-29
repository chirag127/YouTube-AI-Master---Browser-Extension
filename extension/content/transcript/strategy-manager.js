import * as domAutomation from './strategies/dom-automation.js';
import * as genius from './strategies/genius.js';
import * as speechToText from './strategies/speech-to-text.js';
import { lg, wn, er } from '../../utils/shortcuts/log.js';

const strategies = [domAutomation, genius, speechToText].sort((a, b) => a.priority - b.priority);

export const extractTranscript = async (vid, lang = 'en') => {
  lg(`[Transcript] Starting extraction for ${vid}, lang: ${lang}`);
  let err = null;
  for (const s of strategies) {
    try {
      lg(`[Transcript] Trying: ${s.name}`);
      const r = await s.extract(vid, lang);
      if (r && r.length > 0) {
        lg(`[Transcript] ✅ ${s.name} succeeded: ${r.length} segments`);
        return { success: true, data: r, method: s.name };
      }
    } catch (x) {
      err = x;
      wn(`[Transcript] ${s.name} failed:`, x.message);
    }
  }
  er('[Transcript] All methods failed');
  return { success: false, error: err?.message || 'All extraction methods failed' };
};

export const getAvailableStrategies = () =>
  strategies.map(s => ({
    name: s.name,
    priority: s.priority,
  }));
