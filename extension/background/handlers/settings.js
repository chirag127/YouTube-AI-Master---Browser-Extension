import { sg as ssg } from '../../utils/shortcuts/storage.js';
import { e } from '../../utils/shortcuts/log.js';
export async function handleGetSettings(rsp) {
  try {
    const s = await ssg('config');
    rsp({ success: true, data: s.config || {} });
  } catch (x) {
    e('GetSettings:', x);
    rsp({ success: false, error: x.message });
  }
}
