// InnerTube Comments Fetcher
// Uses message passing to background script
import { log, err, ok } from '../../utils/yt.js';

export const fetchComments = async (videoId, limit = 20) => {
    try {
        log(`[Comments] Fetching: ${videoId} (limit: ${limit})`);

        const response = await chrome.runtime.sendMessage({
            action: 'INNERTUBE_GET_COMMENTS',
            videoId,
            limit
        });

        if (!response.success) {
            throw new Error(response.error || 'Comments fetch failed');
        }

        ok(`[Comments] Fetched ${response.comments.length} comments`);
        return response.comments;

    } catch (e) {
        err('[Comments] Fetch failed', e);
        throw e;
    }
};
