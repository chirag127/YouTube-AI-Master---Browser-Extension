/**
 * Piped API Service
 * Provides access to Piped instances for metadata and transcript extraction
 */

export class PipedAPI {
    constructor() {
        this.instances = []
        this.instancesCacheTime = 0
        this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
    }

    log(level, msg, ...args) {
        const icons = { info: 'ℹ️', success: '✅', warn: '⚠️', error: '❌' }
        const logFn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
        logFn(`[PipedAPI] ${icons[level]} ${msg}`, ...args)
    }

    /**
     * Get list of Piped instances
     */
    async getInstances() {
        const now = Date.now()

        // Return cached instances if available
        if (this.instances.length > 0 && (now - this.instancesCacheTime) < this.cacheTimeout) {
            this.log('info', `Using cached instances (${this.instances.length} instances)`)
            return this.instances
        }

        // Fallback instances
        const fallbackInstances = [
            'https://pipedapi.kavin.rocks',
            'https://pipedapi.tokhmi.xyz',
            'https://pipedapi.moomoo.me',
            'https://pipedapi-libre.kavin.rocks',
            'https://api-piped.mha.fi'
        ]

        try {
            this.log('info', 'Fetching Piped instances from GitHub...')

            const response = await fetch('https://raw.githubusercontent.com/wiki/TeamPiped/Piped/Instances.md', {
                signal: AbortSignal.timeout(8000)
            })

            if (!response.ok) {
                this.log('warn', 'Failed to fetch instances, using fallback')
                this.instances = fallbackInstances
                this.instancesCacheTime = now
                return fallbackInstances
            }

            const markdown = await response.text()
            const apiUrls = this._parseInstancesFromMarkdown(markdown)

            if (apiUrls.length > 0) {
                this.log('success', `Fetched ${apiUrls.length} Piped instances`)
                this.instances = apiUrls
                this.instancesCacheTime = now
                return apiUrls
            } else {
                this.log('warn', 'No instances found, using fallback')
                this.instances = fallbackInstances
                this.instancesCacheTime = now
                return fallbackInstances
            }
        } catch (e) {
            this.log('error', 'Failed to fetch instances:', e.message)
            this.instances = fallbackInstances
            this.instancesCacheTime = now
            return fallbackInstances
        }
    }

    /**
     * Parse Piped instances from markdown
     */
    _parseInstancesFromMarkdown(markdown) {
        const apiUrls = []
        const lines = markdown.split('\n')

        for (const line of lines) {
            // Look for API URLs in markdown table format
            const match = line.match(/\|\s*\[([^\]]+)\]\(([^)]+)\)\s*\|/)
            if (match) {
                const url = match[2].trim()
                // Only include API URLs (not frontend URLs)
                if (url.includes('pipedapi') || url.includes('api-piped') || url.includes('api.piped')) {
                    apiUrls.push(url)
                }
            }
        }

        return apiUrls
    }

    /**
     * Get video metadata from Piped via background script (to avoid CORS)
     */
    async getVideoMetadata(videoId) {
        this.log('info', `Fetching metadata for ${videoId}`)

        try {
            const response = await chrome.runtime.sendMessage({
                action: 'FETCH_PIPED_METADATA',
                videoId: videoId
            })

            if (response.success && response.data) {
                this.log('success', `Metadata fetched successfully`)
                return response.data
            }

            throw new Error(response.error || 'Piped API returned no data')
        } catch (e) {
            this.log('error', 'Piped API error:', e.message)
            throw new Error(`Piped API failed: ${e.message}`)
        }
    }

    /**
     * Get video transcript/subtitles from Piped via background script (to avoid CORS)
     */
    async getTranscript(videoId, lang = 'en') {
        this.log('info', `Fetching transcript for ${videoId}, lang: ${lang}`)

        try {
            const response = await chrome.runtime.sendMessage({
                action: 'FETCH_PIPED_TRANSCRIPT',
                videoId: videoId,
                lang: lang
            })

            if (response.success && response.data) {
                this.log('success', `Transcript fetched successfully: ${response.data.length} segments`)
                return response.data
            }

            throw new Error(response.error || 'Piped API returned no data')
        } catch (e) {
            this.log('error', 'Piped API error:', e.message)
            throw new Error(`Piped API failed: ${e.message}`)
        }
    }

    /**
     * Parse subtitle content based on mime type
     */
    _parseSubtitle(text, mimeType) {
        if (mimeType.includes('vtt') || text.includes('WEBVTT')) {
            return this._parseVTT(text)
        } else if (mimeType.includes('ttml') || mimeType.includes('xml')) {
            return this._parseTTML(text)
        } else if (mimeType.includes('srv')) {
            return this._parseXML(text)
        }

        // Try VTT as fallback
        return this._parseVTT(text)
    }

    /**
     * Parse VTT format
     */
    _parseVTT(vttText) {
        const segments = []
        const lines = vttText.split('\n')
        let i = 0

        while (i < lines.length) {
            const line = lines[i].trim()

            if (line.includes('-->')) {
                const [startStr, endStr] = line.split('-->').map(t => t.trim())
                const start = this._parseVTTTime(startStr)
                const end = this._parseVTTTime(endStr)

                i++
                let text = ''

                while (i < lines.length && lines[i].trim() !== '' && !lines[i].includes('-->')) {
                    text += lines[i].trim() + ' '
                    i++
                }

                text = text.trim().replace(/<[^>]+>/g, '').replace(/\s+/g, ' ')

                if (text) {
                    segments.push({
                        start,
                        duration: end - start,
                        text
                    })
                }
            }
            i++
        }

        return segments
    }

    /**
     * Parse VTT timestamp
     */
    _parseVTTTime(timestamp) {
        const parts = timestamp.split(':')

        if (parts.length === 3) {
            const [h, m, s] = parts
            return parseFloat(h) * 3600 + parseFloat(m) * 60 + parseFloat(s)
        } else if (parts.length === 2) {
            const [m, s] = parts
            return parseFloat(m) * 60 + parseFloat(s)
        } else {
            return parseFloat(parts[0])
        }
    }

    /**
     * Parse TTML/XML format
     */
    _parseTTML(xmlText) {
        const segments = []
        const regex = /<p[^>]*begin="([^"]*)"[^>]*end="([^"]*)"[^>]*>(.*?)<\/p>/gs
        let match

        while ((match = regex.exec(xmlText)) !== null) {
            const start = this._parseTTMLTime(match[1])
            const end = this._parseTTMLTime(match[2])
            const text = match[3].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()

            if (text) {
                segments.push({
                    start,
                    duration: end - start,
                    text
                })
            }
        }

        return segments
    }

    /**
     * Parse TTML timestamp
     */
    _parseTTMLTime(timestamp) {
        const parts = timestamp.split(':')
        if (parts.length === 3) {
            const [h, m, s] = parts
            return parseFloat(h) * 3600 + parseFloat(m) * 60 + parseFloat(s)
        }
        return parseFloat(timestamp)
    }

    /**
     * Parse XML format
     */
    _parseXML(xmlText) {
        const segments = []
        const regex = /<text start="([\d.]+)"(?:\s+dur="([\d.]+)")?[^>]*>([^<]*)<\/text>/g
        let match

        while ((match = regex.exec(xmlText)) !== null) {
            const start = parseFloat(match[1])
            const duration = match[2] ? parseFloat(match[2]) : 0
            const text = this._decodeHTML(match[3])

            if (text.trim()) {
                segments.push({ start, duration, text })
            }
        }

        return segments
    }

    /**
     * Decode HTML entities
     */
    _decodeHTML(text) {
        const entities = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'",
            '&nbsp;': ' '
        }
        return text.replace(/&[^;]+;/g, match => entities[match] || match)
    }
}

export default new PipedAPI()
