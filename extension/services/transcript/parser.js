import { $$, ce } from '../../utils/shortcuts/dom.js';
import { jp } from '../../utils/shortcuts/core.js';
export const extractCaptionTracks = pr => {
  if (!pr?.captions) return [];
  const r = pr.captions.playerCaptionsTracklistRenderer;
  return r?.captionTracks || [];
};
export const getPlayerResponse = () => {
  if (window.ytInitialPlayerResponse) return window.ytInitialPlayerResponse;
  const scripts = $$('script');
  for (const script of scripts) {
    const match = script.textContent?.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
    if (match) {
      try {
        return jp(match[1]);
      } catch (x) {
        ce('Failed to parse ytInitialPlayerResponse:', x);
      }
    }
  }
  return null;
};
