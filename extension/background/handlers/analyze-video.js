import { initializeServices, getServices } from "../services.js";
import { getApiKey } from "../utils/api-key.js";
import geniusLyricsAPI from "../../api/genius-lyrics.js";

let keepAliveInterval = null;

function startKeepAlive() {
    if (keepAliveInterval) return;
    keepAliveInterval = setInterval(
        () => chrome.runtime.getPlatformInfo(() => {}),
        20000
    );
}

function stopKeepAlive() {
    if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
        keepAliveInterval = null;
    }
}

export async function handleAnalyzeVideo(request, sendResponse) {
    const {
        transcript,
        metadata,
        comments = [],
        options = {},
        useCache = true,
    } = request;
    const videoId = metadata?.videoId;
    startKeepAlive();

    try {
        const apiKey = await getApiKey();
        if (!apiKey) {
            sendResponse({ success: false, error: "API Key not configured" });
            return;
        }

        await initializeServices(apiKey);
        const { gemini, segmentClassification, storage } = getServices();

        if (useCache && videoId) {
            const cached = await storage.getVideoData(videoId);
            if (cached?.summary && cached?.segments) {
                sendResponse({
                    success: true,
                    fromCache: true,
                    data: {
                        summary: cached.summary,
                        faq: cached.faq,
                        insights: cached.insights,
                        segments: cached.segments,
                        timestamps: cached.timestamps,
                    },
                });
                return;
            }
        }

        let lyrics = null;
        const isMusic =
            metadata?.category === "Music" ||
            metadata?.title?.toLowerCase().includes("official video") ||
            metadata?.title?.toLowerCase().includes("lyrics");

        if (isMusic || !transcript?.length) {
            try {
                lyrics = await geniusLyricsAPI.getLyrics(
                    metadata.title,
                    metadata.author
                );
            } catch (e) {}
        }

        if ((!transcript || !transcript.length) && !lyrics) {
            throw new Error("No transcript or lyrics available");
        }

        const formatTime = (s) => {
            const m = Math.floor(s / 60);
            const sec = Math.floor(s % 60);
            return `${m}:${sec.toString().padStart(2, "0")}`;
        };

        let contextString = `Video Metadata:\nOriginal Title: ${
            metadata?.originalTitle || metadata?.title || "Unknown"
        }\n`;
        if (metadata?.deArrowTitle)
            contextString += `Community Title (DeArrow): ${metadata.deArrowTitle}\n`;
        contextString += `Channel: ${
            metadata?.author || "Unknown"
        }\nDescription: ${
            metadata?.description
                ? metadata.description.substring(0, 1000) + "..."
                : "N/A"
        }\n`;

        if (lyrics)
            contextString += `\nLyrics Source: ${lyrics.source}\nLyrics:\n${lyrics.lyrics}\n`;
        if (comments?.length)
            contextString += `\nTop Comments:\n${comments
                .slice(0, 10)
                .map((c) => `- ${c.textDisplay}`)
                .join("\n")}\n`;

        const transcriptString = (transcript || [])
            .map((t) => `[${formatTime(t.start)}] ${t.text}`)
            .join("\n");
        contextString += `\nTranscript:\n${transcriptString}\n`;

        const analysis = await gemini.generateComprehensiveAnalysis(
            contextString,
            {
                model: "gemini-2.5-flash-lite-preview-09-2025",
                language: options.language || "English",
                length: options.length || "Medium",
            }
        );

        let segments = [];
        if (options.generateSegments) {
            segments = await segmentClassification.classifyTranscript({
                transcript: transcript || [],
                metadata,
                lyrics,
                comments,
            });
        }

        if (videoId && storage) {
            try {
                await storage.saveVideoData(videoId, {
                    metadata,
                    transcript,
                    summary: analysis.summary,
                    faq: analysis.faq || "",
                    insights: analysis.insights || "",
                    segments,
                    timestamps: analysis.timestamps,
                });
            } catch (e) {}
        }

        sendResponse({
            success: true,
            fromCache: false,
            data: {
                summary: analysis.summary,
                faq: analysis.faq,
                insights: analysis.insights,
                segments,
                timestamps: analysis.timestamps,
            },
        });
    } catch (error) {
        sendResponse({ success: false, error: error.message });
    } finally {
        stopKeepAlive();
    }
}
