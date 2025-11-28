export async function handleGetMetadata(request, sendResponse) {
    const { videoId } = request;
    console.warn(
        "[Background] GET_METADATA called - this should be handled by content script"
    );
    sendResponse({
        success: true,
        data: {
            title: "YouTube Video",
            author: "Unknown Channel",
            viewCount: "Unknown",
            videoId: videoId,
        },
    });
}
