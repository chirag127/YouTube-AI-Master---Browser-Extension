export class GeneralSettings {
    constructor(settingsManager, uiManager) {
        this.settings = settingsManager;
        this.ui = uiManager;
    }

    init() {
        const els = {
            outputLanguage: document.getElementById("outputLanguage"),
            transcriptMethod: document.getElementById("transcriptMethod"),
            transcriptLanguage: document.getElementById("transcriptLanguage"),
            autoAnalyze: document.getElementById("autoAnalyze"),
            saveHistory: document.getElementById("saveHistory"),
            clearHistory: document.getElementById("clearHistory"),
            // Auto-Liker
            autoLike: document.getElementById("autoLike"),
            autoLikeThreshold: document.getElementById("autoLikeThreshold"),
            thresholdValue: document.getElementById("thresholdValue"),
            autoLikeLive: document.getElementById("autoLikeLive"),
            likeIfNotSubscribed: document.getElementById("likeIfNotSubscribed"),
            autoLikeSettings: document.getElementById("autoLikeSettings"),
        };

        // Load values
        const s = this.settings.get();
        if (els.outputLanguage) els.outputLanguage.value = s.outputLanguage || "en";
        if (els.transcriptMethod) els.transcriptMethod.value = s.transcriptMethod || "auto";
        if (els.transcriptLanguage) els.transcriptLanguage.value = s.transcriptLanguage || "en";
        if (els.autoAnalyze) els.autoAnalyze.checked = s.autoAnalyze;
        if (els.saveHistory) els.saveHistory.checked = s.saveHistory;

        // Auto-Liker Load
        if (els.autoLike) {
            els.autoLike.checked = s.autoLike || false;
            if (els.autoLikeSettings) {
                els.autoLikeSettings.classList.toggle("hidden", !s.autoLike);
            }
        }
        if (els.autoLikeThreshold) {
            els.autoLikeThreshold.value = s.autoLikeThreshold || 50;
            if (els.thresholdValue) els.thresholdValue.textContent = `${s.autoLikeThreshold || 50}%`;
        }
        if (els.autoLikeLive) els.autoLikeLive.checked = s.autoLikeLive || false;
        if (els.likeIfNotSubscribed) els.likeIfNotSubscribed.checked = s.likeIfNotSubscribed || false;

        // Listeners
        if (els.outputLanguage)
            els.outputLanguage.addEventListener("change", (e) =>
                this.settings.save({ outputLanguage: e.target.value })
            );
        if (els.transcriptMethod)
            els.transcriptMethod.addEventListener("change", (e) =>
                this.settings.save({ transcriptMethod: e.target.value })
            );
        if (els.transcriptLanguage)
            els.transcriptLanguage.addEventListener("change", (e) =>
                this.settings.save({ transcriptLanguage: e.target.value })
            );
        if (els.autoAnalyze)
            els.autoAnalyze.addEventListener("change", (e) =>
                this.settings.save({ autoAnalyze: e.target.checked })
            );
        if (els.saveHistory)
            els.saveHistory.addEventListener("change", (e) =>
                this.settings.save({ saveHistory: e.target.checked })
            );

        // Auto-Liker Listeners
        if (els.autoLike) {
            els.autoLike.addEventListener("change", (e) => {
                const checked = e.target.checked;
                this.settings.save({ autoLike: checked });
                if (els.autoLikeSettings) {
                    els.autoLikeSettings.classList.toggle("hidden", !checked);
                }
            });
        }
        if (els.autoLikeThreshold) {
            els.autoLikeThreshold.addEventListener("input", (e) => {
                const val = e.target.value;
                if (els.thresholdValue) els.thresholdValue.textContent = `${val}%`;
                this.settings.save({ autoLikeThreshold: parseInt(val) });
            });
        }
        if (els.autoLikeLive) {
            els.autoLikeLive.addEventListener("change", (e) =>
                this.settings.save({ autoLikeLive: e.target.checked })
            );
        }
        if (els.likeIfNotSubscribed) {
            els.likeIfNotSubscribed.addEventListener("change", (e) =>
                this.settings.save({ likeIfNotSubscribed: e.target.checked })
            );
        }

        if (els.clearHistory) {
            els.clearHistory.addEventListener("click", async () => {
                if (confirm("Are you sure? This cannot be undone.")) {
                    await chrome.storage.local.remove("summaryHistory");
                    this.ui.showToast("History cleared");
                }
            });
        }
    }
}
