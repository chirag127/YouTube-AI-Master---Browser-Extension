/**
 * Migration utility to clean up model names in storage
 * This should be run once on extension update to fix any stored model names
 * that have the 'models/' prefix
 */

export async function migrateModelNames() {
    try {
        const data = await chrome.storage.sync.get(['model']);

        if (data.model && typeof data.model === 'string' && data.model.startsWith('models/')) {
            const cleanedModel = data.model.replace('models/', '');
            await chrome.storage.sync.set({ model: cleanedModel });
            console.log(`[Migration] Cleaned model name: ${data.model} -> ${cleanedModel}`);
            return true;
        }

        return false;
    } catch (error) {
        console.error('[Migration] Failed to migrate model names:', error);
        return false;
    }
}
