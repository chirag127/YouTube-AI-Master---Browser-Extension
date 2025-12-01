/**
 * Model name migration utility for the YouTube AI Navigator extension
 * Handles migration of model names from old format to new format
 */

/**
 * Migrates model names from old format (models/ prefix) to new format (without prefix)
 * @returns {Promise<boolean>} True if migration was successful, false otherwise
 */
export async function migrateModelNames() {
  try {
    const chromeStorageData = await chrome.storage.sync.get(['model']);
    if (chromeStorageData.model && typeof chromeStorageData.model === 'string' && chromeStorageData.model.startsWith('models/')) {
      const cleanedModelName = chromeStorageData.model.replace('models/', '');
      await chrome.storage.sync.set({ model: cleanedModelName });

      console.error('[Migration] Successfully migrated model name from:', chromeStorageData.model, 'to:', cleanedModelName);
      return true;
    }
    return false;
  } catch (error) {
    console.error('[Migration] Failed to migrate model names:', error);
    return false;
  }
}
