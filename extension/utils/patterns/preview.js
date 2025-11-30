export const previewPatterns = [
  /\b(?:coming\s+up|up\s+next|later\s+in\s+(?:this\s+)?video|stick\s+around\s+(?:for|to\s+see))\b/gi,
  /\b(?:previously\s+on|last\s+time|in\s+the\s+(?:last|previous)\s+(?:video|episode))\b/gi,
  /\b(?:recap|let'?s\s+recap|quick\s+recap)\b/gi,
];
export const detectPreview = t => {
  const m = [];
  previewPatterns.forEach((p, i) => {
    const r = p.exec(t);
    if (r) m.push({ type: 'preview', pattern: i, match: r[0], index: r.index });
  });
  return m;
};
