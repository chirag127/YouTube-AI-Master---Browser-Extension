export const outroPatterns = [
  /\b(?:that'?s\s+(?:it|all)\s+for\s+(?:today|now)|thanks\s+for\s+watching|see\s+you\s+(?:next\s+time|in\s+the\s+next))\b/gi,
  /\b(?:until\s+next\s+time|catch\s+you\s+later|peace\s+out|take\s+care)\b/gi,
  /\b(?:if\s+you\s+enjoyed|hope\s+you\s+enjoyed|enjoyed\s+this\s+video)\b/gi,
];
export const detectOutro = t => {
  const m = [];
  outroPatterns.forEach((p, i) => {
    const r = p.exec(t);
    if (r) m.push({ type: 'outro', pattern: i, match: r[0], index: r.index });
  });
  return m;
};
