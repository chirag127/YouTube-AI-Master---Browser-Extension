/**
 * Sends analysis request to background service
 */
export async function analyzeVideo(
    transcript,
    metadata,
    comments = [],
    options = { length: "Medium" }
) {
    console.log("[Service] Sending ANALYZE_VIDEO message", {
        transcriptLength: transcript?.length,
        commentsCount: comments?.length,
        metadata,
        options,
    });
    return chrome.runtime.sendMessage({
        action: "ANALYZE_VIDEO",
        transcript,
        metadata,
        comments,
        options,
    });
}
