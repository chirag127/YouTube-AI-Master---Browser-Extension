// DOM utility shortcuts
export const d = document;
export const dc = document;

// Query selectors
export const qs = (s, r = document) => r.querySelector(s);
export const $ = qs; // Alias
export const qsa = (s, r = document) => r.querySelectorAll(s);
export const $$ = qsa; // Alias
export const qa = (s, r = document) => [...r.querySelectorAll(s)];
export const ge = i => document.getElementById(i);
export const id = ge; // Alias
export const gebi = ge; // Alias

// Element creation and manipulation
export const ce = t => document.createElement(t);
export const tx = t => document.createTextNode(t);
export const ap = (p, c) => p.appendChild(c);
export const rm = e => e?.remove();

// Content manipulation
export const tc = (e, t) => (t === undefined ? e.textContent : (e.textContent = t));
export const ih = (e, h) => (h === undefined ? e.innerHTML : (e.innerHTML = h));
export const vl = (e, v) => (v === undefined ? e.value : (e.value = v));

// Class manipulation
export const rc = (e, c) => e.classList.remove(c);
export const ac = (e, c) => e.classList.add(c);
export const tc2 = (e, c) => e.classList.toggle(c);
export const hc = (e, c) => e.classList.contains(c);

// Event listeners
export const ael = (e, t, f, o) => e.addEventListener(t, f, o);
export const on = ael; // Alias
export const rel = (e, t, f, o) => e.removeEventListener(t, f, o);
export const of = rel; // Alias
export const off = rel; // Alias

// Traversal
export const fc = e => e.firstChild;

// Visibility
export const vs = (e, v) => (e.style.display = v ? '' : 'none');

// Iteration helper
export const forEach = (n, f) => n.forEach(f);
