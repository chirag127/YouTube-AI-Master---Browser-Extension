export const sponsorPatterns = [
  /\b(?:sponsored\s+by|brought\s+to\s+you\s+by|thanks\s+to\s+(?:our\s+)?sponsor|partnered\s+with|in\s+partnership\s+with|this\s+video\s+is\s+sponsored|today'?s\s+sponsor)\b/gi,
  /\b(?:use\s+(?:code|promo\s+code)|discount\s+code|coupon\s+code|affiliate\s+link)\b/gi,
  /\b(?:get\s+\d+%\s+off|save\s+\d+%|special\s+offer|limited\s+time\s+offer)\b/gi,
];
export const sponsorTransitions = [
  /\b(?:but\s+first|before\s+we\s+(?:get\s+)?start|speaking\s+of|now\s+back\s+to|anyway|alright)\b/gi,
];
export const detectSponsor = t => {
  const m = [];
  sponsorPatterns.forEach((p, i) => {
    const r = p.exec(t);
    if (r) m.push({ type: 'sponsor', pattern: i, match: r[0], index: r.index });
  });
  return m;
};
