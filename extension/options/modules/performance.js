export class PerformanceSettings {
    constructor(s, a) {
        this.settings = s;
        this.autoSave = a;
    }

    init() {
        this.loadSettings();
        this.attachListeners();
    }

    loadSettings() {
        const c = this.settings.get();
        const p = c.performance || {};

        this.set('maxConcurrentRequests', p.maxConcurrentRequests || 3);
        this.set('rateLimitDelay', p.rateLimitDelay || 1000);
        this.set('retryAttempts', p.retryAttempts || 3);
        this.set('retryDelay', p.retryDelay || 2000);
        this.setChecked('enableCompression', p.enableCompression ?? true);
        this.setChecked('lazyLoad', p.lazyLoad ?? true);
        this.setChecked('prefetchData', p.prefetchData ?? true);
    }

    attachListeners() {
        this.autoSave.attachToAll({
            maxConcurrentRequests: { path: 'performance.maxConcurrentRequests', transform: v => parseInt(v) },
            rateLimitDelay: { path: 'performance.rateLimitDelay', transform: v => parseInt(v) },
            retryAttempts: { path: 'performance.retryAttempts', transform: v => parseInt(v) },
            retryDelay: { path: 'performance.retryDelay', transform: v => parseInt(v) },
            enableCompression: { path: 'performance.enableCompression' },
            lazyLoad: { path: 'performance.lazyLoad' },
            prefetchData: { path: 'performance.prefetchData' }
        });
    }

    set(id, val) {
        const el = document.getElementById(id);
        if (el) el.value = val;
    }

    setChecked(id, val) {
        const el = document.getElementById(id);
        if (el) el.checked = val;
    }
}
