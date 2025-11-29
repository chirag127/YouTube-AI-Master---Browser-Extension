// YouTube.js InnerTube API Wrapper - Primary Strategy
import { log, err, ok, cached } from '../utils/yt.js';

let instance = null;
let Innertube = null;

const loadInnerTube = async () => {
    if (Innertube) return Innertube;

    try {
        log('Loading YouTube.js library...');
        const libUrl = chrome.runtime.getURL('lib/youtubei.js');
        const module = await import(libUrl);
        Innertube = module.Innertube;
        ok('YouTube.js library loaded');
        return Innertube;
    } catch (e) {
        err('Failed to load YouTube.js library', e);
        throw new Error(`InnerTube library load failed: ${e.message}`);
    }
};

export const getClient = async () => {
    if (instance) return instance;

    const c = cached('innertube-client', 3600000);
    const existing = c.get();
    if (existing) {
        instance = existing;
        return instance;
    }

    try {
        log('Initializing InnerTube client...');
        const InnertubeClass = await loadInnerTube();
        instance = await InnertubeClass.create();
        c.set(instance);
        ok('InnerTube client ready');
        return instance;
    } catch (e) {
        err('Failed to create InnerTube client', e);
        throw e;
    }
};

export const getVideoInfo = async (videoId) => {
    const client = await getClient();
    return await client.getInfo(videoId);
};

export const getComments = async (videoId) => {
    const client = await getClient();
    return await client.getComments(videoId);
};
