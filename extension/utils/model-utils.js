/**
 * Utility functions for handling Gemini model names
 */

/**
 * Clean model name by removing 'models/' prefix if present
 * @param {string} modelName - Model name that might have 'models/' prefix
 * @returns {string} Clean model name without prefix
 */
export function cleanModelName(modelName) {
  if (!modelName) return '';

  if (typeof modelName === 'string' && modelName.startsWith('models/')) {
    return modelName.replace('models/', '');
  }

  return modelName;
}

/**
 * Get default model name
 * @returns {string} Default model name
 */
export function getDefaultModel() {
  return 'gemini-2.5-flash-preview-09-2025';
}

/**
 * Validate and clean model name from settings
 * @param {string} modelName - Model name from settings
 * @returns {string} Clean, valid model name
 */
export function getValidModelName(modelName) {
  const cleaned = cleanModelName(modelName);
  return cleaned || getDefaultModel();
}
