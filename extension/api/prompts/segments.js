import { buildContextString } from "./utils.js";

export const segments = (context) => {
    const transcript =
        typeof context.transcript === "string"
            ? context.transcript
            : JSON.stringify(context.transcript);

    return `
    Task: Segment the following transcript into logical chapters based on the categories below.
    Return ONLY a raw JSON array. No markdown formatting.

    Context:
    ${buildContextString(context)}

    Categories (Use EXACTLY these labels):
    - Sponsor: Paid promotion, paid referrals and direct advertisements.
    - Unpaid/Self Promotion: Unpaid or self-promotion.
    - Exclusive Access: Only for labeling entire videos.
    - Interaction Reminder (Subscribe): Short reminder to like/subscribe.
    - Highlight: The part of the video that most people are looking for.
    - Intermission/Intro Animation: Interval without actual content.
    - Endcards/Credits: Credits or endcards.
    - Preview/Recap: Clips showing what is coming up or repeated info.
    - Hook/Greetings: Narrated trailers, greetings, goodbyes.
    - Tangents/Jokes: Tangential scenes or jokes not required for main content.
    - Content: The main video content.

    JSON Format:
    [
        {
            "start": number (seconds),
            "end": number,
            "label": "Category Name",
            "title": "Short descriptive title (max 5 words)",
            "description": "Detailed description of what happens in this segment",
            "importance": "High" | "Medium" | "Low"
        }
    ]

    Transcript:
    ${transcript}
    `;
};
