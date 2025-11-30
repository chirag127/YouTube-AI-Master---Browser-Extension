import { initializeServices, getServices } from '../services.js';
import { getApiKey } from '../utils/api-key.js';
import { e } from '../../utils/shortcuts/log.js';
export async function handleAnalyzeComments(req, rsp) {
  try {
    const { comments: c } = req;
    const k = await getApiKey();
    if (!k) {
      rsp({ success: false, error: 'API Key not configured' });
      return;
    }
    await initializeServices(k);
    const { gemini: g } = getServices();
    const a = await g.analyzeCommentSentiment(c);
    rsp({ success: true, analysis: a });
  } catch (err) {
    e('Err:AC', err);
    rsp({ success: false, error: err.message });
  }
}
