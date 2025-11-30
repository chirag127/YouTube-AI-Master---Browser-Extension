import { gu } from '../../utils/shortcuts/runtime.js';
import { af } from '../../utils/shortcuts/array.js';

const { findSecondaryColumn, isWidgetProperlyVisible } = await import(gu('content/utils/dom.js'));
const { initTabs } = await import(gu('content/ui/tabs.js'));
const { attachEventListeners } = await import(gu('content/handlers/events.js'));
const { createWidgetHTML } = await import(gu('content/ui/components/widget/structure.js'));
const { qs: $, id: ge, on, el: ce, wfe, mo } = await import(gu('utils/shortcuts/dom.js'));
const { e } = await import(gu('utils/shortcuts/log.js'));
const { si, ci, to } = await import(gu('utils/shortcuts/global.js'));
const { log } = await import(gu('utils/shortcuts/core.js'));

let widgetContainer = null,
  resizeObserver = null,
  containerObserver = null,
  positionCheckInterval = null,
  lastKnownContainer = null;

function updateWidgetHeight() {
  try {
    if (!widgetContainer) return;
    const p = $('#movie_player') || $('.html5-video-player');
    if (p) {
      const h = p.offsetHeight;
      if (h > 0) widgetContainer.style.maxHeight = `${h}px`;
    }
  } catch (err) {
    e('Err:updateWidgetHeight', err);
  }
}

function ensureWidgetAtTop(c) {
  try {
    if (!widgetContainer) return;
    if (!c) {
      c = widgetContainer.parentElement;
      if (!c) {
        reattachWidget();
        return;
      }
    }
    lastKnownContainer = c;
    if (c.firstChild !== widgetContainer) {
      c.insertBefore(widgetContainer, c.firstChild);
    }
    if (!widgetContainer.style.order || widgetContainer.style.order !== '-9999')
      widgetContainer.style.order = '-9999';
  } catch (err) {
    e('Err:ensureWidgetAtTop', err);
  }
}

function reattachWidget() {
  try {
    if (!widgetContainer) return;
    const sc = findSecondaryColumn();
    if (sc) {
      sc.insertBefore(widgetContainer, sc.firstChild);
      lastKnownContainer = sc;
      setupObservers(sc);
    } else e('Err:reattachWidget', 'Cannot reattach widget: secondary column not found');
  } catch (err) {
    e('Err:reattachWidget', err);
  }
}

function startPositionMonitoring() {
  try {
    if (positionCheckInterval) ci(positionCheckInterval);
    positionCheckInterval = si(() => {
      if (!widgetContainer) {
        ci(positionCheckInterval);
        return;
      }
      if (!document.contains(widgetContainer)) {
        reattachWidget();
        return;
      }
      const p = widgetContainer.parentElement;
      if (p && p.firstChild !== widgetContainer) ensureWidgetAtTop(p);
    }, 500);
  } catch (err) {
    e('Err:startPositionMonitoring', err);
  }
}

export async function injectWidget() {
  try {
    const ex = ge('yt-ai-master-widget');
    if (ex) {
      if (isWidgetProperlyVisible(ex)) {
        widgetContainer = ex;
        const c = ex.parentElement;
        lastKnownContainer = c;
        ensureWidgetAtTop(c);
        setupObservers(c);
        startPositionMonitoring();
        log('Widget already properly visible, reusing existing');
        return;
      }
      log('Widget exists but not properly visible, removing and re-injecting');
      ex.remove();
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    if (containerObserver) {
      containerObserver.disconnect();
      containerObserver = null;
    }
    let sc = findSecondaryColumn(),
      att = 0;
    while (!sc && att < 20) {
      try {
        sc = await wfe(
          '#secondary-inner, #secondary, #related, ytd-watch-next-secondary-results-renderer, ytd-watch-flexy #secondary',
          500
        );
        if (sc) break;
      } catch (err) {
        void err;
      }
      att++;
      await new Promise(r => to(r, 200));
    }
    if (!sc) {
      sc = $('#columns');
      if (!sc) {
        e('Target container not found. Widget injection aborted.');
        return;
      }
      log('Using fallback #columns container');
    }
    widgetContainer = ce('div');
    widgetContainer.id = 'yt-ai-master-widget';
    widgetContainer.style.order = '-9999';
    widgetContainer.innerHTML = createWidgetHTML();
    sc.insertBefore(widgetContainer, sc.firstChild);
    lastKnownContainer = sc;
    setupWidgetLogic(widgetContainer);
    setupObservers(sc);
    startPositionMonitoring();
  } catch (err) {
    e('Err:injectWidget', err);
  }
}

function setupWidgetLogic(c) {
  try {
    const cb = $('#yt-ai-close-btn', c);
    if (cb) {
      on(cb, 'click', () => {
        const ic = c.classList.contains('yt-ai-collapsed');
        if (ic) {
          c.classList.remove('yt-ai-collapsed');
          cb.textContent = '❌';
          cb.title = 'Collapse';
        } else {
          c.classList.add('yt-ai-collapsed');
          cb.textContent = '⬇️';
          cb.title = 'Expand';
        }
      });
    }
    initTabs(c);
    attachEventListeners(c);
  } catch (err) {
    e('Err:setupWidgetLogic', err);
  }
}

function setupObservers(c) {
  try {
    updateWidgetHeight();
    const p = $('#movie_player') || $('.html5-video-player');
    if (resizeObserver) resizeObserver.disconnect();
    if (p) {
      resizeObserver = new ResizeObserver(() => updateWidgetHeight());
      resizeObserver.observe(p);
    }
    if (containerObserver) containerObserver.disconnect();
    containerObserver = mo(m => {
      for (const mu of m) {
        if (mu.type === 'childList') {
          if (af(mu.removedNodes).includes(widgetContainer)) {
            to(() => reattachWidget(), 100);
            return;
          }
          if (c.firstChild !== widgetContainer && !af(mu.addedNodes).includes(widgetContainer))
            ensureWidgetAtTop(c);
        }
      }
    });
    containerObserver.observe(c, { childList: true, subtree: false });
    const bo = mo(() => {
      if (!document.contains(widgetContainer)) {
        reattachWidget();
      } else if (widgetContainer.parentElement !== lastKnownContainer) {
        const np = widgetContainer.parentElement;
        if (np) {
          lastKnownContainer = np;
          setupObservers(np);
        }
      }
    });
    bo.observe(document.body, { childList: true, subtree: true });
  } catch (err) {
    e('Err:setupObservers', err);
  }
}

export function getWidget() {
  try {
    return widgetContainer;
  } catch (err) {
    e('Err:getWidget', err);
    return null;
  }
}
