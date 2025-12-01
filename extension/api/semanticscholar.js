const BASE_URL = 'https://api.semanticscholar.org/graph/v1';

export class SemanticScholarAPI {
  async searchPaper(query) {
    try {
      const response = await fetch(
        `${BASE_URL}/paper/search?query=${encodeURIComponent(query)}&limit=1&fields=title,authors,year,abstract`
      );
      const data = await response.json();
      return data?.data?.[0] || null;
    } catch (error) {
      console.error('[SemanticScholar] searchPaper fail:', error.message);
      return null;
    }
  }
}
