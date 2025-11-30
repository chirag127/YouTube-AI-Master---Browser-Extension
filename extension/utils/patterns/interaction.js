export const interactionPatterns = [
  /\b(?:like\s+and\s+subscribe|smash\s+that\s+like|hit\s+the\s+(?:like\s+)?button|don'?t\s+forget\s+to\s+(?:like|subscribe))\b/gi,
  /\b(?:subscribe\s+(?:for\s+more|to\s+my\s+channel)|turn\s+on\s+notifications|hit\s+the\s+bell|enable\s+notifications)\b/gi,
  /\b(?:leave\s+a\s+comment|comment\s+(?:below|down)|let\s+me\s+know\s+in\s+the\s+comments)\b/gi,
  /\b(?:share\s+this\s+video|follow\s+me\s+on|check\s+out\s+my\s+(?:instagram|twitter|tiktok))\b/gi,
];
export const detectInteraction = t => {
  const m = [];
  interactionPatterns.forEach((p, i) => {
    const r = p.exec(t);
    if (r) m.push({ type: 'interaction', pattern: i, match: r[0], index: r.index });
  });
  return m;
};
