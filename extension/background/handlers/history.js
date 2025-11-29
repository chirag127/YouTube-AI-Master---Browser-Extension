import { slg, sls, now } from '../../utils/shortcuts/index.js';

export async function handleSaveToHistory(req, rsp) {
  const { videoId, title, summary, timestamp } = req.data || req;
  const res = await slg('summaryHistory');
  const h = res.summaryHistory || [];
  h.unshift({ videoId, title, summary, timestamp: timestamp || now() });
  await sls({ summaryHistory: h.slice(0, 100) });
  rsp({ success: true });
}
