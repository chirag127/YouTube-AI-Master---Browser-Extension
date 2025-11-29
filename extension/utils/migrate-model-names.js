import { sg, ss, l, e } from './shortcuts.js';
export async function migrateModelNames() {
  try {
    const d = await sg(['model']);
    if (d.model && typeof d.model === 'string' && d.model.startsWith('models/')) {
      const c = d.model.replace('models/', '');
      await ss('model', c);
      l(`[Migration] Cleaned model name: ${d.model} -> ${c}`);
      return true;
    }
    return false;
  } catch (x) {
    e('[Migration] Failed to migrate model names:', x);
    return false;
  }
}
