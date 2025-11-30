export function createWidgetHTML(cfg = {}) {
  const tabs = cfg.tabs || { summary: true, segments: true, chat: true, comments: true };

  const tabItems = [];
  if (tabs.summary) tabItems.push('<div class="yt-ai-tab active" data-tab="summary">Default</div>');
  if (tabs.segments) tabItems.push('<div class="yt-ai-tab" data-tab="segments">Segments</div>');
  if (tabs.chat) tabItems.push('<div class="yt-ai-tab" data-tab="chat">Chat</div>');
  if (tabs.comments) tabItems.push('<div class="yt-ai-tab" data-tab="comments">Comments</div>');

  return `
    <div id="yt-ai-resize-handle-width" class="yt-ai-resize-handle-width" title="Drag to resize width" style="display:none;">⋮⋮⋮</div>

    <div class="yt-ai-header">
      <div class="yt-ai-title">
        ✨ YouTube AI Navigator
        <span id="yt-ai-full-video-label" class="yt-ai-badge" style="display:none"></span>
      </div>
      <div class="yt-ai-header-actions">
        <button id="yt-ai-close-btn" class="yt-ai-icon-btn" title="Close">❌</button>
      </div>
    </div>

    <div class="yt-ai-tabs">
      ${tabItems.join('')}
    </div>

    <div id="yt-ai-content-area" class="yt-ai-content">
      <div class="yt-ai-loading">
        <div class="yt-ai-spinner"></div>
        <div class="yt-ai-loading-text">Initializing...</div>
      </div>
    </div>

    <div id="yt-ai-chat-input-area" class="yt-ai-chat-input" style="display: none;">
      <input type="text" id="yt-ai-chat-input" placeholder="Ask about this video...">
      <button id="yt-ai-chat-send">Send</button>
    </div>

    <div id="yt-ai-resize-handle" class="yt-ai-resize-handle" title="Drag to resize">⋮</div>
  `;
}
