import { safeFetch, l, enc } from '../utils/shortcuts.js';

const BASE_URL = 'https://musicbrainz.org/ws/2';
const UA = 'YouTubeAIMaster/1.0.0 ( contact@example.com )';

export class MusicBrainzAPI {
  async searchArtist(query) {
    l(`[MB] Search Artist: ${query}`);
    const data = await safeFetch(`${BASE_URL}/artist?query=${enc(query)}&fmt=json`, {
      headers: { 'User-Agent': UA },
    });
    return data?.artists?.[0] || null;
  }
  async searchRelease(query, artist) {
    const q = artist ? `${query} AND artist:${artist}` : query;
    l(`[MB] Search Release: ${q}`);
    const data = await safeFetch(`${BASE_URL}/release?query=${enc(q)}&fmt=json`, {
      headers: { 'User-Agent': UA },
    });
    return data?.releases?.[0] || null;
  }
}
