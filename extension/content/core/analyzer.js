import { state } from './state.js'
import { TranscriptService } from '../transcript/service.js'
import metadataExtractor from '../metadata/extractor.js'
import { showLoading, showError } from '../ui/components/loading.js'
import { renderSummary } from '../ui/renderers/summary.js'
import { injectSegmentMarkers } from '../segments/markers.js'
import { setupAutoSkip } from '../segments/autoskip.js'
import { renderTimeline } from '../segments/timeline.js'
const transcriptService = new TranscriptService()
export async function startAnalysis() {
    if (state.isAnalyzing || !state.currentVideoId) return
    state.isAnalyzing = true
    const c = document.getElementById('yt-ai-content-area')
    try {
        showLoading(c, 'Extracting video metadata...')
        // Extract comprehensive metadata including title and description
        // DOM extraction first, Piped API as last fallback
        const pageMetadata = await metadataExtractor.extract(state.currentVideoId)

        showLoading(c, 'Fetching additional metadata...')
        const apiMetadata = await transcriptService.getMetadata(state.currentVideoId)

        // Merge metadata from both sources
        const m = { ...apiMetadata, ...pageMetadata, videoId: state.currentVideoId }

        showLoading(c, 'Extracting transcript (6 fallback methods)...')
        state.currentTranscript = await transcriptService.getTranscript(state.currentVideoId)
        if (!state.currentTranscript?.length) throw new Error('No transcript available for this video')

        showLoading(c, `Analyzing ${state.currentTranscript.length} segments with AI...`)
        const r = await chrome.runtime.sendMessage({
            action: 'ANALYZE_VIDEO',
            transcript: state.currentTranscript,
            metadata: m, // Now includes title, description, keywords, etc.
            options: { length: 'Medium' }
        })

        if (!r.success) throw new Error(r.error || 'Analysis failed')
        state.analysisData = r.data
        if (state.analysisData.segments) {
            injectSegmentMarkers(state.analysisData.segments)
            setupAutoSkip(state.analysisData.segments)
            const v = document.querySelector('video')
            if (v) renderTimeline(state.analysisData.segments, v.duration)
        }
        renderSummary(c, state.analysisData)
    } catch (e) { showError(c, e.message) } finally { state.isAnalyzing = false }
}
