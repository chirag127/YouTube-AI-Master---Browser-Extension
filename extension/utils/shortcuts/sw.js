// Service Worker shortcuts (no window/document access)

// Chrome APIs
export const rt = chrome.runtime;
export const t = chrome.tabs;
export const url = p => rt.getURL(p);
export const msg = (m, d) => rt.sendMessage(typeof m === 'string' ? { action: m, ...d } : m);
export const ol = c => rt.onMessage.addListener(c);

// Storage
export const lg = chrome.storage.local.get.bind(chrome.storage.local);
export const ls = chrome.storage.local.set.bind(chrome.storage.local);
export const lr = chrome.storage.local.remove.bind(chrome.storage.local);
export const sg = chrome.storage.sync.get.bind(chrome.storage.sync);
export const ss = chrome.storage.sync.set.bind(chrome.storage.sync);

// Timers
export const si = setInterval;
export const ci = clearInterval;
export const st = setTimeout;
export const ct = clearTimeout;

// Console
export const l = console.log;
export const cw = console.warn;
export const ce = console.error;
export const e = console.error;

// JSON
export const p = JSON.parse;
export const s = JSON.stringify;
export const jp = JSON.parse;
export const js = JSON.stringify;

// String/Array
export const slc = (a, s, e) => a.slice(s, e);
export const uc = s => s.toUpperCase();
export const ps = (a, v) => a.push(v);
export const jn = (a, sep) => a.join(sep);
export const tr = s => s.trim();
export const rp = (s, f, r) => s.replace(f, r);
export const sp = (s, sep) => s.split(sep);
export const inc = (s, v) => s.includes(v);
export const mt = (s, r) => s.match(r);

// Math
export const mfl = Math.floor;
export const mc = Math.ceil;
export const mr = Math.round;
export const mn = Math.min;
export const mx = Math.max;

// Array
export const mp = (a, fn) => a.map(fn);
export const fl = (a, fn) => a.filter(fn);
export const fd = (a, fn, init) => a.reduce(fn, init);
export const fm = (a, fn) => a.find(fn);
export const sm = (a, fn) => a.some(fn);
export const ev = (a, fn) => a.every(fn);

// Object
export const ks = Object.keys;
export const vs = Object.values;
export const es = Object.entries;
export const as = Object.assign;

// Fetch shortcuts
export * from '../shortcuts/network.js';

// Notifications
export const nt = (title, message, opts = {}) =>
    chrome.notifications?.create({ type: 'basic', iconUrl: chrome.runtime.getURL('assets/icon48.png'), title, message, ...opts });

// Error class
export class E extends Error {
    constructor(msg, code) {
        super(msg);
        this.code = code;
    }
}
