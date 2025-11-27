import transcriptInterceptor from './xhr-interceptor.js'

class TranscriptExtractor {
    constructor() {
        this.cache = new Map()
        this.cacheTimeout = 300000 // 5min
    }

    log(level, method, msg) {
        const icons = { info: 'ℹ️', success: '✅', warn: '⚠️', error: '❌' }
        console[level](`[TranscriptExtractor] ${icons[level]} ${method ? `[${method}] ` : ''}${msg}`)
    }

    async extract(videoId, { lang = 'en', preferredMethod = null, useCache = true, timeout = 30000 } = {}) {
        this.log('info', null, `Extracting: ${videoId}, lang: ${lang}`)

        if (useCache) {
            const cached = this._getCache(videoId, lang)
            if (cached) {
                this.log('success', null, 'Cache hit')
                return cached
            }
        }

        if (preferredMethod) {
            try {
                const result = await this._extract(preferredMethod, videoId, lang, timeout)
                if (result?.length) {
                    this._setCache(videoId, lang, result)
                    return result
                }
                this.log('error', preferredMethod, 'Empty result')
            } catch (e) {
                this.log('error', preferredMethod, e.message)
            }
        }

        const methods = ['interceptor', 'invidious', 'youtube', 'background', 'dom']
        let lastError

        for (const method of methods) {
            try {
                const result = await this._extract(method, videoId, lang, timeout)
                if (result?.length) {
                    this.log('success', method, `${result.length} segments`)
                    this._setCache(videoId, lang, result)
                    return result
                }
                this.log('warn', method, 'Empty result')
            } catch (e) {
                lastError = e
                this.log('error', method, e.message)
            }
        }

        throw new Error(lastError?.message || 'All methods failed')
    }

    async _extract(method, videoId, lang, timeout) {
        const promise = this[`_${method}`](videoId, lang)
        return Promise.race([promise, new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout)
        )])
    }

    async _interceptor(videoId, lang) {
        const t = transcriptInterceptor.getTranscript(videoId, lang)
        if (!t?.length) throw new Error('No intercepted transcript')
        return t
    }

    async _invidious(videoId, lang) {
        const res = await chrome.runtime.sendMessage({ action: 'FETCH_INVIDIOUS_TRANSCRIPT', videoId, lang })
        if (!res.success || !res.data) throw new Error(res.error || 'Invidious failed')
        return res.data
    }

    async _youtube(videoId, lang) {
        const errors = []
        for (const fmt of ['json3', 'srv3', 'srv2', 'srv1']) {
            try {
                const res = await fetch(`https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}&fmt=${fmt}`)
                if (!res.ok) {
                    errors.push(`${fmt}:${res.status}`)
                    continue
                }

                if (fmt === 'json3') {
                    const data = await res.json()
                    if (data.events) {
                        const segs = data.events.filter(e => e.segs).map(e => ({
                            start: e.tStartMs / 1000,
                            duration: (e.dDurationMs || 0) / 1000,
                            text: e.segs.map(s => s.utf8).join('')
                        }))
                        if (segs.length) return segs
                    }
                    errors.push(`${fmt}:no events`)
                } else {
                    const segs = this._parseXML(await res.text())
                    if (segs.length) return segs
                    errors.push(`${fmt}:no segments`)
                }
            } catch (e) {
                errors.push(`${fmt}:${e.message}`)
            }
        }
        throw new Error(`YouTube failed: ${errors.join(', ')}`)
    }

    async _background(videoId, lang) {
        const res = await chrome.runtime.sendMessage({ action: 'FETCH_TRANSCRIPT', videoId, lang })
        if (!res.success || !res.data) throw new Error(res.error || 'Background failed')
        return res.data.segments || res.data
    }

    async _dom(videoId, lang) {
        const pr = this._getPlayerResponse()
        if (!pr) throw new Error('No ytInitialPlayerResponse')

        const tracks = pr?.captions?.playerCaptionsTracklistRenderer?.captionTracks
        if (!tracks?.length) throw new Error('No caption tracks')

        let track = tracks.find(t => t.languageCode === lang)
        if (!track) {
            track = tracks[0]
            this.log('warn', 'dom', `Lang '${lang}' not found, using '${track.languageCode}'`)
        }

        const res = await fetch(track.baseUrl)
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)

        const ct = res.headers.get('content-type')
        if (ct?.includes('json')) {
            const data = await res.json()
            if (data.events) {
                return data.events.filter(e => e.segs).map(e => ({
                    start: e.tStartMs / 1000,
                    duration: (e.dDurationMs || 0) / 1000,
                    text: e.segs.map(s => s.utf8).join('')
                }))
            }
        } else {
            return this._parseXML(await res.text())
        }
        throw new Error('DOM: no valid data')
    }

    getAvailableTracks() {
        const pr = this._getPlayerResponse()
        return pr?.captions?.playerCaptionsTracklistRenderer?.captionTracks || []
    }

    getAvailableLanguages() {
        return this.getAvailableTracks().map(t => ({
            code: t.languageCode,
            name: t.name?.simpleText || t.languageCode,
            kind: t.kind
        }))
    }

    hasCaptions() {
        return this.getAvailableTracks().length > 0
    }

    formatWithTimestamps(segments) {
        return segments.map(s => `[${this._formatTime(s.start)}] ${s.text}`).join('\n')
    }

    formatPlainText(segments) {
        return segments.map(s => s.text).join(' ')
    }

    _formatTime(sec) {
        const h = Math.floor(sec / 3600)
        const m = Math.floor((sec % 3600) / 60)
        const s = Math.floor(sec % 60)
        return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
            : `${m}:${s.toString().padStart(2, '0')}`
    }

    _parseXML(xml) {
        const segs = []
        const regex = /<text start="([\d.]+)"(?:\s+dur="([\d.]+)")?[^>]*>([^<]*)<\/text>/g
        let match
        while ((match = regex.exec(xml))) {
            const text = this._decodeHTML(match[3])
            if (text.trim()) {
                segs.push({
                    start: parseFloat(match[1]),
                    duration: match[2] ? parseFloat(match[2]) : 0,
                    text
                })
            }
        }
        return segs
    }

    _decodeHTML(text) {
        const el = document.createElement('textarea')
        el.innerHTML = text
        return el.value
    }

    _getPlayerResponse() {
        if (window.ytInitialPlayerResponse) return window.ytInitialPlayerResponse

        for (const script of document.querySelectorAll('script')) {
            const match = script.textContent?.match(/ytInitialPlayerResponse\s*=\s*({.+?});/)
            if (match) {
                try {
                    return JSON.parse(match[1])
                } catch (e) {
                    this.log('error', 'dom', 'Parse failed')
                }
            }
        }
        return null
    }

    _getCache(videoId, lang) {
        const cached = this.cache.get(`${videoId}_${lang}`)
        return cached && (Date.now() - cached.ts < this.cacheTimeout) ? cached.data : null
    }

    _setCache(videoId, lang, data) {
        this.cache.set(`${videoId}_${lang}`, { data, ts: Date.now() })
    }

    clearCache() {
        this.cache.clear()
        this.log('info', null, 'Cache cleared')
    }
}

export default new TranscriptExtractor()
export { TranscriptExtractor }
