import { e, w } from '../../utils/shortcuts/log.js';
export async function handleGetMetadata(req, rsp) {
  try {
    const { videoId } = req;
    w('[Background] GET_METADATA called - this should be handled by content script');
    rsp({
      success: true,
      data: { title: 'YouTube Video', author: 'Unknown Channel', viewCount: 'Unknown', videoId },
    });
  } catch (x) {
    e('GetMetadata:', x);
    rsp({ success: false, error: x.message });
  }
}
