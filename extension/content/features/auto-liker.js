import { state } from '../core/state.js';
import { log, logError, waitForElement } from '../core/debug.js';

export class AutoLiker {
  constructor() {
    this.video = null;
    this.likedVideos = new Set();
    this.checkInterval = null;
    this.isObserving = false;
  }

  init() {
    log('AutoLiker: Initializing...');
    this.startObserving();
  }

  startObserving() {
    if (this.isObserving) return;

    // Watch for video element changes (SPA navigation)
    const observer = new MutationObserver(() => {
      const video = document.querySelector('video');
      if (video && video !== this.video) {
        this.attachToVideo(video);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    this.isObserving = true;

    // Initial check
    const video = document.querySelector('video');
    if (video) this.attachToVideo(video);
  }

  attachToVideo(video) {
    if (this.video) {
      this.video.removeEventListener('timeupdate', this.handleTimeUpdate);
    }

    this.video = video;
    this.video.addEventListener('timeupdate', this.handleTimeUpdate.bind(this));
    log('AutoLiker: Attached to video element');

    // Reset state for new video
    // We use the video ID from state or URL as a key
    const videoId = state.currentVideoId || new URLSearchParams(window.location.search).get('v');
    if (videoId && !this.likedVideos.has(videoId)) {
      log(`AutoLiker: New video detected (${videoId})`);
    }
  }

  async handleTimeUpdate() {
    if (!state.settings.autoLike || !this.video) return;

    const videoId = state.currentVideoId || new URLSearchParams(window.location.search).get('v');
    if (!videoId || this.likedVideos.has(videoId)) return;

    const duration = this.video.duration;
    const currentTime = this.video.currentTime;

    if (!duration || duration === 0) return;

    const progress = (currentTime / duration) * 100;
    const threshold = state.settings.autoLikeThreshold || 50;

    if (progress >= threshold) {
      await this.attemptLike(videoId);
    }
  }

  async attemptLike(videoId) {
    // Prevent multiple attempts
    if (this.likedVideos.has(videoId)) return;

    log(
      `AutoLiker: Threshold reached (${state.settings.autoLikeThreshold}%). Checking criteria...`
    );

    try {
      // 1. Check Live Stream Status
      const isLive = this.isLiveStream();
      if (isLive && !state.settings.autoLikeLive) {
        log('AutoLiker: Skipping - Live stream auto-like disabled');
        this.likedVideos.add(videoId); // Mark as handled so we don't keep checking
        return;
      }

      // 2. Check Subscription Status
      if (!state.settings.likeIfNotSubscribed) {
        const isSubscribed = await this.checkSubscriptionStatus();
        if (!isSubscribed) {
          log("AutoLiker: Skipping - Not subscribed and 'Like if not subscribed' is disabled");
          this.likedVideos.add(videoId);
          return;
        }
      }

      // 3. Perform Like
      const success = await this.clickLikeButton();
      if (success) {
        log('AutoLiker: Video liked successfully! 👍');
        this.likedVideos.add(videoId);
      } else {
        // If failed (e.g. button not found), we might retry later, so don't add to set immediately
        // unless it was a "already liked" scenario
      }
    } catch (error) {
      logError('AutoLiker: Error during like attempt', error);
    }
  }

  isLiveStream() {
    // Check for live badge
    const liveBadge = document.querySelector('.ytp-live-badge');
    if (liveBadge && window.getComputedStyle(liveBadge).display !== 'none') {
      return true;
    }
    // Fallback: check if duration is Infinity (common for live streams)
    if (this.video && this.video.duration === Infinity) return true;

    return false;
  }

  async checkSubscriptionStatus() {
    // Try multiple selectors for subscribe button
    const selectors = [
      '#subscribe-button > ytd-subscribe-button-renderer',
      'ytd-reel-player-overlay-renderer #subscribe-button',
      '#subscribe-button',
    ];

    let button = null;
    for (const selector of selectors) {
      button = document.querySelector(selector);
      if (button) break;
    }

    if (!button) {
      log('AutoLiker: Subscribe button not found, assuming not subscribed');
      return false;
    }

    // Check attributes that indicate subscription
    // 'subscribed' attribute or specific class usually indicates status
    const isSubscribed =
      button.hasAttribute('subscribed') ||
      button.querySelector("button[aria-label^='Unsubscribe']") !== null;

    return isSubscribed;
  }

  async clickLikeButton() {
    const selectors = [
      'like-button-view-model button',
      '#menu .YtLikeButtonViewModelHost button',
      '#segmented-like-button button',
      '#like-button button',
      'ytd-toggle-button-renderer#like-button button', // Old layout fallback
    ];

    let likeBtn = null;
    for (const selector of selectors) {
      const btns = document.querySelectorAll(selector);
      // Usually the first one is the main like button, but sometimes there are others (comments etc)
      // The main video like button is usually in the top menu
      for (const btn of btns) {
        if (btn.closest('#top-level-buttons-computed') || btn.closest('#actions')) {
          likeBtn = btn;
          break;
        }
      }
      if (likeBtn) break;
    }

    if (!likeBtn) {
      log('AutoLiker: Like button not found');
      return false;
    }

    // Check if already liked
    const isLiked =
      likeBtn.getAttribute('aria-pressed') === 'true' ||
      likeBtn.classList.contains('style-default-active');

    if (isLiked) {
      log('AutoLiker: Video already liked');
      this.likedVideos.add(
        state.currentVideoId || new URLSearchParams(window.location.search).get('v')
      );
      return true;
    }

    // Click it
    likeBtn.click();
    return true;
  }
}

export const autoLiker = new AutoLiker();
