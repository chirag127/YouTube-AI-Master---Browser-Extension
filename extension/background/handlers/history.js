import { lg, ls, nt } from '../../utils/shortcuts.js';

export async function handleSaveToHistory(req, rsp) {
  const { videoId, title, summary, timestamp } = req.data || req;
  const res = await lg('summaryHistory');
  const h = res.summaryHistory || [];
  h.unshift({ videoId, title, summary, timestamp: timestamp || nt() });
  await ls({ summaryHistory: h.slice(0, 100) });
  rsp({ success: true });
}
