// XHR Interceptor Strategy
// Priority: 2 (Fast if available, but less reliable than direct API)
// Captures live network requests

import transcriptInterceptor from '../../../content/transcript/xhr-interceptor.js'

export async function fetchViaXHR(videoId, lang = 'en') {
    const transcript = transcriptInterceptor.getTranscript(videoId, lang)

    if (!transcript?.length) {
        throw new Error('No intercepted transcript available')
    }

    return transcript
}

export const strategy = {
    name: 'XHR Interceptor',
    priority: 2,
    fetch: fetchViaXHR
}
