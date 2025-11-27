// YouTube JSON3 Format Parser
export const parse = (data) => {
    if (typeof data === 'string') data = JSON.parse(data)
    if (!data.events) return []
    return data.events
        .filter(e => e.segs)
        .map(e => ({
            start: e.tStartMs / 1000,
            duration: (e.dDurationMs || 0) / 1000,
            text: e.segs.map(s => s.utf8).join('')
        }))
        .filter(s => s.text.trim())
}
