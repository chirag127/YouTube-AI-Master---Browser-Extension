/**
 * YouTube utility functions for the YouTube AI Navigator extension
 * Provides logging, caching, and other YouTube-specific utilities
 */

/**
 * Enhanced logging function with YouTube context prefix
 * @param {string} message - The message to log
 * @param {...any} additionalArguments - Additional arguments to log
 */
export const logWithContext = (message, ...additionalArguments) => {
  console.error(`[YT]${message}`, ...additionalArguments);
};

/**
 * Enhanced error logging function with YouTube context prefix
 * @param {string} message - The error message to log
 * @param {Error|string} error - Error object or error message
 */
export const logError = (message, error) => {
  console.error(`[YT]${message}`, error?.message || error);
};

/**
 * Success logging function with YouTube context and success emoji
 * @param {string} message - The success message to log
 * @param {...any} additionalArguments - Additional arguments to log
 */
export const logSuccess = (message, ...additionalArguments) => {
  console.error(`[YT]✅${message}`, ...additionalArguments);
};

/**
 * Simple in-memory cache implementation for YouTube data
 * @param {string} cacheKey - Unique key for the cache entry
 * @param {number} timeToLive - Time to live in milliseconds (default: 5 minutes)
 * @returns {Object} Cache object with get and set methods
 */
const cacheStorage = new Map();

export const createCachedData = (cacheKey, timeToLive = 300000) => ({
  get: () => {
    const cacheEntry = cacheStorage.get(cacheKey);
    return cacheEntry && Date.now() - cacheEntry.timestamp < timeToLive ? cacheEntry.value : null;
  },
  set: (cacheValue) => {
    cacheStorage.set(cacheKey, { value: cacheValue, timestamp: Date.now() });
  },
});
