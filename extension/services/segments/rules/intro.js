// Intro/Outro Classification Rule
export const type = 'intro'
export const description = 'Narrated trailers, intros, outros without info'

export const detect = (text, context) => {
    const { start, duration } = context.segment || {}
    // Intros typically in first 30 seconds
    if (start < 30 && duration < 20) {
        const patterns = [/welcome/i, /hey.*guys/i, /what's up/i, /today.*going to/i]
        return patterns.some(p => p.test(text))
    }
    // Outros typically in last 30 seconds
    const totalDuration = context.metadata?.duration || 0
    if (totalDuration - start < 30) {
        const patterns = [/thanks.*watching/i, /see you.*next/i, /catch you/i]
        return patterns.some(p => p.test(text))
    }
    return false
}
