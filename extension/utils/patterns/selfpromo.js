export const selfpromoPatterns = [
  /\b(?:my\s+(?:course|merch|merchandise|patreon|website|book|app|product)|check\s+out\s+my|link\s+in\s+(?:the\s+)?description|available\s+on\s+my)\b/gi,
  /\b(?:join\s+my\s+(?:discord|community|membership)|become\s+a\s+(?:member|patron)|support\s+me\s+on)\b/gi,
  /\b(?:buy\s+my|purchase\s+my|get\s+my|download\s+my)\b/gi,
];
export const detectSelfpromo = t => {
  const m = [];
  selfpromoPatterns.forEach((p, i) => {
    const r = p.exec(t);
    if (r) m.push({ type: 'selfpromo', pattern: i, match: r[0], index: r.index });
  });
  return m;
};
