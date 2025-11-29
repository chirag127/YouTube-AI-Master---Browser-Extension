import { ssg, slg } from '../../utils/shortcuts/index.js';

export async function getApiKey() {
  const s = await ssg('apiKey');
  if (s.apiKey) return s.apiKey;
  const l = await slg('geminiApiKey');
  return l.geminiApiKey || null;
}
