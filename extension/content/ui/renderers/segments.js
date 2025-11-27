import { showPlaceholder } from "../components/loading.js";
import {
    renderLegend,
    injectLegendStyles,
} from "../components/segment-legend.js";
import { seekVideo } from "../../utils/dom.js";
import { formatTime } from "../../utils/time.js";

const colors = {
    Sponsor: "#00d26a",
    "Unpaid/Self Promotion": "#ffff00",
    "Exclusive Access": "#008b45",
    "Interaction Reminder (Subscribe)": "#a020f0",
    Highlight: "#ff0055",
    "Intermission/Intro Animation": "#00ffff",
    "Endcards/Credits": "#0000ff",
    "Preview/Recap": "#00bfff",
    "Hook/Greetings": "#4169e1",
    "Tangents/Jokes": "#9400d3",
};

export function renderSegments(c, s) {
    if (!s?.length) {
        showPlaceholder(c, "No segments detected.");
        return;
    }
    injectLegendStyles();

    const h = s
        .map((x) => {
            const color = colors[x.label] || "#fff";
            const isHighlight = x.label === "Highlight";

            // Highlight has only start timestamp, others have start + end
            const timeHtml = isHighlight
                ? `<span class="yt-ai-timestamp" data-time="${
                      x.start
                  }">${formatTime(x.start)}</span>`
                : `<span class="yt-ai-timestamp" data-time="${
                      x.start
                  }">${formatTime(
                      x.start
                  )}</span> - <span class="yt-ai-timestamp" data-time="${
                      x.end
                  }">${formatTime(x.end)}</span>`;

            return `<div class="yt-ai-segment-item" style="border-left:4px solid ${color}">
      <div class="yt-ai-segment-label">${x.label}</div>
      <div class="yt-ai-segment-time">${timeHtml}</div>
      <div class="yt-ai-segment-desc">${x.description || x.text || ""}</div>
    </div>`;
        })
        .join("");

    c.innerHTML = `${renderLegend()}<div class="yt-ai-segments-list">${h}</div>`;

    // Make all timestamps clickable
    c.querySelectorAll(".yt-ai-timestamp").forEach((e) => {
        e.style.cursor = "pointer";
        e.style.textDecoration = "underline";
        e.addEventListener("click", (evt) => {
            evt.stopPropagation();
            seekVideo(parseFloat(e.dataset.time));
        });
    });
}
