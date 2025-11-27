// YouTube player interaction

/**
 * Get YouTube player element
 * @returns {HTMLElement|null} Player element or null
 */
export function getPlayer() {
    return document.getElementById('movie_player');
}

/**
 * Get current playback time
 * @returns {number} Current time in seconds
 */
export function getCurrentTime() {
    const player = getPlayer();
    return player?.getCurrentTime?.() || 0;
}

/**
 * Get video duration
 * @returns {number} Duration in seconds
 */
export function getDuration() {
    const player = getPlayer();
    return player?.getDuration?.() || 0;
}

/**
 * Seek to specific time
 * @param {number} seconds - Time in seconds
 */
export function seekTo(seconds) {
    const player = getPlayer();
    player?.seekTo?.(seconds);
}
