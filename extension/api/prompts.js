export const prompts = {
    summary: (transcript, options) => {
        return `
        Role: You are an expert video summarizer.
        Task: Create a concise summary of the following video transcript.

        Constraints:
        - Length: ${options.length || "Medium"}
        - Language: ${options.language || "English"}
        - Format: Markdown

        Transcript:
        ${transcript}
        `;
    },

    chat: (question, context, metadata) => {
        return `
        Role: You are a helpful AI assistant for a YouTube video.
        Context: The user is watching a video titled "${
            metadata?.title || "Unknown"
        }".
        Video Transcript Context: ${context}

        User Question: ${question}

        Instructions:
        - Answer based ONLY on the video context provided.
        - Be concise and helpful.
        - If the answer is not in the video, state that clearly.
        `;
    },

    comments: (comments) => {
        const commentText = comments
            .map((c) => `- ${c.authorText}: ${c.textDisplay}`)
            .join("\n");
        return `
        Task: Analyze the sentiment and key themes of these YouTube comments.

        Comments:
        ${commentText}

        Output Format (Markdown):
        ### Sentiment Overview
        (Positive/Negative/Neutral mix)

        ### Key Themes
        - Theme 1
        - Theme 2

        ### Controversial Topics (if any)
        `;
    },

    faq: (transcript, metadata) => {
        return `
        Task: Generate 5-7 Frequently Asked Questions (FAQ) that this video answers, along with their concise answers.

        Video Title: ${metadata?.title || ""}
        Transcript:
        ${transcript}

        Format:
        **Q: [Question]**
        A: [Answer]
        `;
    },

    segments: (transcript) => {
        return `
        Task: Segment the following transcript into logical chapters based on the categories below.
        Return ONLY a raw JSON array. No markdown formatting.

        Categories (Use EXACTLY these labels):
        - Sponsor (Paid promotion)
        - Self Promotion (Unpaid/Self-promo, asking to subscribe/like)
        - Interaction (Reminders to comment, like, subscribe)
        - Intro/Animation (Channel intro, opening animation)
        - Endcards (Outro, credits, end screen)
        - Preview/Recap (Preview of what's coming or recap of previous)
        - Hook/Greetings (Hello, welcome back, today we are going to...)
        - Tangents/Jokes (Off-topic, jokes, skits not central to content)
        - Highlight (Key moments, best parts)
        - Content (The main video content)

        JSON Format:
        [
            { "start": number (seconds), "end": number, "label": "Category Name" }
        ]

        Transcript:
        ${transcript}
        `;
    },

    comprehensive: (transcript, options) => {
        return `
        Role: You are an advanced AI video analyst.
        Task: Provide a comprehensive analysis of this video.

        Directives:
        1. **Summary**: A ${options.length || "Medium"} length summary.
        2. **Key Insights**: Bullet points of the most valuable takeaways.
        3. **Timestamps**: Include [MM:SS] timestamps references where appropriate.
        4. **FAQ**: 3-5 relevant Q&A pairs.

        Format (Markdown):
        ## Summary
        (Text with timestamps like [05:30])

        ## Key Insights
        - Insight 1
        - Insight 2

        ## FAQ
        **Q: ...**
        A: ...

        Transcript:
        ${transcript}
        `;
    },
};
