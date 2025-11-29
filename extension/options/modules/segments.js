import { SEGMENT_CATEGORIES, DEFAULT_SEGMENT_CONFIG } from "./settings-manager.js";

export class SegmentsConfig {
    constructor(s, a) {
        this.s = s;
        this.a = a;
    }

    init() {
        const c = this.s.get();
        const en = document.getElementById("enableSegments");
        const grid = document.getElementById("segmentsGrid");

        if (en) en.checked = c.segments?.enabled ?? true;
        if (grid) this.render(grid);

        en?.addEventListener("change", e => this.a.save('segments.enabled', e.target.checked));
        document.getElementById("skipAllBtn")?.addEventListener("click", () => this.setAll("skip"));
        document.getElementById("speedAllBtn")?.addEventListener("click", () => this.setAll("speed"));
        document.getElementById("resetAllBtn")?.addEventListener("click", () => this.setAll("ignore"));
    }

    render(grid) {
        const tmpl = document.getElementById("segmentItemTemplate");
        grid.innerHTML = "";
        const cats = this.s.get().segments?.categories || {};

        SEGMENT_CATEGORIES.forEach(cat => {
            const clone = tmpl.content.cloneNode(true);
            const item = clone.querySelector(".segment-item");
            const color = clone.querySelector(".segment-color");
            const name = clone.querySelector(".segment-name");
            const action = clone.querySelector(".segment-action");
            const speedCtrl = clone.querySelector(".speed-control");
            const speedSlider = clone.querySelector(".speed-slider");
            const speedVal = clone.querySelector(".speed-value");

            item.dataset.category = cat.id;
            color.style.backgroundColor = cat.color;
            name.textContent = cat.label;

            const cfg = cats[cat.id] || { ...DEFAULT_SEGMENT_CONFIG };
            action.value = cfg.action;
            speedSlider.value = cfg.speed;
            speedVal.textContent = `${cfg.speed}x`;

            if (cfg.action === "speed") speedCtrl.classList.remove("hidden");

            action.addEventListener("change", () => {
                const v = action.value;
                if (v === "speed") speedCtrl.classList.remove("hidden");
                else speedCtrl.classList.add("hidden");
                this.update(cat.id, { action: v });
            });

            speedSlider.addEventListener("input", () => {
                const v = speedSlider.value;
                speedVal.textContent = `${v}x`;
                this.update(cat.id, { speed: parseFloat(v) });
            });

            grid.appendChild(clone);
        });
    }

    async update(id, upd) {
        const c = this.s.get();
        const cats = { ...(c.segments?.categories || {}) };
        if (!cats[id]) cats[id] = { ...DEFAULT_SEGMENT_CONFIG };
        cats[id] = { ...cats[id], ...upd };
        await this.a.save('segments.categories', cats);
    }

    async setAll(action) {
        const c = this.s.get();
        const cats = { ...(c.segments?.categories || {}) };
        SEGMENT_CATEGORIES.forEach(cat => {
            if (!cats[cat.id]) cats[cat.id] = { ...DEFAULT_SEGMENT_CONFIG };
            cats[cat.id] = { ...cats[cat.id], action };
        });
        await this.a.save('segments.categories', cats);
        const grid = document.getElementById("segmentsGrid");
        if (grid) this.render(grid);
    }
}
