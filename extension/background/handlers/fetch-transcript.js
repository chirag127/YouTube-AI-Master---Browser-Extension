import { handleFetchInvidiousTranscript } from "./invidious.js";

function decodeHTMLEntities(text) {
    const entities = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'",
        "&nbsp;": " ",
    };
    return text.replace(/&[^;]+;/g, (match) => entities[match] || match);
}

function parseXML(xmlText) {
    const segments = [];
    const regex =
        /<text start="([\d.]+)"(?:\s+dur="([\d.]+)")?[^>]*>([^<]*)<\/text>/g;
    let match;
    while ((match = regex.exec(xmlText)) !== null) {
        const text = decodeHTMLEntities(match[3]);
        if (text.trim())
            segments.push({
                start: parseFloat(match[1]),
                duration: match[2] ? parseFloat(match[2]) : 0,
                text,
            });
    }
    return segments;
}

async function fetchYouTubeDirectAPI(videoId, lang = "en") {
    const formats = ["json3", "srv3"];
    for (const fmt of formats) {
        try {
            const url = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}&fmt=${fmt}`;
            const response = await fetch(url);
            if (!response.ok) continue;

            if (fmt === "json3") {
                const text = await response.text();
                if (!text) continue;
                const data = JSON.parse(text);
                if (data.events) {
                    const segments = data.events
                        .filter((e) => e.segs)
                        .map((e) => ({
                            start: e.tStartMs / 1000,
                            duration: (e.dDurationMs || 0) / 1000,
                            text: e.segs.map((s) => s.utf8).join(""),
                        }));
                    if (segments.length)
                        return { success: true, data: segments };
                }
            } else {
                const xmlText = await response.text();
                const segments = parseXML(xmlText);
                if (segments.length) return { success: true, data: segments };
            }
        } catch (e) {}
    }
    return { success: false, error: "YouTube Direct API failed" };
}

export async function handleFetchTranscript(request, sendResponse) {
    const { videoId, lang = "en" } = request;
    const methods = [
        {
            name: "Invidious API",
            fn: () => handleFetchInvidiousTranscript(request),
        },
        {
            name: "YouTube Direct API",
            fn: () => fetchYouTubeDirectAPI(videoId, lang),
        },
    ];

    for (const method of methods) {
        try {
            const result = await method.fn();
            if (result.success && result.data) {
                sendResponse(result);
                return;
            }
        } catch (e) {}
    }
    sendResponse({
        success: false,
        error: "All transcript fetch methods failed",
    });
}
