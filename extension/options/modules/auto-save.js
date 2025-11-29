import { st, cst, l, e, on, ge, oe } from '../../utils/shortcuts.js';

export class AutoSave {
  constructor(sm, d = 500, nm = null) {
    this.s = sm;
    this.d = d;
    this.t = null;
    this.n = nm;
    this.c = 0;
  }
  async save(p, v) {
    cst(this.t);
    if (this.n) this.n.saving('Saving...');
    this.t = st(async () => {
      try {
        l(`[AutoSave] Saving ${p} =`, v);
        await this.s.update(p, v);
        this.c++;
        if (this.n) this.n.success(`Setting saved: ${p.split('.').pop()}`);
        l(`[AutoSave] ✓ Saved successfully (count: ${this.c})`);
      } catch (x) {
        e('[AutoSave] Failed:', x);
        if (this.n) this.n.error(`Failed to save: ${x.message}`);
      }
    }, this.d);
  }
  attachToInput(el, p, tr = v => v) {
    if (!el) return;
    const h = e => {
      const v = el.type === 'checkbox' ? el.checked : el.value;
      this.save(p, tr(v));
    };
    on(el, 'change', h);
    on(el, 'input', h);
  }
  attachToAll(m) {
    oe(m).forEach(([id, c]) => {
      const el = ge(id);
      if (el) this.attachToInput(el, c.path, c.transform);
    });
  }
}
