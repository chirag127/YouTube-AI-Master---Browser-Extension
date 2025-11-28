export class ExternalAPIs {
    constructor(settingsManager, uiManager) {
        this.settings = settingsManager;
        this.ui = uiManager;
    }

    init() {
        const els = {
            tmdbApiKey: document.getElementById("tmdbApiKey"),
            twitchClientId: document.getElementById("twitchClientId"),
            twitchAccessToken: document.getElementById("twitchAccessToken"),
            newsDataApiKey: document.getElementById("newsDataApiKey"),
            googleFactCheckApiKey: document.getElementById(
                "googleFactCheckApiKey"
            ),
        };

        const s = this.settings.get();
        if (els.tmdbApiKey) els.tmdbApiKey.value = s.tmdbApiKey || "";
        if (els.twitchClientId)
            els.twitchClientId.value = s.twitchClientId || "";
        if (els.twitchAccessToken)
            els.twitchAccessToken.value = s.twitchAccessToken || "";
        if (els.newsDataApiKey)
            els.newsDataApiKey.value = s.newsDataApiKey || "";
        if (els.googleFactCheckApiKey)
            els.googleFactCheckApiKey.value = s.googleFactCheckApiKey || "";

        // Listeners
        if (els.tmdbApiKey)
            els.tmdbApiKey.addEventListener("change", (e) =>
                this.settings.save({ tmdbApiKey: e.target.value.trim() })
            );
        if (els.twitchClientId)
            els.twitchClientId.addEventListener("change", (e) =>
                this.settings.save({ twitchClientId: e.target.value.trim() })
            );
        if (els.twitchAccessToken)
            els.twitchAccessToken.addEventListener("change", (e) =>
                this.settings.save({ twitchAccessToken: e.target.value.trim() })
            );
        if (els.newsDataApiKey)
            els.newsDataApiKey.addEventListener("change", (e) =>
                this.settings.save({ newsDataApiKey: e.target.value.trim() })
            );
        if (els.googleFactCheckApiKey)
            els.googleFactCheckApiKey.addEventListener("change", (e) =>
                this.settings.save({
                    googleFactCheckApiKey: e.target.value.trim(),
                })
            );
    }
}
