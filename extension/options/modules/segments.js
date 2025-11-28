import {
    SEGMENT_CATEGORIES,
    DEFAULT_SEGMENT_CONFIG,
} from "./settings-manager.js";

export class SegmentsConfig {
    constructor(settingsManager, uiManager) {
        this.settings = settingsManager;
        this.ui = uiManager;
    }

    init() {
        const els = {
            enableSegments: document.getElementById("enableSegments"),
            segmentsGrid: document.getElementById("segmentsGrid"),
            skipAllBtn: document.getElementById("skipAllBtn"),
            speedAllBtn: document.getElementById("speedAllBtn"),
            resetAllBtn: document.getElementById("resetAllBtn"),
        };

        const s = this.settings.get();
        if (els.enableSegments) {
            els.enableSegments.checked = s.enableSegments;
            els.enableSegments.addEventListener("change", (e) =>
                this.settings.save({ enableSegments: e.target.checked })
            );
        }

        if (els.segmentsGrid) this.renderGrid(els.segmentsGrid);

        if (els.skipAllBtn)
            els.skipAllBtn.addEventListener("click", () => this.setAll("skip"));
        if (els.speedAllBtn)
            els.speedAllBtn.addEventListener("click", () =>
                this.setAll("speed")
            );
        if (els.resetAllBtn)
            els.resetAllBtn.addEventListener("click", () =>
                this.setAll("ignore")
            );
    }

    renderGrid(grid) {
        const template = document.getElementById("segmentItemTemplate");
        grid.innerHTML = "";
        const s = this.settings.get();

        SEGMENT_CATEGORIES.forEach((cat) => {
            const clone = template.content.cloneNode(true);
            const item = clone.querySelector(".segment-item");
            const color = clone.querySelector(".segment-color");
            const name = clone.querySelector(".segment-name");
            const action = clone.querySelector(".segment-action");
            const speedControl = clone.querySelector(".speed-control");
            const speedSlider = clone.querySelector(".speed-slider");
            const speedValue = clone.querySelector(".speed-value");

            item.dataset.category = cat.id;
            color.style.backgroundColor = cat.color;
            name.textContent = cat.label;

            const config = s.segments[cat.id] || { ...DEFAULT_SEGMENT_CONFIG };
            action.value = config.action;
            speedSlider.value = config.speed;
            speedValue.textContent = `${config.speed}x`;

            if (config.action === "speed")
                speedControl.classList.remove("hidden");

            action.addEventListener("change", () => {
                const val = action.value;
                if (val === "speed") speedControl.classList.remove("hidden");
                else speedControl.classList.add("hidden");
                this.updateConfig(cat.id, { action: val });
            });

            speedSlider.addEventListener("input", () => {
                const val = speedSlider.value;
                speedValue.textContent = `${val}x`;
                this.updateConfig(cat.id, { speed: parseFloat(val) });
            });

            grid.appendChild(clone);
        });
    }

    updateConfig(catId, updates) {
        const s = this.settings.get();
        const segments = { ...s.segments };

        if (!segments[catId]) segments[catId] = { ...DEFAULT_SEGMENT_CONFIG };
        segments[catId] = { ...segments[catId], ...updates };

        this.settings.save({ segments });
    }

    setAll(action) {
        const s = this.settings.get();
        const segments = { ...s.segments };

        SEGMENT_CATEGORIES.forEach((cat) => {
            if (!segments[cat.id])
                segments[cat.id] = { ...DEFAULT_SEGMENT_CONFIG };
            segments[cat.id] = { ...segments[cat.id], action };
        });

        this.settings.save({ segments });

        // Re-render to update UI
        const grid = document.getElementById("segmentsGrid");
        if (grid) this.renderGrid(grid);
    }
}
