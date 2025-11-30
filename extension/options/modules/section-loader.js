import { url } from '../../utils/shortcuts/runtime.js';
import { $ } from '../../utils/shortcuts/dom.js';
import { e as ce2 } from '../../utils/shortcuts/log.js';
import { pa } from '../../utils/shortcuts/async.js';
import { ok } from '../../utils/shortcuts/core.js';
import { ft } from '../../utils/shortcuts/network.js';

export class SectionLoader {
  constructor() {
    this.sections = {
      general: 'sections/general.html',
      cache: 'sections/cache.html',
      transcript: 'sections/transcript.html',
      comments: 'sections/comments.html',
      metadata: 'sections/metadata.html',
      scroll: 'sections/scroll.html',
      performance: 'sections/performance.html',
      notifications: 'sections/notifications.html',
      prompts: 'sections/prompts.html',
      integrations: 'sections/integrations.html',
      widget: 'sections/widget.html',
    };
    this.loaded = new Set();
  }
  async load(id) {
    if (this.loaded.has(id)) return true;
    const p = this.sections[id];
    if (!p) return false;
    try {
      const h = await ft(url(`options/${p}`)).then(r => r.text());
      const c = $('.content-area');
      c.insertAdjacentHTML('beforeend', h);
      this.loaded.add(id);
      return true;
    } catch (x) {
      ce2(`[SectionLoader] Failed to load ${id}:`, x);
      return false;
    }
  }
  async loadAll() {
    await pa(ok(this.sections).map(id => this.load(id)));
  }
}
