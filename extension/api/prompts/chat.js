export const chat = (question, context, metadata) => {
    let title = `Original Title: ${
        metadata?.originalTitle || metadata?.title || "Unknown"
    }`;
    if (metadata?.deArrowTitle)
        title += `\nCommunity Title (DeArrow): ${metadata.deArrowTitle}`;

    return `
    Role: You are a helpful AI assistant for a YouTube video.

    Context:
    ${title}
    Channel: ${metadata?.author || "Unknown"}

    Video Transcript Context: ${context}

    User Question: ${question}

    Instructions:
    - Answer based ONLY on the video context provided.
    - Be concise and helpful.
    - If the answer is not in the video, state that clearly.
    `;
};
