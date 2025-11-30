export const fillerPatterns = [
  /\b(?:by\s+the\s+way|anyway|so\s+yeah|um|uh|like\s+I\s+said)\b/gi,
  /\b(?:off\s+topic|random\s+(?:thought|tangent)|side\s+note)\b/gi,
  /\b(?:fun\s+fact|interesting\s+(?:fact|story)|quick\s+story)\b/gi,
];
export const detectFiller = t => {
  const m = [];
  fillerPatterns.forEach((p, i) => {
    const r = p.exec(t);
    if (r) m.push({ type: 'filler', pattern: i, match: r[0], index: r.index });
  });
  return m;
};
