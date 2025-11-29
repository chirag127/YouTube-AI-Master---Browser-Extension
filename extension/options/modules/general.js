import { id as i, on } from '../../utils/shortcuts/dom.js';
import { slr as lr } from '../../utils/shortcuts/storage.js';

export class GeneralSettings {
  constructor(s, a) {
    this.s = s;
    this.a = a;
  }
  init() {
    const c = this.s.get();
    this.set('outputLanguage', c.ai?.outputLanguage || 'en');
    this.chk('autoAnalyze', c.automation?.autoAnalyze ?? true);
    this.chk('autoSummarize', c.automation?.autoSummarize ?? true);
    this.chk('autoExtractKeyPoints', c.automation?.autoExtractKeyPoints ?? true);
    this.chk('autoDetectLanguage', c.automation?.autoDetectLanguage ?? true);
    this.chk('autoLoadTranscript', c.automation?.autoLoadTranscript ?? true);
    this.chk('saveHistory', c.advanced?.saveHistory ?? true);
    this.a.attachToAll({
      outputLanguage: { path: 'ai.outputLanguage' },
      autoAnalyze: { path: 'automation.autoAnalyze' },
      autoSummarize: { path: 'automation.autoSummarize' },
      autoExtractKeyPoints: { path: 'automation.autoExtractKeyPoints' },
      autoDetectLanguage: { path: 'automation.autoDetectLanguage' },
      autoLoadTranscript: { path: 'automation.autoLoadTranscript' },
      saveHistory: { path: 'advanced.saveHistory' },
    });
    const ch = i('clearHistory');
    if (ch)
      on(ch, 'click', async () => {
        if (confirm('Clear all history? This cannot be undone.')) {
          await lr('comprehensive_history');
          this.a.notifications?.success('History cleared');
        }
      });
  }
  set(id, v) {
    const el = i(id);
    if (el) el.value = v;
  }
  chk(id, v) {
    const el = i(id);
    if (el) el.checked = v;
  }
}
