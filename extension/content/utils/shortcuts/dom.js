export const d = document;
export const qs = (s, p = d) => p.querySelector(s);
export const qsa = (s, p = d) => p.querySelectorAll(s);
export const ce = t => d.createElement(t);
export const ael = (e, t, f, o) => e.addEventListener(t, f, o);
export const rel = (e, t, f, o) => e.removeEventListener(t, f, o);
export const ap = (p, c) => p.appendChild(c);
export const rm = e => e.remove();

export const dc = d;
export const id = s => d.getElementById(s);
export const ih = (e, h) => (e.innerHTML = h);
export const tc = (e, t) => (e.textContent = t);
export const tx = (e, t) => (e.innerText = t);
export const fc = e => e.firstChild;
export const of = rel;
export const on = ael;
