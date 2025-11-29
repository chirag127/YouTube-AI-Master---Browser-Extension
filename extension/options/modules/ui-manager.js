import { ft, ge, st, qsa, on, e } from '../../utils/shortcuts.js';

export class UIManager {
  constructor() {
    this.elements = {};
  }
  async loadSection(id) {
    try {
      const r = await ft(`sections/${id}.html`);
      return await r.text();
    } catch (x) {
      e(`Failed to load section ${id}:`, x);
      return `<div class="error">Failed to load section: ${id}</div>`;
    }
  }
  showToast(m, t = 'success') {
    const el = ge('toast');
    if (!el) return;
    el.textContent = m;
    el.className = `toast show ${t}`;
    st(() => el.classList.remove('show'), 3000);
  }
  setupTabs(cb) {
    const tabs = qsa('.nav-item');
    tabs.forEach(t => {
      on(t, 'click', () => {
        const tgt = t.dataset.tab;
        tabs.forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        qsa('.tab-content').forEach(c => c.classList.remove('active'));
        const s = ge(tgt);
        if (s) s.classList.add('active');
        if (cb) cb(tgt);
      });
    });
  }
}
