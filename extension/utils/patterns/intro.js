export const introPatterns = [
  /\b(?:hey\s+(?:guys|everyone|folks)|what'?s\s+up\s+(?:guys|everyone)|welcome\s+back|hello\s+(?:everyone|there))\b/gi,
  /\b(?:in\s+today'?s\s+video|today\s+we'?re\s+(?:going\s+to|gonna)|this\s+video\s+is\s+about)\b/gi,
  /\b(?:before\s+we\s+(?:begin|start)|let'?s\s+get\s+(?:started|into\s+it))\b/gi,
];
export const detectIntro = t => {
  const m = [];
  introPatterns.forEach((p, i) => {
    const r = p.exec(t);
    if (r) m.push({ type: 'intro', pattern: i, match: r[0], index: r.index });
  });
  return m;
};
