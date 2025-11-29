import { jp, isS } from '../../../utils/shortcuts/core.js';
import { fl, mp, jn } from '../../../utils/shortcuts/array.js';
import { tr } from '../../../utils/shortcuts/string.js';

export const parse = d => {
  if (isS(d)) d = jp(d);
  if (!d.events) return [];
  return fl(
    mp(
      fl(d.events, e => e.segs),
      e => ({
        start: e.tStartMs / 1000,
        duration: (e.dDurationMs || 0) / 1000,
        text: jn(
          mp(e.segs, s => s.utf8),
          ''
        ),
      })
    ),
    s => tr(s.text)
  );
};
