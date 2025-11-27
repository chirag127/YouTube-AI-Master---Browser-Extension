/**
 * XHR/Fetch Interception for Transcript Capture
 * Implements Method 3 from TRANSCRIPT_EXTRACTION_METHODS.md
 *
 * This script intercepts network requests to capture transcript data
 * as YouTube loads it, providing a fallback method when direct API
 * access fails due to CORS or other issues.
 */

class TranscriptInterceptor {
    constructor() {
        this.interceptedTranscripts = new Map()
        this.interceptedMetadata = new Map()
        this.isInitialized = false
        this.logger = this._createLogger('XHR-Interceptor')
    }

    _createLogger(prefix) {
        return {
            info: (msg, ...args) => console.log(`[${prefix}] ℹ️ ${msg}`, ...args),
            success: (msg, ...args) => console.log(`[${prefix}] ✅ ${msg}`, ...args),
            warn: (msg, ...args) => console.warn(`[${prefix}] ⚠️ ${msg}`, ...args),
            error: (msg, ...args) => console.error(`[${prefix}] ❌ ${msg}`, ...args),
            debug: (msg, ...args) => console.debug(`[${prefix}] 🔍 ${msg}`, ...args)
        }
    }

    /**
     * Initialize XHR and Fetch interception
     */
    init() {
        if (this.isInitialized) {
            this.logger.warn('Already initialized')
            return
        }

        this.logger.info('Initializing transcript interception...')

        this._interceptXHR()
        this._interceptFetch()

        this.isInitialized = true
        this.logger.success('Interception initialized')
    }

    /**
     * Intercept XMLHttpRequest
     */
    _interceptXHR() {
        const self = this
        const originalOpen = XMLHttpRequest.prototype.open
        const originalSend = XMLHttpRequest.prototype.send

        XMLHttpRequest.prototype.open = function (method, url, ...args) {
            this._interceptedUrl = url
            this._interceptedMethod = method
            return originalOpen.apply(this, [method, url, ...args])
        }

        XMLHttpRequest.prototype.send = function (body) {
            const xhr = this

            // Add load event listener
            xhr.addEventListener('readystatechange', function () {
                if (this.readyState === 4 && this.status === 200) {
                    self._processResponse(xhr._interceptedUrl, xhr.responseText, xhr.responseURL)
                }
            })

            return originalSend.apply(this, [body])
        }

        this.logger.debug('XHR interception installed')
    }

    /**
     * Intercept Fetch API
     */
    _interceptFetch() {
        const self = this
        const originalFetch = window.fetch

        window.fetch = async function (resource, options) {
            const url = typeof resource === 'string' ? resource : resource.url

            try {
                const response = await originalFetch.apply(this, arguments)

                // Clone response to avoid consuming it
                const clonedResponse = response.clone()

                // Process in background
                self._processFetchResponse(url, clonedResponse).catch(e => {
                    self.logger.debug('Error processing fetch response:', e.message)
                })

                return response
            } catch (error) {
                throw error
            }
        }

        this.logger.debug('Fetch interception installed')
    }

    /**
     * Process XHR response
     */
    _processResponse(url, responseText, responseURL) {
        if (!url) return

        try {
            // Check if this is a timedtext request (transcript)
            if (url.includes('/timedtext') || url.includes('/api/timedtext')) {
                this._handleTranscriptResponse(url, responseText)
            }
            // Check if this is a player response (metadata)
            else if (url.includes('/player') || url.includes('ytInitialPlayerResponse')) {
                this._handlePlayerResponse(url, responseText)
            }
        } catch (e) {
            this.logger.debug('Error processing response:', e.message)
        }
    }

    /**
     * Process Fetch response
     */
    async _processFetchResponse(url, response) {
        if (!url) return

        try {
            // Check if this is a timedtext request
            if (url.includes('/timedtext') || url.includes('/api/timedtext')) {
                const text = await response.text()
                this._handleTranscriptResponse(url, text)
            }
            // Check if this is a player response
            else if (url.includes('/player') || url.includes('ytInitialPlayerResponse')) {
                const text = await response.text()
                this._handlePlayerResponse(url, text)
            }
        } catch (e) {
            this.logger.debug('Error profetch response:', e.message)
        }
    }

    /**
     * Handle transcript response
     */
    _handleTranscriptResponse(url, responseText) {
        try {
            const urlObj = new URL(url, window.location.origin)
            const lang = urlObj.searchParams.get('lang') || urlObj.searchParams.get('tlang') || 'en'
            const videoId = urlObj.searchParams.get('v')

            this.logger.debug(`Captured transcript: lang=${lang}, videoId=${videoId}`)

            // Store the raw response
            const key = `${videoId || 'current'}_${lang}`
            this.interceptedTranscripts.set(key, {
                lang,
                videoId,
                data: responseText,
                timestamp: Date.now(),
                url
            })

            // Parse and store segments
            const segments = this._parseTranscriptResponse(responseText, url)
            if (segments.length > 0) {
                this.interceptedTranscripts.set(`${key}_parsed`, segments)
                this.logger.success(`Parsed ${segments.length} transcript segments for ${lang}`)
            }

            // Dispatch custom event for other parts of the extension
            window.dispatchEvent(new CustomEvent('transcriptIntercepted', {
                detail: { lang, videoId, segments }
            }))
        } catch (e) {
            this.logger.error('Error handling transcript response:', e.message)
        }
    }

    /**
     * Handle player response
     */
    _handlePlayerResponse(url, responseText) {
        try {
            const data = JSON.parse(responseText)

            if (data.videoDetails) {
                const videoId = data.videoDetails.videoId
                this.logger.debug(`Captured metadata for video: ${videoId}`)

                this.interceptedMetadata.set(videoId, {
                    videoDetails: data.videoDetails,
                    captions: data.captions,
                    timestamp: Date.now()
                })

                // Dispatch custom event
                window.dispatchEvent(new CustomEvent('metadataIntercepted', {
                    detail: { videoId, metadata: data }
                }))
            }
        } catch (e) {
            this.logger.debug('Error handling player response:', e.message)
        }
    }

    /**
     * Parse transcript response based on format
     */
    _parseTranscriptResponse(responseText, url) {
        try {
            // Try JSON format first
            const data = JSON.parse(responseText)

            if (data.events) {
                // JSON3 format
                return data.events
                    .filter(e => e.segs)
                    .map(e => ({
                        start: e.tStartMs / 1000,
                        duration: (e.dDurationMs || 0) / 1000,
                        text: e.segs.map(s => s.utf8).join('')
                    }))
            }
        } catch (e) {
            // Not JSON, try XML
            return this._parseXMLTranscript(responseText)
        }

        return []
    }

    /**
     * Parse XML format transcript
     */
    _parseXMLTranscript(xmlText) {
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
        const textarea = document.createElement('textarea')
        textarea.innerHTML = text
        return textarea.value
    }

    /**
     * Get intercepted transcript
     */
    getTranscript(videoId, lang = 'en') {
        const key = `${videoId}_${lang}_parsed`
        const transcript = this.interceptedTranscripts.get(key)

        if (transcript) {
            this.logger.debug(`Retrieved intercepted transcript: ${lang}, ${transcript.length} segments`)
            return transcript
        }

        // Try without videoId (current video)
        const currentKey = `current_${lang}_parsed`
        return this.interceptedTranscripts.get(currentKey)
    }

    /**
     * Get intercepted metadata
     */
    getMetadata(videoId) {
        return this.interceptedMetadata.get(videoId)
    }

    /**
     * Get all available languages
     */
    getAvailableLanguages(videoId) {
        const languages = new Set()

        for (const [key, value] of this.interceptedTranscripts.entries()) {
            if (key.includes(videoId) && value.lang) {
                languages.add(value.lang)
            }
        }

        return Array.from(languages)
    }

    /**
     * Clear cached data
     */
    clear() {
        this.interceptedTranscripts.clear()
        this.interceptedMetadata.clear()
        this.logger.info('Cleared intercepted data')
    }

    /**
     * Get statistics
     */
    getStats() {
        return {
            transcripts: this.interceptedTranscripts.size,
            metadata: this.interceptedMetadata.size,
            isInitialized: this.isInitialized
        }
    }
}

// Create singleton instance
const transcriptInterceptor = new TranscriptInterceptor()

// Auto-initialize on script load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        transcriptInterceptor.init()
    })
} else {
    transcriptInterceptor.init()
}

// Export for use in other scripts
export default transcriptInterceptor
export { TranscriptInterceptor }
