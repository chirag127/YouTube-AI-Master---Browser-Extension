// Timestamp Validation for Segment UI
// Ensures: Highlight = ONE timestamp, Others = TWO timestamps (both clickable)

export const validateSegments = (segments) => {
    return segments.map(seg => {
        const validated = { ...seg }

        // Highlight: Only start timestamp
        if (seg.category === 'highlight') {
            validated.timestamps = [{ type: 'start', time: seg.start }]
            validated.hasEndTimestamp = false
        }
        // All others: Start AND End timestamps (both clickable)
        else {
            validated.timestamps = [
                { type: 'start', time: seg.start },
                { type: 'end', time: seg.end || seg.start + (seg.duration || 0) }
            ]
            validated.hasEndTimestamp = true
        }

        return validated
    })
}

export const formatTimestamp = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

const pad = (n) => n.toString().padStart(2, '0')

export const createClickableTimestamp = (time, type, onClick) => ({
    time,
    type,
    formatted: formatTimestamp(time),
    clickable: true,
    onClick: () => onClick(time)
})
