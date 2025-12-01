const BASE_URL = 'https://newsdata.io/api/1';

export class NewsDataAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async searchNews(query, language = 'en') {
    if (!this.apiKey) return [];
    try {
      const response = await fetch(
        `${BASE_URL}/news?apikey=${this.apiKey}&q=${encodeURIComponent(query)}&language=${language}`
      );
      const data = await response.json();
      return data?.results || [];
    } catch (error) {
      console.error('[NewsData] searchNews fail:', error.message);
      return [];
    }
  }
}
