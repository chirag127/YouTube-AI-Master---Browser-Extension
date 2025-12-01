const BASE_URL = 'https://factchecktools.googleapis.com/v1alpha1';

export class GoogleFactCheckAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async searchClaims(query) {
    if (!this.apiKey) return [];
    try {
      const response = await fetch(
        `${BASE_URL}/claims:search?key=${this.apiKey}&query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      return data?.claims || [];
    } catch (error) {
      console.error('[GoogleFactCheck] searchClaims fail:', error.message);
      return [];
    }
  }
}
