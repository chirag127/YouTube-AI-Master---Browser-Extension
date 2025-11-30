import { vi } from 'vitest';

global.chrome = {
  runtime: {
    getURL: vi.fn(path => `/extension/${path}`),
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
    sendMessage: vi.fn(),
  },
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
    sync: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
  tabs: {
    query: vi.fn(),
    create: vi.fn(),
  },
};

global.window = {
  ...global.window,
  top: global.window,
  location: {
    hostname: 'www.youtube.com',
    search: '?v=test123',
  },
  scrollTo: vi.fn(),
};

const body = global.document.createElement('body');
const head = global.document.createElement('head');

global.document.body = body;
global.document.documentElement.appendChild(head);
global.document.documentElement.appendChild(body);

console.log('Setup: document.body exists:', !!global.document.body);
