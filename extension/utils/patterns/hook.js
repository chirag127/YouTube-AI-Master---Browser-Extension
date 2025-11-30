export const hookPatterns = [
  /\b(?:watch\s+(?:this|what\s+happens)|you\s+won'?t\s+believe|wait\s+(?:for\s+it|till\s+the\s+end))\b/gi,
  /\b(?:before\s+we\s+(?:get\s+)?start|first\s+things\s+first|quick\s+announcement)\b/gi,
  /\b(?:in\s+this\s+video|today\s+I'?m\s+(?:going\s+to|gonna)|we'?re\s+going\s+to)\b/gi,
];
export const detectHook = t => {
  const m = [];
  hookPatterns.forEach((p, i) => {
    const r = p.exec(t);
    if (r) m.push({ type: 'hook', pattern: i, match: r[0], index: r.index });
  });
  return m;
};
