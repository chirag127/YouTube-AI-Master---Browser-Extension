import { ft, url, qs, l, e } from '../../utils/shortcuts.js';

export class TabLoader {
  constructor() {
    this.tabs = {
      general: 'tabs/general.html',
      cache: 'tabs/cache.html',
      transcript: 'tabs/transcript.html',
      comments: 'tabs/comments.html',
      metadata: 'tabs/metadata.html',
      scroll: 'tabs/scroll.html',
      performance: 'tabs/performance.html',
      notifications: 'tabs/notifications.html',
    };
    this.loaded = new Set();
  }
  async load(id) {
    if (this.loaded.has(id)) return true;
    const p = this.tabs[id];
    if (!p) return false;
    try {
      const r = await ft(url(`options/${p}`));
      const h = await r.text();
      const c = qs('.content-area');
      c.insertAdjacentHTML('beforeend', h);
      this.loaded.add(id);
      l(`[TabLoader] Loaded ${id}`);
      return true;
    } catch (x) {
      e(`[TabLoader] Failed to load ${id}:`, x);
      return false;
    }
  }
  async loadAll() {
    await Promise.all(Object.keys(this.tabs).map(id => this.load(id)));
  }
}
