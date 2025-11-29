export class CacheSettings {
    constructor(s, a) {
        this.s = s;
        this.a = a;
    }

    init() {
        const c = this.s.get().cache || {};
        this.chk('cacheEnabled', c.enabled ?? true);
        this.set('cacheTTL', (c.ttl || 86400000) / 3600000);
        this.set('cacheMaxSize', c.maxSize || 50);
        this.chk('cacheTranscripts', c.transcripts ?? true);
        this.chk('cacheComments', c.comments ?? true);
        this.chk('cacheMetadata', c.metadata ?? true);
        this.chk('cacheSegments', c.segments ?? true);
        this.chk('cacheSummaries', c.summaries ?? true);

        this.a.attachToAll({
            cacheEnabled: { path: 'cache.enabled' },
            cacheTTL: { path: 'cache.ttl', transform: v => parseInt(v) * 3600000 },
            cacheMaxSize: { path: 'cache.maxSize', transform: v => parseInt(v) },
            cacheTranscripts: { path: 'cache.transcripts' },
            cacheComments: { path: 'cache.comments' },
            cacheMetadata: { path: 'cache.metadata' },
            cacheSegments: { path: 'cache.segments' },
            cacheSummaries: { path: 'cache.summaries' }
        });

        document.getElementById('clearCache')?.addEventListener('click', async () => {
            if (confirm('Clear all cached data? This cannot be undone.')) {
                await chrome.storage.local.clear();
                this.a.notifications?.success('Cache cleared');
            }
        });

        document.getElementById('viewCacheStats')?.addEventListener('click', async () => {
            const stats = await chrome.storage.local.getBytesInUse();
            const div = document.getElementById('cacheStats');
            if (div) {
                div.className = 'status-indicator success';
                div.textContent = `Cache: ${(stats / 1024 / 1024).toFixed(2)} MB`;
            }
        });
    }

    set(id, v) {
        const el = document.getElementById(id);
        if (el) el.value = v;
    }

    chk(id, v) {
        const el = document.getElementById(id);
        if (el) el.checked = v;
    }
}
