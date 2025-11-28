async function getInvidiousInstances() {
    return [
        "https://inv.tux.pizza",
        "https://invidious.flokinet.to",
        "https://invidious.privacydev.net",
        "https://vid.puffyan.us",
        "https://invidious.kavin.rocks",
        "https://yt.artemislena.eu",
    ];
}

function parseVTT(vttText) {
    const segments = [];
    const lines = vttText.split("\n");
    let currentStart = null;
    let currentEnd = null;
    let currentText = [];

    const timeRegex =
        /(\d{2}:)?(\d{2}:\d{2}\.\d{3}) --> (\d{2}:)?(\d{2}:\d{2}\.\d{3})/;

    const parseTime = (timeStr) => {
        const parts = timeStr.split(":");
        let h = 0,
            m = 0,
            s = 0;
        if (parts.length === 3) {
            h = parseFloat(parts[0]);
            m = parseFloat(parts[1]);
            s = parseFloat(parts[2]);
        } else {
            m = parseFloat(parts[0]);
            s = parseFloat(parts[1]);
        }
        return h * 3600 + m * 60 + s;
    };

    for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith("WEBVTT") || line.match(/^\d+$/)) continue;

        const timeMatch = line.match(timeRegex);
        if (timeMatch) {
            if (currentStart !== null && currentText.length > 0) {
                segments.push({
                    start: currentStart,
                    duration: currentEnd - currentStart,
                    text: currentText.join(" ").trim(),
                });
            }
            currentStart = parseTime(
                timeMatch[1] ? timeMatch[1] + timeMatch[2] : timeMatch[2]
            );
            currentEnd = parseTime(
                timeMatch[3] ? timeMatch[3] + timeMatch[4] : timeMatch[4]
            );
            currentText = [];
        } else {
            currentText.push(line);
        }
    }

    if (currentStart !== null && currentText.length > 0) {
        segments.push({
            start: currentStart,
            duration: currentEnd - currentStart,
            text: currentText.join(" ").trim(),
        });
    }

    return segments;
}

export async function handleFetchInvidiousTranscript(request) {
    const { videoId, lang = "en" } = request;
    const instances = await getInvidiousInstances();
    let lastError = null;

    for (const inst of instances) {
        try {
            const videoUrl = `${inst}/api/v1/videos/${videoId}`;
            const videoResponse = await fetch(videoUrl, {
                signal: AbortSignal.timeout(8000),
            });
            if (!videoResponse.ok) continue;

            const videoData = await videoResponse.json();
            if (!videoData.captions?.length) continue;

            let captionTrack =
                videoData.captions.find((c) => c.language_code === lang) ||
                videoData.captions[0];
            const captionUrl = captionTrack.url.startsWith("http")
                ? captionTrack.url
                : `${inst}${captionTrack.url}`;

            const captionResponse = await fetch(captionUrl, {
                headers: { Accept: "text/vtt" },
            });
            if (!captionResponse.ok) continue;

            const captionText = await captionResponse.text();
            const segments = parseVTT(captionText);
            return { success: true, data: segments };
        } catch (e) {
            lastError = e;
        }
    }
    return {
        success: false,
        error: lastError?.message || "All Invidious instances failed",
    };
}

export async function handleFetchInvidiousMetadata(request) {
    const { videoId } = request;
    const instances = await getInvidiousInstances();

    for (const inst of instances) {
        try {
            const response = await fetch(`${inst}/api/v1/videos/${videoId}`, {
                signal: AbortSignal.timeout(5000),
            });
            if (response.ok) {
                const data = await response.json();
                return {
                    success: true,
                    data: {
                        title: data.title,
                        author: data.author,
                        description: data.description,
                        viewCount: data.viewCount,
                        lengthSeconds: data.lengthSeconds,
                        category: data.genre,
                        publishDate: data.publishedText,
                    },
                };
            }
        } catch (e) {}
    }
    return { success: false, error: "Failed to fetch metadata from Invidious" };
}
