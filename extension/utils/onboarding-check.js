/**
 * Onboarding checker utility for the YouTube AI Navigator extension
 * Handles checking if onboarding is completed and managing the onboarding flow
 */

/**
 * Enhanced warning logging function
 * @param {string} warningMessage - The warning message to log
 */
const logWarning = (warningMessage) => {
  console.error(warningMessage);
};

/**
 * OnboardingChecker class for managing onboarding state and flow
 */
export class OnboardingChecker {
  /**
   * Checks if onboarding has been completed
   * @returns {Promise<boolean>} True if onboarding is completed
   */
  static async isCompleted() {
    const chromeStorageData = await chrome.storage.sync.get('onboardingCompleted');
    return chromeStorageData.onboardingCompleted === true;
  }

  /**
   * Checks if an API key has been configured
   * @returns {Promise<boolean>} True if API key is configured
   */
  static async hasApiKey() {
    const chromeStorageData = await chrome.storage.sync.get('apiKey');
    return !!(chromeStorageData.apiKey && chromeStorageData.apiKey.trim());
  }

  /**
   * Determines if onboarding should be shown
   * @returns {Promise<boolean>} True if onboarding should be shown
   */
  static async shouldShowOnboarding() {
    return !(await this.isCompleted());
  }

  /**
   * Opens the onboarding page
   */
  static async openOnboarding() {
    const extensionUrl = chrome.runtime.getURL('onboarding/onboarding.html');
    await chrome.tabs.create({ url: extensionUrl });
  }

  /**
   * Checks if onboarding is needed and handles the flow
   * @returns {Promise<boolean>} True if user is ready to proceed
   */
  static async checkAndPrompt() {
    if (await this.shouldShowOnboarding()) {
      await this.openOnboarding();
      return false;
    }

    if (!(await this.hasApiKey())) {
      logWarning('API key not configured');
      return false;
    }

    return true;
  }

  /**
   * Marks onboarding as completed
   */
  static async markCompleted() {
    await chrome.storage.sync.set({ onboardingCompleted: true });
  }
}
