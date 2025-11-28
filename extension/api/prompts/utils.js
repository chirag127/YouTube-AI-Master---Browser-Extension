export const buildContextString = ({ metadata, lyrics, comments }) => {
    let title = `Original Title: ${
        metadata?.originalTitle || metadata?.title || "Unknown"
    }`;
    if (metadata?.deArrowTitle)
        title += `\nCommunity Title (DeArrow): ${metadata.deArrowTitle}`;

    let commentsCtx = "";
    if (comments?.length) {
        commentsCtx =
            "\nTop Comments:\n" +
            comments
                .slice(0, 10)
                .map((c) => `- ${c.textDisplay}`)
                .join("\n");
    }

    return `
    Video Context:
    ${title}
    Channel: ${metadata?.author || "Unknown"}
    Description: ${
        metadata?.description
            ? metadata.description.substring(0, 1000) + "..."
            : "N/A"
    }
    ${
        lyrics
            ? `\nLyrics Source: ${lyrics.source}\nLyrics:\n${lyrics.lyrics}\n`
            : ""
    }
    ${commentsCtx}
    `;
};
