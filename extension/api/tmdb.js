const BASE_URL = 'https://api.themoviedb.org/3';

export class TmdbAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async searchMovie(query) {
    if (!this.apiKey) return null;
    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      return data?.results?.[0] || null;
    } catch (error) {
      console.error('[TMDB] searchMovie fail:', error.message);
      return null;
    }
  }

  async searchTV(query) {
    if (!this.apiKey) return null;
    try {
      const response = await fetch(
        `${BASE_URL}/search/tv?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      return data?.results?.[0] || null;
    } catch (error) {
      console.error('[TMDB] searchTV fail:', error.message);
      return null;
    }
  }

  async getDetails(id, type = 'movie') {
    if (!this.apiKey || !id) return null;
    try {
      const response = await fetch(
        `${BASE_URL}/${type}/${id}?api_key=${this.apiKey}&append_to_response=credits,similar`
      );
      return await response.json();
    } catch (error) {
      console.error('[TMDB] getDetails fail:', error.message);
      return null;
    }
  }
}
