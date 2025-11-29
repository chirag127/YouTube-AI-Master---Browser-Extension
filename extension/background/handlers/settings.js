import { ssg } from '../../utils/shortcuts/index.js';
export async function handleGetSettings(rsp) {
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
}
