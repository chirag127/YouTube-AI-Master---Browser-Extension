import { sg as ssg } from '../../utils/shortcuts/storage.js';
import { e } from '../../utils/shortcuts/log.js';
export async function handleGetSettings(rsp) {
  try {
    const s = await ssg([
      'apiKey',
      'model',
      'summaryLength',
      'outputLanguage',
      'customPrompt',
      'enableSegments',
      'autoSkipSponsors',
      'autoSkipIntros',
      'saveHistory',
    ]);
    rsp({ success: true, data: s });
  } catch (x) {
    e('GetSettings:', x);
    rsp({ success: false, error: x.message });
  }
}
