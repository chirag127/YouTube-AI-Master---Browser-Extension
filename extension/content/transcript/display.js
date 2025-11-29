// Display transcript in UI

/**
 * Create transcript display element
 * @param {Array} segments - Transcript segments
 * @returns {HTMLElement} Display element
 */
export function createTranscriptDisplay(segments) {
  const container = document.createElement('div');
  container.className = 'ytai-transcript-display';

  for (const segment of segments) {
    const line = createTranscriptLine(segment);
    container.appendChild(line);
  }

  return container;
}

/**
 * Create single transcript line
 * @param {Object} segment - Transcript segment
 * @returns {HTMLElement} Line element
 */
function createTranscriptLine(segment) {
  const line = document.createElement('div');
  line.className = 'ytai-transcript-line';
  line.dataset.start = segment.start;
  line.dataset.duration = segment.duration;

  const timestamp = document.createElement('span');
  timestamp.className = 'ytai-transcript-timestamp';
  timestamp.textContent = formatTimestamp(segment.start);

  const text = document.createElement('span');
  text.className = 'ytai-transcript-text';
  text.textContent = segment.text;

  line.appendChild(timestamp);
  line.appendChild(text);

  return line;
}

/**
 * Format timestamp for display
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted timestamp
 */
function formatTimestamp(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
