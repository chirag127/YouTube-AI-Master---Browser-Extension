import { showPlaceholder } from '../components/loading.js';
import { seekVideo } from '../../utils/dom.js';
import { formatTime } from '../../utils/time.js';

let autoCloseEnabled = true;

export function renderTranscript(c, s) {
  if (!s?.length) {
    showPlaceholder(c, 'No transcript available.');
    return;
  }

  const h = s
    .map(
      x =>
        `<div class="yt-ai-segment" data-time="${x.start}"><span class="yt-ai-timestamp">${formatTime(x.start)}</span><span class="yt-ai-text">${x.text}</span></div>`
    )
    .join('');

  // Add auto-close toggle button
  const autoCloseBtn = `<div class="yt-ai-transcript-controls">
    <button id="yt-ai-transcript-autoclose-toggle" class="yt-ai-btn-small ${autoCloseEnabled ? 'active' : ''}">
      ${autoCloseEnabled ? '✓' : '✗'} Auto-close after extraction
    </button>
  </div>`;

  c.innerHTML = `${autoCloseBtn}<div class="yt-ai-transcript-list">${h}</div>`;

  // Add click handlers
  c.querySelectorAll('.yt-ai-segment').forEach(e =>
    e.addEventListener('click', () => seekVideo(parseFloat(e.dataset.time)))
  );

  // Auto-close toggle handler
  const toggleBtn = c.querySelector('#yt-ai-transcript-autoclose-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      autoCloseEnabled = !autoCloseEnabled;
      toggleBtn.classList.toggle('active', autoCloseEnabled);
      toggleBtn.textContent = `${autoCloseEnabled ? '✓' : '✗'} Auto-close after extraction`;
      console.log(`[Transcript] Auto-close ${autoCloseEnabled ? 'enabled' : 'disabled'}`);
    });
  }
}

export function shouldAutoClose() {
  return autoCloseEnabled;
}

export function collapseTranscriptWidget() {
  const widget = document.getElementById('yt-ai-master-widget');
  if (widget && autoCloseEnabled) {
    console.log('[Transcript] Auto-closing widget after extraction');
    widget.classList.add('yt-ai-collapsed');
    const closeBtn = widget.querySelector('#yt-ai-close-btn');
    if (closeBtn) {
      closeBtn.textContent = '⬇️';
      closeBtn.title = 'Expand';
    }
  }
}
