import { e } from './shortcuts/log.js';
export async function migrateModelNames() {
  try {
    const d = await chrome.storage.sync.get(['model']);
    if (d.model && typeof d.model === 'string' && d.model.startsWith('models/')) {
      const c = d.model.replace('models/', '');
      await chrome.storage.sync.set({ model: c });

      return true;
    }
    return false;
  } catch (x) {
    e('[Migration] Failed to migrate model names:', x);
    return false;
  }
}
