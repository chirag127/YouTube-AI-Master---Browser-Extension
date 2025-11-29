import { ModelManager } from '../../api/gemini.js';

export class AIConfig {
  constructor(s, a) {
    this.s = s;
    this.a = a;
    this.mm = null;
  }

  async init() {
    const c = this.s.get().ai || {};

    if (ModelManager && c.apiKey) {
      this.mm = new ModelManager(c.apiKey, 'https://generativelanguage.googleapis.com/v1beta');
    }

    this.set('apiKey', c.apiKey || '');
    this.set('customPrompt', c.customPrompt || '');
    if (c.model) this.set('modelSelect', c.model);

    const els = {
      apiKey: document.getElementById('apiKey'),
      toggleApiKey: document.getElementById('toggleApiKey'),
      modelSelect: document.getElementById('modelSelect'),
      refreshModels: document.getElementById('refreshModels'),
      testConnection: document.getElementById('testConnection'),
      customPrompt: document.getElementById('customPrompt'),
    };

    els.apiKey?.addEventListener('change', async e => {
      const key = e.target.value.trim();
      await this.a.save('ai.apiKey', key);
      this.mm = new ModelManager(key, 'https://generativelanguage.googleapis.com/v1beta');
      if (key) await this.loadModels(els.modelSelect);
    });

    els.toggleApiKey?.addEventListener('click', () => {
      els.apiKey.type = els.apiKey.type === 'password' ? 'text' : 'password';
    });

    if (els.customPrompt) {
      this.a.attachToInput(els.customPrompt, 'ai.customPrompt');
    }

    els.modelSelect?.addEventListener('change', e => {
      let m = e.target.value;
      if (m.startsWith('models/')) m = m.replace('models/', '');
      this.a.save('ai.model', m);
    });

    els.refreshModels?.addEventListener('click', () => this.loadModels(els.modelSelect));
    els.testConnection?.addEventListener('click', () => this.test());

    if (c.apiKey) await this.loadModels(els.modelSelect);
  }

  async loadModels(sel) {
    if (!sel) return;
    sel.innerHTML = '<option value="" disabled>Loading...</option>';
    sel.disabled = true;

    try {
      if (!this.mm) throw new Error('Set API key first');

      const models = await this.mm.fetch();
      sel.innerHTML = '';

      if (models.length === 0) {
        sel.innerHTML = '<option value="" disabled>No models found</option>';
        return;
      }

      models.forEach(m => {
        const name =
          typeof m === 'string' ? m.replace('models/', '') : m.name?.replace('models/', '') || m;
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        sel.appendChild(opt);
      });

      const c = this.s.get().ai || {};
      let saved = c.model;

      if (saved && saved.startsWith('models/')) {
        saved = saved.replace('models/', '');
        await this.a.save('ai.model', saved);
      }

      if (saved && models.includes(saved)) {
        sel.value = saved;
      } else if (models.length > 0) {
        sel.value = models[0];
        await this.a.save('ai.model', models[0]);
      }
    } catch (e) {
      console.error('Failed to fetch models:', e);
      sel.innerHTML = '<option value="" disabled>Failed to load</option>';
      this.a.notifications?.error(`Failed: ${e.message}`);
    } finally {
      sel.disabled = false;
    }
  }

  async test() {
    const btn = document.getElementById('testConnection');
    const status = document.getElementById('apiStatus');
    const modelSelect = document.getElementById('modelSelect');
    const c = this.s.get().ai || {};

    btn.disabled = true;
    btn.textContent = 'Testing...';
    status.className = 'status-indicator hidden';

    try {
      if (!c.apiKey) throw new Error('API Key missing');

      let m = modelSelect?.value || c.model || 'gemini-2.0-flash-exp';
      if (m.startsWith('models/')) m = m.replace('models/', '');
      if (
        !m.includes('-latest') &&
        !m.match(/-\d{3}$/) &&
        !m.match(/-\d{2}-\d{4}$/) &&
        !m.includes('preview') &&
        !m.includes('exp')
      ) {
        m = m + '-latest';
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${c.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: 'Ping' }] }] }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || res.statusText);
      }

      status.textContent = '✓ Connection Successful!';
      status.className = 'status-indicator success';
      status.classList.remove('hidden');
      this.a.notifications?.success('API verified');
    } catch (e) {
      status.textContent = `✗ Failed: ${e.message}`;
      status.className = 'status-indicator error';
      status.classList.remove('hidden');
      this.a.notifications?.error(`Failed: ${e.message}`);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Test Connection';
    }
  }

  set(id, v) {
    const el = document.getElementById(id);
    if (el) el.value = v;
  }
}
