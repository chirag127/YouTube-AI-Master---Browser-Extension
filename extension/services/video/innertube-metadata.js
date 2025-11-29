// InnerTube Metadata Fetcher
// Uses message passing to background script
import { log, err, ok } from '../../utils/yt.js';

export const fetchMetadata = async (videoId) => {
    try {
        log(`[Metadata] Fetching: ${videoId}`);

        const response = await chrome.runtime.sendMessage({
            action: 'INNERTUBE_GET_VIDEO_INFO',
            videoId
        });

        if (!response.success) {
            throw new Error(response.error || 'Metadata fetch failed');
        }

        ok(`[Metadata] Fetched: ${response.metadata.title}`);
        return response.metadata;

    } catch (e) {
        err('[Metadata] Fetch failed', e);
        throw e;
    }
};
