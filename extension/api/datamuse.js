const BASE_URL = 'https://api.datamuse.com';

export class DatamuseAPI {
  async getRelatedWords(word) {
    try {
      const response = await fetch(`${BASE_URL}/words?ml=${encodeURIComponent(word)}&max=5`);
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('[Datamuse] getRelatedWords fail:', error.message);
      return [];
    }
  }
}
