import { state } from '../core/state.js'
import { addChatMessage } from '../ui/renderers/chat.js'
import { parseMarkdown } from '../../lib/marked-loader.js'
import metadataExtractor from '../metadata/extractor.js'

export async function sendChatMessage() {
    const i = document.getElementById('yt-ai-chat-input'), q = i?.value?.trim()
    if (!q) return
    await addChatMessage('user', q)
    i.value = ''
    const l = await addChatMessage('ai', 'Thinking...')
    try {
        const ctx = state.currentTranscript.map(t => t.text).join(' ')
        // Extract metadata for better chat context (Piped API first, then DOM)
        const metadata = state.currentVideoId ? await metadataExtractor.extract(state.currentVideoId) : null
        const r = await chrome.runtime.sendMessage({
            action: 'CHAT_WITH_VIDEO',
            question: q,
            context: ctx,
            metadata: metadata // Include video metadata for better responses
        })
        l.innerHTML = r.success ? await parseMarkdown(r.answer || 'Sorry, I could not answer that.') : `Error: ${r.error}`
    } catch (e) { l.textContent = `Error: ${e.message}` }
}
