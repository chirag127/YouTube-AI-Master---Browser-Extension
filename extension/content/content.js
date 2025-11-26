/**
 * YouTube AI Master - Content Script
 * Handles DOM interaction: video seeking, data extraction, transcript fetching, and UI injection.
 */

console.log('YouTube AI Master: Content script loaded.')

// Import transcript service functionality
class ContentScriptTranscriptService {
  async _fetchVideoPage(videoId) {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch video page: ${response.statusText}`)
    }
    return response.text()
  }

  _extractPlayerResponse(html) {
    const startPattern = 'ytInitialPlayerResponse = '
    const startIndex = html.indexOf(startPattern)
    if (startIndex === -1) {
      throw new Error('Failed to extract player response')
    }

    let braceCount = 0
    let endIndex = -1
    let foundStart = false
    const jsonStartIndex = startIndex + startPattern.length

    for (let i = jsonStartIndex; i < html.length; i++) {
      if (html[i] === '{') {
        braceCount++
        foundStart = true
      } else if (html[i] === '}') {
        braceCount--
      }

      if (foundStart && braceCount === 0) {
        endIndex = i + 1
        break
      }
    }

    if (endIndex === -1) {
      throw new Error('Failed to parse player response JSON')
    }

    const jsonStr = html.substring(jsonStartIndex, endIndex)
    try {
      return JSON.parse(jsonStr)
    } catch (e) {
      throw new Error('Failed to parse player response JSON content')
    }
  }

  async getVideoMetadata(videoId) {
    if (!videoId) throw new Error('Video ID is required')

    try {
      const html = await this._fetchVideoPage(videoId)
      const playerResponse = this._extractPlayerResponse(html)
      const videoDetails = playerResponse.videoDetails

      if (!videoDetails) {
        throw new Error('No video details found')
      }

      return {
        title: videoDetails.title,
        duration: Number.parseInt(videoDetails.lengthSeconds, 10),
        author: videoDetails.author,
        viewCount: videoDetails.viewCount,
      }
    } catch (error) {
      console.error('ContentScriptTranscriptService getVideoMetadata Error:', error)
      throw error
    }
  }

  async getTranscript(videoId, lang = 'en') {
    if (!videoId) throw new Error('Video ID is required')

    try {
      console.log('Fetching transcript for video:', videoId)
      const html = await this._fetchVideoPage(videoId)
      let tracks = []

      // Strategy 1: Parse ytInitialPlayerResponse (Most reliable)
      try {
        const playerResponse = this._extractPlayerResponse(html)
        if (playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks) {
          tracks = playerResponse.captions.playerCaptionsTracklistRenderer.captionTracks
          console.log('Found tracks via JSON:', tracks.length)
        }
      } catch (e) {
        console.log('JSON strategy failed:', e.message)
      }

      // Strategy 2: Regex for captionTracks
      if (tracks.length === 0) {
        console.log('Trying regex strategy...')
        const patterns = [
          /["']?captionTracks["']?\s*:\s*(\[[\s\S]+?\])/,
          /"captionTracks":\s*(\[[^\]]+\])/,
          /captionTracks["']?\s*:\s*(\[[^\]]+\])/
        ]

        for (const pattern of patterns) {
          const match = html.match(pattern)
          if (match) {
            try {
              const json = JSON.parse(match[1])
              if (Array.isArray(json)) {
                tracks = json
                console.log('Found tracks via Regex JSON:', tracks.length)
                break
              }
            } catch (e) { /* ignore */ }
          }
        }
      }

      // Strategy 3: Regex for baseUrl (Last resort)
      if (tracks.length === 0) {
        console.log('Trying baseUrl regex strategy...')
        const captionPattern = /captionTracks[^}]+baseUrl["']?\s*:\s*["']([^"']+)["']/g
        const matches = [...html.matchAll(captionPattern)]
        if (matches.length > 0) {
          tracks = matches.map((match) => ({
            languageCode: 'en', // Default assumption
            baseUrl: match[1],
          }))
        }
      }

      if (tracks.length === 0) {
        throw new Error(
          'This video does not have captions/subtitles available. Try a different video that has closed captions enabled.'
        )
      }

      // Select the best track
      const track =
        tracks.find((t) => t.languageCode === lang) ||
        tracks.find((t) => t.languageCode.startsWith('en')) ||
        tracks[0]

      if (!track) {
        throw new Error('No suitable caption track found')
      }

      console.log('Fetching transcript from:', track.baseUrl)
      const transcriptResponse = await fetch(track.baseUrl + '&fmt=json3')
      const transcriptJson = await transcriptResponse.json()

      const segments = this.parseTranscriptJson(transcriptJson)
      console.log('Parsed transcript segments:', segments.length)
      return segments
    } catch (error) {
      console.error('ContentScriptTranscriptService Error:', error)
      if (error.message.includes('captions') || error.message.includes('caption tracks')) {
        throw new Error(
          'This video does not have captions/subtitles available. Please try a different video that has closed captions enabled by the creator.'
        )
      }
      if (error.message.includes('Failed to fetch')) {
        throw new Error(
          'Unable to access YouTube. Please check your internet connection and try again.'
        )
      }
      throw new Error(`Transcript analysis failed: ${error.message}`)
    }
  }

  parseTranscriptJson(json) {
    const segments = []
    if (!json.events) return segments

    for (const event of json.events) {
      // Skip events without segments (e.g. just timing info)
      if (!event.segs) continue

      const text = event.segs.map(s => s.utf8).join('').trim()
      // Skip empty text segments
      if (!text) continue

      segments.push({
        start: event.tStartMs / 1000,
        duration: (event.dDurationMs || 0) / 1000,
        text: this.decodeHtml(text),
      })
    }
    return segments
  }

  decodeHtml(html) {
    const txt = document.createElement('textarea')
    txt.innerHTML = html
    return txt.value
  }
}

const transcriptService = new ContentScriptTranscriptService()

// Listen for messages from the extension (Side Panel / Background)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'SEEK_TO') {
    seekToTimestamp(request.timestamp)
    sendResponse({ status: 'success' })
  } else if (request.action === 'GET_VIDEO_DATA') {
    // Placeholder for extracting data if needed directly from DOM
    sendResponse({ title: document.title })
  } else if (request.action === 'GET_COMMENTS') {
    const comments = extractComments()
    sendResponse({ comments })
  } else if (request.action === 'GET_TRANSCRIPT') {
    ;(async () => {
      try {
        const transcript = await transcriptService.getTranscript(request.videoId)
        sendResponse({ transcript })
      } catch (error) {
        sendResponse({ error: error.message })
      }
    })()
    return true // Keep the message channel open for async response
  } else if (request.action === 'GET_METADATA') {
    ;(async () => {
      try {
        const metadata = await transcriptService.getVideoMetadata(request.videoId)
        sendResponse({ metadata })
      } catch (error) {
        sendResponse({ error: error.message })
      }
    })()
    return true // Keep the message channel open for async response
  } else if (request.action === 'SHOW_SEGMENTS') {
    injectSegmentMarkers(request.segments)
    currentSegments = request.segments
    updateSkipSettings() // Ensure we have latest settings
    startMonitoring()
    sendResponse({ status: 'success' })
  } else if (request.action === 'UPDATE_SETTINGS') {
    updateSkipSettings()
    sendResponse({ status: 'success' })
  }
})

let currentSegments = []
let skipSettings = {}
let monitoringInterval = null
let skipButton = null

function updateSkipSettings() {
  chrome.storage.local.get('autoSkip', (items) => {
    skipSettings = items.autoSkip || {}
    console.log('YouTube AI Master: Updated skip settings:', skipSettings)
  })
}

function startMonitoring() {
  if (monitoringInterval) clearInterval(monitoringInterval)

  const video = document.querySelector('video')
  if (!video) return

  // Use timeupdate event for smoother checking
  video.addEventListener('timeupdate', checkSkipLogic)

  // Backup interval in case event listeners are cleared
  monitoringInterval = setInterval(() => {
    if (!video.paused) checkSkipLogic()
  }, 1000)
}

function checkSkipLogic() {
  const video = document.querySelector('video')
  if (!video) return

  const currentTime = video.currentTime
  const currentSegment = currentSegments.find(
    (s) => currentTime >= s.start && currentTime < s.start + s.duration
  )

  if (currentSegment && currentSegment.label !== 'Content') {
    const shouldSkip = skipSettings[currentSegment.label]

    if (shouldSkip) {
      // Auto-skip
      console.log(`YouTube AI Master: Auto-skipping ${currentSegment.label}`)
      video.currentTime = currentSegment.start + currentSegment.duration
      showToast(`Skipped ${currentSegment.label}`)
    } else {
      // Show Skip Button
      showSkipButton(currentSegment)
    }
  } else {
    hideSkipButton()
  }
}

function showSkipButton(segment) {
  if (!skipButton) {
    skipButton = document.createElement('button')
    skipButton.id = 'ai-master-skip-btn'
    skipButton.style.cssText = `
      position: absolute;
      bottom: 150px;
      right: 20px;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-family: Roboto, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: opacity 0.2s;
    `
    skipButton.innerHTML = `
      <svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:white;"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
      Skip Segment
    `

    // Find a stable container
    const player = document.querySelector('#movie_player') || document.body
    player.appendChild(skipButton)

    skipButton.addEventListener('click', () => {
      const video = document.querySelector('video')
      if (video) {
        video.currentTime = segment.start + segment.duration
        hideSkipButton()
      }
    })
  }

  skipButton.querySelector('span')?.remove() // Remove old text if any
  const textSpan = document.createElement('span')
  textSpan.textContent = `Skip ${segment.label}`
  skipButton.appendChild(textSpan)

  skipButton.style.display = 'flex'
}

function hideSkipButton() {
  if (skipButton) {
    skipButton.style.display = 'none'
  }
}

function showToast(message) {
  const toast = document.createElement('div')
  toast.textContent = message
  toast.style.cssText = `
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    z-index: 10000;
    font-family: Roboto, Arial, sans-serif;
    font-size: 13px;
    pointer-events: none;
    animation: fadeInOut 2s ease-in-out forwards;
  `

  // Add keyframes if not present
  if (!document.getElementById('ai-master-toast-style')) {
    const style = document.createElement('style')
    style.id = 'ai-master-toast-style'
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -10px); }
        10% { opacity: 1; transform: translate(-50%, 0); }
        90% { opacity: 1; transform: translate(-50%, 0); }
        100% { opacity: 0; transform: translate(-50%, -10px); }
      }
    `
    document.head.appendChild(style)
  }

  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 2000)
}

function injectSegmentMarkers(segments) {
  const progressBar = document.querySelector('.ytp-progress-bar')
  if (!progressBar) return

  // Remove existing markers
  const existingContainer = document.getElementById('ai-master-markers')
  if (existingContainer) existingContainer.remove()

  const container = document.createElement('div')
  container.id = 'ai-master-markers'
  container.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 30;
  `

  const video = document.querySelector('video')
  const totalDuration = video ? video.duration : 0
  if (!totalDuration) return

  segments.forEach(segment => {
    if (segment.label === 'Content') return // Don't mark content

    const startPercent = (segment.start / totalDuration) * 100
    const widthPercent = (segment.duration / totalDuration) * 100

    const marker = document.createElement('div')
    marker.style.cssText = `
      position: absolute;
      left: ${startPercent}%;
      width: ${widthPercent}%;
      height: 100%;
      background-color: ${getSegmentColor(segment.label)};
      opacity: 0.6;
    `
    marker.title = segment.label
    container.appendChild(marker)
  })

  progressBar.appendChild(container)
}

function getSegmentColor(label) {
  const colors = {
    'Sponsor': '#ff4444',
    'Interaction Reminder': '#ff8800',
    'Self Promotion': '#ffaa00',
    'Unpaid Promotion': '#88cc00',
    'Highlight': '#00cc44',
    'Preview/Recap': '#00aaff',
    'Hook/Greetings': '#aa66cc',
    'Tangents/Jokes': '#cc66aa',
    'Content': 'transparent'
  }
  return colors[label] || '#999999'
}

/**
 * Extracts top comments from the DOM.
 * @returns {Array<string>}
 */
function extractComments() {
  const commentElements = document.querySelectorAll('#content-text')
  const comments = []
  // Get top 10 visible comments
  for (let i = 0; i < Math.min(commentElements.length, 10); i++) {
    comments.push(commentElements[i].innerText)
  }

  if (comments.length === 0) {
    // Try to scroll down a bit to trigger loading?
    // Or just warn that comments might not be loaded.
    console.warn('YouTube AI Master: No comments found in DOM. User might need to scroll.')
  }
  return comments
}

/**
 * Seeks the YouTube video player to the specified timestamp.
 * @param {number} seconds - Timestamp in seconds.
 */
function seekToTimestamp(seconds) {
  const video = document.querySelector('video')
  if (video) {
    video.currentTime = seconds
    video.play() // Optional: auto-play after seek
    console.log(`YouTube AI Master: Seeked to ${seconds}s`)
  } else {
    console.error('YouTube AI Master: Video element not found.')
  }
}

// Example: Inject a button (placeholder for future UI)
function injectTestButton() {
  // Wait for player to be ready
  const checkPlayer = setInterval(() => {
    const player = document.querySelector('#movie_player')
    if (player) {
      clearInterval(checkPlayer)
      console.log('YouTube AI Master: Player found, ready for injection.')
      // Logic to inject UI elements can go here
    }
  }, 1000)
}

injectTestButton()
