import { sl } from '../../utils/shortcuts.js';

export async function saveVideoData(v, d) {
  const k = `video_${v}`,
    e = await getVideoData(v),
    m = { videoId: v, timestamp: Date.now(), lastAccessed: Date.now(), ...e, ...d };
  await sl({ [k]: m });
  return m;
}
export async function getVideoData(v) {
  const r = await sl(`video_${v}`),
    d = r[`video_${v}`];
  if (d) {
    d.lastAccessed = Date.now();
    await sl({ [`video_${v}`]: d });
  }
  return d || null;
}
export async function hasVideoData(v) {
  const d = await getVideoData(v);
  return !!d;
}
export async function deleteVideoData(v) {
  await sl(`video_${v}`, null);
}
export async function getCachedTranscript(v) {
  const d = await getVideoData(v);
  return d?.transcript || null;
}
export async function getCachedSummary(v) {
  const d = await getVideoData(v);
  return d?.summary || null;
}
export async function getCachedSegments(v) {
  const d = await getVideoData(v);
  return d?.segments || null;
}
export async function getCachedComments(v) {
  const d = await getVideoData(v);
  return d?.comments || null;
}
export async function getCachedChat(v) {
  const d = await getVideoData(v);
  return d?.chatHistory || [];
}
export async function saveTranscriptCache(v, t) {
  return saveVideoData(v, { transcript: t });
}
export async function saveSummaryCache(v, s, f, i) {
  return saveVideoData(v, { summary: s, faq: f, insights: i });
}
export async function saveSegmentsCache(v, s) {
  return saveVideoData(v, { segments: s });
}
export async function saveCommentsCache(v, c, cs) {
  return saveVideoData(v, { comments: c, commentSummary: cs });
}
export async function saveChatMessage(v, r, m) {
  const d = await getVideoData(v),
    h = d?.chatHistory || [];
  h.push({ role: r, message: m, timestamp: Date.now() });
  return saveVideoData(v, { chatHistory: h });
}
export async function saveMetadataCache(v, m) {
  return saveVideoData(v, { metadata: m });
}
