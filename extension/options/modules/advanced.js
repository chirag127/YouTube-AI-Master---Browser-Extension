export class AdvancedSettings {
  constructor(s, a) {
    this.s = s;
    this.a = a;
  }

  init() {
    this.chk('debugMode', this.s.get().advanced?.debugMode ?? false);

    this.a.attachToAll({
      debugMode: { path: 'advanced.debugMode' },
    });

    const els = {
      exportSettings: document.getElementById('exportSettings'),
      importSettings: document.getElementById('importSettings'),
      importFile: document.getElementById('importFile'),
      resetDefaults: document.getElementById('resetDefaults'),
    };

    els.exportSettings?.addEventListener('click', () => {
      const data = JSON.stringify(this.s.get(), null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'youtube-ai-master-settings.json';
      a.click();
    });

    els.importSettings?.addEventListener('click', () => els.importFile?.click());

    els.importFile?.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async ev => {
        try {
          const imported = JSON.parse(ev.target.result);
          const success = await this.s.import(JSON.stringify(imported));
          if (success) {
            this.a.notifications?.success('Settings imported');
            setTimeout(() => window.location.reload(), 1000);
          } else {
            throw new Error('Import failed');
          }
        } catch (err) {
          console.error('Import failed:', err);
          this.a.notifications?.error('Invalid settings file');
        }
      };
      reader.readAsText(file);
    });

    els.resetDefaults?.addEventListener('click', async () => {
      if (confirm('Reset all settings to default? This cannot be undone.')) {
        await this.s.reset();
        this.a.notifications?.success('Settings reset');
        setTimeout(() => window.location.reload(), 1000);
      }
    });
  }

  chk(id, v) {
    const el = document.getElementById(id);
    if (el) el.checked = v;
  }
}
