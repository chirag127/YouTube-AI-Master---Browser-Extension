/**
 * Segment Label Mapping System
 *
 * This module provides comprehensive mapping between:
 * - Lowercase category keys (used in SponsorBlock API and internal processing)
 * - Display names (used in UI)
 * - Color codes (used in visual elements)
 * - Label variations (used in different contexts)
 */

// Mapping from lowercase category keys to display names
export const LABEL_MAPPING = {
    sponsor: 'Sponsor',
    selfpromo: 'Self Promotion',
    interaction: 'Interaction Reminder',
    intro: 'Intro',
    outro: 'Outro',
    preview: 'Preview',
    hook: 'Hook',
    music_offtopic: 'Music: Off-Topic',
    poi_highlight: 'Highlight',
    filler: 'Filler',
    exclusive_access: 'Exclusive Access',
    chapter: 'Chapter',
    content: 'Content'
};

// Mapping from lowercase category keys to color codes
export const COLOR_MAPPING = {
    sponsor: '#00d26a',
    selfpromo: '#ffff00',
    interaction: '#a020f0',
    intro: '#00ffff',
    outro: '#0000ff',
    preview: '#00bfff',
    hook: '#4169e1',
    music_offtopic: '#ff9900',
    poi_highlight: '#ff0055',
    filler: '#9400d3',
    exclusive_access: '#008b45',
    chapter: '#1e90ff',
    content: '#999999'
};

// Reverse mapping from display names to lowercase keys
const DISPLAY_TO_KEY = {
    'Sponsor': 'sponsor',
    'Self Promotion': 'selfpromo',
    'Self Promotion/Unpaid Promotion': 'selfpromo',
    'Unpaid/Self Promotion': 'selfpromo',
    'Interaction Reminder': 'interaction',
    'Intermission/Intro Animation': 'intro',
    'Intermission/Intro': 'intro',
    'Intro': 'intro',
    'Endcards/Credits': 'outro',
    'Outro': 'outro',
    'Preview/Recap': 'preview',
    'Preview': 'preview',
    'Tangents/Jokes': 'filler',
    'Filler/Tangent': 'filler',
    'Filler': 'filler',
    'Highlight': 'poi_highlight',
    'Exclusive Access': 'exclusive_access',
    'Off-Topic': 'music_offtopic',
    'Music: Non-Music Section': 'music_offtopic',
    'Music: Off-Topic': 'music_offtopic',
    'Hook/Greetings': 'hook',
    'Hook': 'hook',
    'Chapter': 'chapter',
    'Content': 'content',
    'Main Content': 'content',
    'Content (Main Video)': 'content'
};

/**
 * Get the lowercase key for a label (normalizes various label formats)
 * @param {string} label - The label to convert to key
 * @returns {string} The lowercase key
 */
export function getLabelKey(label) {
    if (!label || typeof label !== 'string') {
        return 'content';
    }

    // First check if it's already a known key
    if (LABEL_MAPPING[label]) {
        return label;
    }

    // Check if it's a display name that maps to a key
    if (DISPLAY_TO_KEY[label]) {
        return DISPLAY_TO_KEY[label];
    }

    // Fallback: convert to lowercase and normalize
    return label.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

/**
 * Get the display name for a category key
 * @param {string} key - The lowercase category key
 * @returns {string} The display name
 */
export function getLabelName(key) {
    if (!key || typeof key !== 'string') {
        return key;
    }

    // Return the display name if key exists, otherwise return the key itself
    return LABEL_MAPPING[key] || key;
}

/**
 * Get the color for a category key
 * @param {string} key - The lowercase category key
 * @returns {string} The color code
 */
export function getLabelColor(key) {
    if (!key || typeof key !== 'string') {
        return '#999999';
    }

    // Return the color if key exists, otherwise return default color
    return COLOR_MAPPING[key] || '#999999';
}