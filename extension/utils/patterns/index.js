import { detectSponsor } from './sponsor.js';
import { detectSelfpromo } from './selfpromo.js';
import { detectInteraction } from './interaction.js';
import { detectIntro } from './intro.js';
import { detectOutro } from './outro.js';
import { detectPreview } from './preview.js';
import { detectFiller } from './filler.js';
import { detectHook } from './hook.js';
export const analyzeTranscript = t => {
  const r = {
    sponsor: [],
    selfpromo: [],
    interaction: [],
    intro: [],
    outro: [],
    preview: [],
    filler: [],
    hook: [],
  };
  r.sponsor = detectSponsor(t);
  r.selfpromo = detectSelfpromo(t);
  r.interaction = detectInteraction(t);
  r.intro = detectIntro(t);
  r.outro = detectOutro(t);
  r.preview = detectPreview(t);
  r.filler = detectFiller(t);
  r.hook = detectHook(t);
  return r;
};
export const buildPatternHints = m => {
  const h = [];
  for (const [cat, matches] of Object.entries(m)) {
    if (matches.length > 0) {
      h.push(
        `[${cat.toUpperCase()}] Detected ${matches.length} pattern(s): ${matches.map(x => x.match).join(', ')}`
      );
    }
  }
  return h.join('\n');
};
