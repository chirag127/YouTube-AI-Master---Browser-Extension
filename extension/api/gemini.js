import { GeminiClient } from "./gemini-client.js";
import { ModelManager } from "./models.js";
import { prompts } from "./prompts/index.js";
import { cl, cw, ce } from "../utils/shortcuts.js";

// Re-export ModelManager for use in options page
export { ModelManager };

const LABEL_MAPPING = {
    S: "Sponsor",
    SP: "Self Promotion",
    UP: "Unpaid Promotion",
    EA: "Exclusive Access",
    IR: "Interaction Reminder (Subscribe)",
    H: "Highlight",
    I: "Intermission/Intro Animation",
    EC: "Endcards/Credits",
    P: "Preview/Recap",
    G: "Hook/Greetings",
    T: "Tangents/Jokes",
    NM: "Music: Non-Music Section",
    C: "Content",
};

export class GeminiService {
    constructor(apiKey) {
        this.client = new GeminiClient(apiKey);
        this.models = new ModelManager(
            apiKey,
            "https://generativelanguage.googleapis.com/v1beta"
        );
    }
    async fetchAvailableModels() {
        return this.models.fetch();
    }

    async generateSummary(transcript, model = null, options = {}) {
        const prompt = prompts.summary(transcript, options);
        return this.generateContent(prompt, model);
    }
    async chatWithVideo(question, context, model = null, metadata = null) {
        return this.generateContent(
            prompts.chat(question, context, metadata),
            model
        );
    }

    async analyzeCommentSentiment(comments, model = null) {
        cl(
            "[GeminiService] analyzeCommentSentiment called with:",
            comments?.length
        );
        if (!comments || !comments.length) {
            cw("[GeminiService] No comments provided");
            return "No comments available to analyze.";
        }
        cl(
            `[GeminiService] Generating comment analysis for ${comments.length} comments`
        );
        const prompt = prompts.comments(comments);
        return this.generateContent(prompt, model);
    }

    async generateFAQ(transcript, model = null, metadata = null) {
        return this.generateContent(prompts.faq(transcript, metadata), model);
    }

    async extractSegments(context) {
        try {
            const response = await this.generateContent(
                prompts.segments(context)
            );
            cl("[GeminiService] Raw segments response:", response);

            let parsedData = null;

            // Robust JSON extraction
            const start = response.indexOf("{");
            const end = response.lastIndexOf("}");

            if (start !== -1 && end !== -1) {
                const jsonStr = response.substring(start, end + 1);
                try {
                    parsedData = JSON.parse(jsonStr);
                } catch (e) {
                    cw("[GeminiService] JSON parse failed:", e);
                }
            }

            // Fallback for markdown
            if (!parsedData) {
                const cleanResponse = response
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim();
                if (
                    cleanResponse.startsWith("{") &&
                    cleanResponse.endsWith("}")
                ) {
                    try {
                        parsedData = JSON.parse(cleanResponse);
                    } catch (e) { }
                }
            }

            if (parsedData) {
                const fullVideoLabelCode = parsedData.fullVideoLabel;
                let segments = (parsedData.segments || []).map((p) => ({
                    start: p.s ?? p.start,
                    end: p.e ?? p.end,
                    label: LABEL_MAPPING[p.l] || p.l || p.label,
                    labelCode: p.l, // Keep original code
                    title: p.t ?? p.title,
                    description: p.d ?? p.description,
                }));

                // Safety: Remove segments that match the fullVideoLabel
                if (fullVideoLabelCode) {
                    segments = segments.filter(
                        (s) => s.labelCode !== fullVideoLabelCode
                    );
                }

                // Return object with segments and fullVideoLabel
                return {
                    segments,
                    fullVideoLabel: fullVideoLabelCode
                        ? LABEL_MAPPING[fullVideoLabelCode] ||
                        fullVideoLabelCode
                        : null,
                    fullVideoLabelCode: fullVideoLabelCode,
                };
            }

            return { segments: [], fullVideoLabel: null };
        } catch (e) {
            console.warn("[GeminiService] Segment extraction failed:", e);
            return { segments: [], fullVideoLabel: null };
        }
    }

    async generateComprehensiveAnalysis(context, options = {}) {
        try {
            const response = await this.generateContent(
                prompts.comprehensive(context, options)
            );

            const summary = this._extractSection(response, "Summary");
            const insights = this._extractSection(response, "Key Insights");
            const faq = this._extractSection(response, "FAQ");

            return {
                summary: summary || response,
                insights: insights || "",
                faq: faq || "",
                timestamps: [],
            };
        } catch (error) {
            ce("[GeminiService] Analysis failed:", error);
            throw error;
        }
    }

    _extractSection(text, sectionName) {
        const regex = new RegExp(
            `## ${sectionName}\\s*([\\s\\S]*?)(?=##|$)`,
            "i"
        );
        const match = text.match(regex);
        return match ? match[1].trim() : null;
    }

    async generateContent(prompt, model = null) {
        let modelList = [];
        const fallbackModels = [
            "gemini-2.5-flash-lite-preview-09-2025",
            "gemini-2.5-flash-lite",
            "gemini-2.5-flash",
            "gemini-2.0-flash-exp",
            "gemini-1.5-flash",
            "gemini-1.5-pro",
        ];

        if (model) {
            modelList = [model];
        } else {
            if (this.models.models.length === 0) {
                try {
                    await this.models.fetch();
                } catch (error) {
                    cw(
                        "Failed to fetch models, using fallback list:",
                        error.message
                    );
                    modelList = fallbackModels;
                }
            }
            if (this.models.models.length > 0) {
                modelList = this.models.getList();
            } else if (modelList.length === 0) {
                modelList = fallbackModels;
            }
        }

        const errors = [];

        for (let i = 0; i < modelList.length; i++) {
            const modelName = modelList[i];
            try {
                cl(
                    `[GeminiService] Attempting model: ${modelName} (${i + 1
                    }/${modelList.length})`
                );

                const result = await this.client.generateContent(
                    prompt,
                    modelName
                );

                if (i > 0) {
                    cl(`[GeminiService] Fallback model succeeded: ${modelName}`);
                }

                return result;
            } catch (error) {
                errors.push({ model: modelName, error: error.message });
                cw(`[GeminiService] Model ${modelName} failed:`, error.message);

                // Don't retry if it's a non-retryable error
                if (error.retryable === false) {
                    throw error;
                }

                // Don't wait after last attempt
                if (i < modelList.length - 1) {
                    cl("[GeminiService] Falling back to next model...");
                }
            }
        }

        const errorMsg = `All ${modelList.length} Gemini models failed. ${errors[0]?.error || "Unknown error"
            }`;
        ce("[GeminiService]", errorMsg);
        throw new Error(errorMsg);
    }

    getRateLimitStats() {
        return this.client.getRateLimitStats();
    }
}
