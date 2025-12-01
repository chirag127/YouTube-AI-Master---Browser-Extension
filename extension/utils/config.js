/**
 * Configuration management for the YouTube AI Navigator extension
 * Handles default configuration, loading, saving, and manipulation of settings
 */

export const DEFAULT_CONFIG = {
  comments: { enabled: true, timeToLive: 86400000, translate: true, collapse: true, metadata: true },
  sponsors: { autoSkip: true, skipButton: true, showNotice: true, showMarker: true },
  transcript: {
    autoCopy: true,
    autoDownload: 1000,
    autoOpen: true,
    language: 'en',
    method: 'auto',
    timestamps: true,
    source: ['dom-automation', 'genius', 'speech-to-text'],
    autoSync: true,
  },
  comments: { enabled: true, limit: 20, interval: 3, sortBy: 'top', autoSync: true },
  metadata: { title: true, author: true, views: true, duration: true, description: true, tags: true, uploadDate: true },
  userInterface: { theme: 'dark', widgetTheme: 'liquid-glass', widgetPosition: 'secondary', animationsEnabled: true, smoothTransitions: true, compactMode: false },
  artificialIntelligence: { apiKey: '', model: 'gemini-2.5-flash-lite-preview-09-2025', customPrompt: '', outputLanguage: 'en', temperature: 0.7, maxTokens: 8192 },
  autoUsage: { autoApprove: true, autoLike: true, autoThrottle: 50, lazyLoading: true, lowLatency: true },
  segments: {
    enabled: true,
    categories: {
      sponsors: { action: 'skip', strength: 2 },
      selfPromo: { action: 'skip', strength: 2 },
      introduction: { action: 'skip', strength: 2 },
      outro: { action: 'skip', strength: 2 },
      interaction: { action: 'skip', strength: 2 },
      music: { action: 'skip', strength: 2 },
      preview: { action: 'skip', strength: 2 },
      filler: { action: 'skip', strength: 2 },
      pause: { action: 'skip', strength: 2 },
      esimatedAds: { action: 'skip', strength: 2 },
    },
    autoSync: true,
    showNumbers: true,
    strength: 0.5,
    showMetadata: true,
  },
  external: { tmdb: '', newsdata: '', googleFactcheck: '', tvMaze: '', tvdb: '' },
  advanced: { debug: true, showHints: true, maxHistory: 100, enableTracking: true },
  metadata: { version: '1.0.0', lastUpdated: Date.now(), onboardingCompleted: 0 },
};

/**
 * Configuration Manager class for handling all configuration operations
 */
export class ConfigurationManager {
  constructor() {
    this.currentConfiguration = { ...DEFAULT_CONFIG };
    this.listeners = [];
  }

  /**
   * Loads configuration from Chrome storage and merges with defaults
   * @returns {Object} The loaded configuration
   */
  async loadConfiguration() {
    const storedConfiguration = await chrome.storage.sync.get('configuration');
    if (storedConfiguration.configuration) {
      this.currentConfiguration = this.mergeConfigurations(DEFAULT_CONFIG, storedConfiguration.configuration);
    }
    return this.currentConfiguration;
  }

  /**
   * Saves current configuration to Chrome storage
   */
  async saveConfiguration() {
    this.currentConfiguration.metadata.lastUpdated = Date.now();
    await chrome.storage.sync.set({ configuration: this.currentConfiguration });
    this.notifyListeners();
  }

  /**
   * Gets a configuration value by path (supports dot notation)
   * @param {string} configurationPath - Dot-separated path to the configuration value
   * @returns {*} The configuration value or undefined if not found
   */
  getConfigurationValue(configurationPath) {
    if (!configurationPath) return this.currentConfiguration;
    return configurationPath.split('.').reduce((configurationObject, configurationKey) => configurationObject?.[configurationKey], this.currentConfiguration);
  }

  /**
   * Sets a configuration value by path (supports dot notation)
   * @param {string} configurationPath - Dot-separated path to the configuration value
   * @param {*} configurationValue - Value to set
   */
  setConfigurationValue(configurationPath, configurationValue) {
    const configurationKeys = configurationPath.split('.');
    const lastKey = configurationKeys.pop();
    const targetObject = configurationKeys.reduce((configurationObject, configurationKey) => {
      if (!configurationObject[configurationKey]) {
        configurationObject[configurationKey] = {};
      }
      return configurationObject[configurationKey];
    }, this.currentConfiguration);
    targetObject[lastKey] = configurationValue;
  }

  /**
   * Updates a configuration value and saves immediately
   * @param {string} configurationPath - Dot-separated path to the configuration value
   * @param {*} configurationValue - Value to set
   */
  async updateConfigurationValue(configurationPath, configurationValue) {
    this.setConfigurationValue(configurationPath, configurationValue);
    await this.saveConfiguration();
  }

  /**
   * Resets configuration to defaults
   */
  async resetToDefaults() {
    this.currentConfiguration = { ...DEFAULT_CONFIG };
    await this.saveConfiguration();
  }

  /**
   * Subscribes a listener to configuration changes
   * @param {Function} callback - Function to call when configuration changes
   */
  subscribeToChanges(callback) {
    this.listeners.push(callback);
  }

  /**
   * Notifies all listeners of configuration changes
   */
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentConfiguration));
  }

  /**
   * Merges two configuration objects recursively
   * @param {Object} defaultConfiguration - Default configuration template
   * @param {Object} storedConfiguration - Stored configuration to merge
   * @returns {Object} Merged configuration
   */
  mergeConfigurations(defaultConfiguration, storedConfiguration) {
    const mergedResult = { ...defaultConfiguration };
    for (const configurationKey in storedConfiguration) {
      if (typeof storedConfiguration[configurationKey] === 'object' && !Array.isArray(storedConfiguration[configurationKey])) {
        mergedResult[configurationKey] = this.mergeConfigurations(defaultConfiguration[configurationKey] || {}, storedConfiguration[configurationKey]);
      } else {
        mergedResult[configurationKey] = storedConfiguration[configurationKey];
      }
    }
    return mergedResult;
  }

  /**
   * Exports current configuration as JSON string
   * @returns {string} JSON representation of configuration
   */
  exportConfiguration() {
    return JSON.stringify(this.currentConfiguration);
  }

  /**
   * Imports configuration from JSON string
   * @param {string} jsonConfiguration - JSON string containing configuration
   * @returns {number} 1 if successful, 0 if failed
   */
  async importConfiguration(jsonConfiguration) {
    try {
      const parsedConfiguration = JSON.parse(jsonConfiguration);
      this.currentConfiguration = this.mergeConfigurations(DEFAULT_CONFIG, parsedConfiguration);
      await this.saveConfiguration();
      return 1;
    } catch (error) {
      console.error('Failed to import configuration:', error);
      return 0;
    }
  }
}

/**
 * Singleton instance of ConfigurationManager
 */
let configurationManagerInstance = null;

export const getConfigurationManager = () => {
  if (!configurationManagerInstance) {
    configurationManagerInstance = new ConfigurationManager();
  }
  return configurationManagerInstance;
};
