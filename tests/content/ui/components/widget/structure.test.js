import { describe, it, expect } from 'vitest';
import { createWidgetHTML } from '../../../../../extension/content/ui/components/widget/structure.js';

describe('Widget Structure', () => {
  it('should generate default tabs', () => {
    const html = createWidgetHTML();
    expect(html).toContain('data-tab="summary"');
    expect(html).toContain('data-tab="segments"');
    expect(html).toContain('data-tab="chat"');
    expect(html).toContain('data-tab="comments"');
  });

  it('should respect config to hide tabs', () => {
    const cfg = { tabs: { summary: true, segments: false, chat: false, comments: false } };
    const html = createWidgetHTML(cfg);
    expect(html).toContain('data-tab="summary"');
    expect(html).not.toContain('data-tab="segments"');
    expect(html).not.toContain('data-tab="chat"');
    expect(html).not.toContain('data-tab="comments"');
  });

  it('should include header elements', () => {
    const html = createWidgetHTML();
    expect(html).toContain('YouTube AI Navigator');
    expect(html).toContain('yt-ai-close-btn');
  });

  it('should include resize handles', () => {
    const html = createWidgetHTML();
    expect(html).toContain('yt-ai-resize-handle');
    expect(html).toContain('yt-ai-resize-handle-width');
  });
});
