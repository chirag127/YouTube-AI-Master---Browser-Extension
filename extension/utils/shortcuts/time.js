/**
 * Shortcut for Date.now
 * @returns {number}
 */
export const now = () => Date.now();

/**
 * Shortcut for setTimeout
 * @param {function} f - Function
 * @param {number} d - Delay
 * @returns {number}
 */
export const delay = (f, d) => setTimeout(f, d);

/**
 * Shortcut for clearTimeout
 * @param {number} i - ID
 */
export const clearDelay = (i) => clearTimeout(i);

/**
 * Shortcut for setInterval
 * @param {function} f - Function
 * @param {number} d - Delay
 * @returns {number}
 */
export const interval = (f, d) => setInterval(f, d);

/**
 * Shortcut for clearInterval
 * @param {number} i - ID
 */
export const clearInterval = (i) => window.clearInterval(i);
