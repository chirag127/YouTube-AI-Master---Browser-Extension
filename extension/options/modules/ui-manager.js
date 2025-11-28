export class UIManager {
    constructor() {
        this.elements = {};
    }

    async loadSection(id) {
        try {
            const response = await fetch(`sections/${id}.html`);
            const html = await response.text();
            return html;
        } catch (e) {
            console.error(`Failed to load section ${id}:`, e);
            return `<div class="error">Failed to load section: ${id}</div>`;
        }
    }

    showToast(msg, type = "success") {
        const t = document.getElementById("toast");
        if (!t) return;
        t.textContent = msg;
        t.className = `toast show ${type}`;
        setTimeout(() => t.classList.remove("show"), 3000);
    }

    setupTabs(onTabChange) {
        const tabs = document.querySelectorAll(".nav-item");
        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                const target = tab.dataset.tab;

                // Update Active State
                tabs.forEach((t) => t.classList.remove("active"));
                tab.classList.add("active");

                // Hide all sections
                document.querySelectorAll(".tab-content").forEach((c) => {
                    c.classList.remove("active");
                });

                // Show target section
                const section = document.getElementById(target);
                if (section) section.classList.add("active");

                if (onTabChange) onTabChange(target);
            });
        });
    }
}
