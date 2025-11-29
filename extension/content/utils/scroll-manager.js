/**
 * Scroll Manager
 * Handles automatic scrolling for comment extraction and navigation
 */

export class ScrollManager {
  constructor() {
    this.originalScrollPosition = 0;
    this.isScrolling = false;
  }

  /**
   * Save current scroll position
   */
  savePosition() {
    this.originalScrollPosition = window.scrollY;
    console.log('[ScrollManager] Saved scroll position:', this.originalScrollPosition);
  }

  /**
   * Restore saved scroll position
   */
  restorePosition() {
    console.log('[ScrollManager] Restoring scroll position:', this.originalScrollPosition);
    window.scrollTo({
      top: this.originalScrollPosition,
      behavior: 'smooth',
    });
  }

  /**
   * Scroll to top of page
   * @param {boolean} instant - If true, scroll instantly without animation
   */
  scrollToTop(instant = false) {
    console.log('[ScrollManager] Scrolling to top', instant ? '(instant)' : '(smooth)');
    window.scrollTo({
      top: 0,
      behavior: instant ? 'auto' : 'smooth',
    });
  }

  /**
   * Scroll to top instantly (no animation)
   */
  scrollToTopInstant() {
    console.log('[ScrollManager] Instant scroll to top');
    window.scrollTo(0, 0);
    // Force scroll to ensure it happens
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  /**
   * Scroll to comments section
   * @returns {Promise<boolean>} Success status
   */
  async scrollToComments() {
    if (this.isScrolling) {
      console.warn('[ScrollManager] Already scrolling, skipping');
      return false;
    }

    this.isScrolling = true;
    console.log('[ScrollManager] 📜 Scrolling to comments section...');

    try {
      // Save current position
      this.savePosition();

      // Find comments section
      const commentsSection = document.querySelector('ytd-comments#comments');

      if (!commentsSection) {
        console.warn('[ScrollManager] ⚠️ Comments section not found');
        this.isScrolling = false;
        return false;
      }

      // Scroll to comments section
      commentsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      // Wait for scroll animation
      await this.waitForScroll(1000);

      // Scroll up slightly to ensure comments header is visible
      window.scrollBy({
        top: -100,
        behavior: 'smooth',
      });

      await this.waitForScroll(500);

      console.log('[ScrollManager] ✅ Scrolled to comments section');

      // Wait for comments to load
      await this.waitForCommentsToLoad();

      this.isScrolling = false;
      return true;
    } catch (error) {
      console.error('[ScrollManager] ❌ Error scrolling to comments:', error);
      this.isScrolling = false;
      return false;
    }
  }

  /**
   * Wait for comments to load after scrolling
   */
  async waitForCommentsToLoad() {
    console.log('[ScrollManager] Waiting for comments to load...');

    const maxWaitTime = 5000; // 5 seconds max
    const checkInterval = 200; // Check every 200ms
    let elapsed = 0;

    while (elapsed < maxWaitTime) {
      const commentElements = document.querySelectorAll('ytd-comment-thread-renderer');

      if (commentElements.length > 0) {
        console.log(`[ScrollManager] ✅ Comments loaded: ${commentElements.length} found`);
        return true;
      }

      await this.waitForScroll(checkInterval);
      elapsed += checkInterval;
    }

    console.warn('[ScrollManager] ⚠️ Timeout waiting for comments to load');
    return false;
  }

  /**
   * Scroll to a specific element
   * @param {string} selector - CSS selector for the element
   * @param {Object} options - Scroll options
   */
  async scrollToElement(selector, options = {}) {
    const element = document.querySelector(selector);

    if (!element) {
      console.warn(`[ScrollManager] Element not found: ${selector}`);
      return false;
    }

    const defaultOptions = {
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    };

    element.scrollIntoView({ ...defaultOptions, ...options });
    await this.waitForScroll(1000);

    return true;
  }

  /**
   * Wait for a specified duration
   * @param {number} ms - Milliseconds to wait
   */
  waitForScroll(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if an element is in viewport
   * @param {Element} element - DOM element to check
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Scroll element into view if not visible
   * @param {Element} element - DOM element
   */
  ensureVisible(element) {
    if (!this.isInViewport(element)) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }
}

// Singleton instance
let scrollManagerInstance = null;

/**
 * Get scroll manager instance
 */
export function getScrollManager() {
  if (!scrollManagerInstance) {
    scrollManagerInstance = new ScrollManager();
  }
  return scrollManagerInstance;
}

// Convenience exports
export const scrollToComments = () => getScrollManager().scrollToComments();
export const scrollToTop = (instant = false) => getScrollManager().scrollToTop(instant);
export const scrollToTopInstant = () => getScrollManager().scrollToTopInstant();
export const saveScrollPosition = () => getScrollManager().savePosition();
export const restoreScrollPosition = () => getScrollManager().restorePosition();
