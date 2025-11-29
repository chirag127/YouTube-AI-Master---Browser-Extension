import { cw } from '../../utils/shortcuts.js';

export async function handleGetMetadata(req, rsp) {
  const { videoId } = req;
  cw('[Background] GET_METADATA called - this should be handled by content script');
  rsp({
    success: true,
    data: { title: 'YouTube Video', author: 'Unknown Channel', viewCount: 'Unknown', videoId },
  });
}
