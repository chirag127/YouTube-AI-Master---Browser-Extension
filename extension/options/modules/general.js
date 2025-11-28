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
        };

        // Load values
        const s = this.settings.get();
        if (els.outputLanguage)
            els.outputLanguage.value = s.outputLanguage || "en";
        if (els.transcriptMethod)
            els.transcriptMethod.value = s.transcriptMethod || "auto";
        if (els.transcriptLanguage)
            els.transcriptLanguage.value = s.transcriptLanguage || "en";
        if (els.autoAnalyze) els.autoAnalyze.checked = s.autoAnalyze;
        if (els.saveHistory) els.saveHistory.checked = s.saveHistory;

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
