// YouTube Direct API Strategy
// Priority: 1 (Most reliable - Direct timedtext endpoint with full parameters)

import { parseXML } from '../parsers/xml-parser.js'
import { parseJSON3 } from '../parsers/json3-parser.js'

/**
 * Build YouTube timedtext API URL with all required parameters
 * This is the most reliable method as it uses YouTube's official API
 */
function buildTimedTextUrl(videoId, lang = 'en', fmt = 'json3') {
    const params = new URLSearchParams({
        v: videoId,
        lang: lang,
        fmt: fmt,
        // Additional parameters for reliability
        caps: 'asr',
        kind: 'asr',
        xoaf: '5',
        xowf: '1',
        hl: lang,
        ip: '0.0.0.0',
        ipbits: '0'
    })

    return `https://www.youtube.com/api/timedtext?${params.toString()}`
}

export async function fetchViaYouTubeDirect(videoId, lang = 'en') {
    // Try JSON3 first (most reliable and structured format)
    try {
        const url = buildTimedTextUrl(videoId, lang, 'json3')
        const res = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Accept-Language': lang
            }
        })

        if (res.ok) {
            const data = await res.json()
            const segments = parseJSON3(data)
            if (segments.length) {
                console.log(`[YouTube Direct] ✅ JSON3 format: ${segments.length} segments`)
                return segments
            }
        }
    } catch (e) {
        console.warn('[YouTube Direct] JSON3 failed:', e.message)
    }

    // Fallback to XML formats
    const xmlFormats = ['srv3', 'srv2', 'srv1']
    for (const fmt of xmlFormats) {
        try {
            const url = buildTimedTextUrl(videoId, lang, fmt)
            const res = await fetch(url)

            if (res.ok) {
                const xmlText = await res.text()
                const segments = parseXML(xmlText)
                if (segments.length) {
                    console.log(`[YouTube Direct] ✅ ${fmt} format: ${segments.length} segments`)
                    return segments
                }
            }
        } catch (e) {
            continue
        }
    }

    throw new Error('YouTube Direct API failed for all formats')
}

export const strategy = {
    name: 'YouTube Direct API',
    priority: 1, // Highest priority - most reliable method
    fetch: fetchViaYouTubeDirect
}
