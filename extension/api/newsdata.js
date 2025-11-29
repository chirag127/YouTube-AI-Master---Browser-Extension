import { safeFetch, l, enc } from '../utils/shortcuts.js';

const BASE_URL = 'https://newsdata.io/api/1';

export class NewsDataAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }
  async searchNews(query, language = 'en') {
    if (!this.apiKey) return null;
    l(`[NewsData] Searching: ${query}`);
    const data = await safeFetch(
      `${BASE_URL}/news?apikey=${this.apiKey}&q=${enc(query)}&language=${language}`
    );
    return data?.results || [];
  }
}
