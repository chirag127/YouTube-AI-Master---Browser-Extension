// Transcript Extraction Strategy Manager
// Implements 5-method priority system

import * as xhrIntercept from './strategies/xhr-intercept.js'
import * as invidious from './strategies/invidious.js'
import * as youtubeDirect from './strategies/youtube-direct.js'
import * as backgroundProxy from './strategies/background-proxy.js'
import * as domParser from './strategies/dom-parser.js'

const strategies = [
    xhrIntercept,
    invidious,
    youtubeDirect,
    backgroundProxy,
    domParser
].sort((a, b) => a.priority - b.priority)

export const extractTranscript = async (videoId, lang = 'en') => {
    console.log(`[Transcript] Starting extraction for ${videoId}, lang: ${lang}`)
    let lastError = null

    for (const strategy of strategies) {
        try {
            console.log(`[Transcript] Trying: ${strategy.name}`)
            const result = await strategy.extract(videoId, lang)
            if (result && result.length > 0) {
                console.log(`[Transcript] ✅ ${strategy.name} succeeded: ${result.length} segments`)
                return { success: true, data: result, method: strategy.name }
            }
        } catch (e) {
            lastError = e
            console.warn(`[Transcript] ${strategy.name} failed:`, e.message)
        }
    }

    console.error('[Transcript] All methods failed')
    return { success: false, error: lastError?.message || 'All extraction methods failed' }
}

export const getAvailableStrategies = () => strategies.map(s => ({
    name: s.name,
    priority: s.priority
}))
