import { DEFAULT_SETTINGS } from "./settings-manager.js";

export class AdvancedSettings {
    constructor(settingsManager, uiManager) {
        this.settings = settingsManager;
        this.ui = uiManager;
    }

    init() {
        const els = {
            debugMode: document.getElementById("debugMode"),
            exportSettings: document.getElementById("exportSettings"),
            importSettings: document.getElementById("importSettings"),
            importFile: document.getElementById("importFile"),
            resetDefaults: document.getElementById("resetDefaults"),
        };

        const s = this.settings.get();
        if (els.debugMode) {
            els.debugMode.checked = s.debugMode;
            els.debugMode.addEventListener("change", (e) =>
                this.settings.save({ debugMode: e.target.checked })
            );
        }

        if (els.exportSettings) {
            els.exportSettings.addEventListener("click", () => {
                const data = JSON.stringify(this.settings.get(), null, 2);
                const blob = new Blob([data], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "youtube-ai-master-settings.json";
                a.click();
            });
        }

        if (els.importSettings) {
            els.importSettings.addEventListener("click", () => {
                if (els.importFile) els.importFile.click();
            });
        }

        if (els.importFile) {
            els.importFile.addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = async (ev) => {
                    try {
                        const imported = JSON.parse(ev.target.result);
                        await this.settings.save(imported);
                        // Reload page to reflect changes
                        window.location.reload();
                    } catch (err) {
                        console.error("Import failed:", err);
                        this.ui.showToast("Invalid settings file", "error");
                    }
                };
                reader.readAsText(file);
            });
        }

        if (els.resetDefaults) {
            els.resetDefaults.addEventListener("click", async () => {
                if (confirm("Reset all settings to default?")) {
                    await this.settings.reset();
                    window.location.reload();
                }
            });
        }
    }
}
