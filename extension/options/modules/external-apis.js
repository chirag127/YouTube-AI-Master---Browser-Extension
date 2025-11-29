export class ExternalAPIs {
  constructor(s, a) {
    this.s = s;
    this.a = a;
  }

  init() {
    const api = this.s.get().externalApis || {};
    this.set('tmdbApiKey', api.tmdb || '');
    this.set('twitchClientId', api.twitchClientId || '');
    this.set('twitchAccessToken', api.twitchAccessToken || '');
    this.set('newsDataApiKey', api.newsData || '');
    this.set('googleFactCheckApiKey', api.googleFactCheck || '');

    this.a.attachToAll({
      tmdbApiKey: { path: 'externalApis.tmdb' },
      twitchClientId: { path: 'externalApis.twitchClientId' },
      twitchAccessToken: { path: 'externalApis.twitchAccessToken' },
      newsDataApiKey: { path: 'externalApis.newsData' },
      googleFactCheckApiKey: { path: 'externalApis.googleFactCheck' },
    });
  }

  set(id, v) {
    const el = document.getElementById(id);
    if (el) el.value = v;
  }
}
