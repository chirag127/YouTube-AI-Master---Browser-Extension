import { safeFetch, l, enc } from '../utils/shortcuts.js';

const BASE_URL = 'https://api.semanticscholar.org/graph/v1';

export class SemanticScholarAPI {
  async searchPaper(query) {
    l(`[SemanticScholar] Searching: ${query}`);
    const data = await safeFetch(
      `${BASE_URL}/paper/search?query=${enc(
        query
      )}&limit=1&fields=title,abstract,authors,year,citationCount`
    );
    return data?.data?.[0] || null;
  }
}
