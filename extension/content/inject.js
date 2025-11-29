const l = console.log;
const e = console.error;
const ce = document.createElement;
const d = document;
(async () => {
  try {
    const { url, cr, ap, l, e, d } = await import(chrome.runtime.getURL('utils/shortcuts.js'));
    const s = d.createElement('script');
    s.src = url('content/transcript/xhr-interceptor.js');
    s.type = 'module';
    ap(d.head || d.documentElement, s);
    s.onload = function () {
      this.remove();
    };
    l('[YouTube AI Master] Interceptor injected');
  } catch (err) {
    e('[YouTube AI Master] Failed to inject interceptor:', err);
  }
})();
