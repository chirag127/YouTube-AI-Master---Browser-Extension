const gu = p => chrome.runtime.getURL(p);
let slg, assign;

export const state = {
  currentVideoId: null,
  isAnalyzing: false,
  analysisData: null,
  currentTranscript: [],
  settings: {
    autoAnalyze: true,
    autoSkipSponsors: false,
    autoSkipIntros: false,
    autoLike: false,
    autoLikeThreshold: 50,
    autoLikeLive: false,
    likeIfNotSubscribed: false,
  },
};
export function resetState() {
  state.isAnalyzing = false;
  state.analysisData = null;
  state.currentTranscript = [];
}
export async function loadSettings() {
  if (!slg) {
    const storage = await import(gu('utils/shortcuts/storage.js'));
    slg = storage.slg;
    const core = await import(gu('utils/shortcuts/core.js'));
    assign = core.assign;
  }
  try {
    const r = await slg([
      'autoAnalyze',
      'autoSkipSponsors',
      'autoSkipIntros',
      'autoLike',
      'autoLikeThreshold',
      'autoLikeLive',
      'likeIfNotSubscribed',
    ]);
    assign(state.settings, r);
    return state.settings;
  } catch (e) {
    return state.settings;
  }
}
