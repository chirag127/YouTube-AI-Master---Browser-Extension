/**
 * Service to fetch and parse YouTube video transcripts and metadata.
 */
export class YouTubeTranscriptService {
  /**
   * Fetches the video page HTML.
   * @param {string} videoId
   * @returns {Promise<string>}
   */
  async _fetchVideoPage(videoId) {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch video page: ${response.statusText}`)
    }
    return response.text()
  }

  /**
   * Extracts the ytInitialPlayerResponse JSON object from HTML.
   * @param {string} html
   * @returns {Object}
   */
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
      // Fallback to regex if brace counting fails (e.g. malformed HTML or unexpected structure)
      // But for now, let's throw to be safe/strict
      throw new Error('Failed to parse player response JSON')
    }

    const jsonStr = html.substring(jsonStartIndex, endIndex)
    try {
      return JSON.parse(jsonStr)
    } catch (e) {
      throw new Error('Failed to parse player response JSON content')
    }
  }

  /**
   * Retrieves video metadata (title, duration, etc.).
   * @param {string} videoId
   * @returns {Promise<{title: string, duration: number, author: string, viewCount: string}>}
   */
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
      console.error('YouTubeTranscriptService getVideoMetadata Error:', error)
      throw error
    }
  }

  /**
   * Fetches the transcript for a given video ID.
   * @param {string} videoId - The YouTube video ID.
   * @param {string} [lang='en'] - The language code.
   * @returns {Promise<Array<{text: string, start: number, duration: number}>>} - The transcript segments.
   */
  async getTranscript(videoId, lang = 'en') {
    if (!videoId) {
      throw new Error('Video ID is required')
    }

    try {
      const html = await this._fetchVideoPage(videoId)

      // 2. Extract captionTracks using Regex (more robust than JSON parsing for this specific field)
      const captionTracksMatch = html.match(/["']?captionTracks["']?\s*:\s*(\[[\s\S]+?\])/)
      if (!captionTracksMatch) {
        throw new Error('No captions found for this video')
      }

      const captionTracksJson = captionTracksMatch[1]

      const tracks = []
      const trackRegex =
        /["']?languageCode["']?\s*:\s*["']([^"']+)["'][\s\S]+?["']?baseUrl["']?\s*:\s*["']([^"']+)["']/g

      let trackMatch
      while ((trackMatch = trackRegex.exec(captionTracksJson)) !== null) {
        tracks.push({
          languageCode: trackMatch[1],
          baseUrl: trackMatch[2],
        })
      }

      if (tracks.length === 0) {
        throw new Error('Failed to parse caption tracks')
      }

      // 3. Find the best track
      const track =
        tracks.find((t) => t.languageCode === lang) ||
        tracks.find((t) => t.languageCode.startsWith('en')) ||
        tracks[0]

      if (!track) {
        throw new Error('No suitable caption track found')
      }

      // 4. Fetch the transcript XML
      const transcriptResponse = await fetch(track.baseUrl)
      const transcriptXml = await transcriptResponse.text()

      // 5. Parse XML
      return this.parseTranscriptXml(transcriptXml)
    } catch (error) {
      console.error('YouTubeTranscriptService Error:', error)
      throw error
    }
  }

  /**
   * Parses the transcript XML into an array of segments.
   * @param {string} xml - The transcript XML string.
   * @returns {Array<{text: string, start: number, duration: number}>}
   */
  parseTranscriptXml(xml) {
    const segments = []
    const regex = /<text start="([\d.]+)" dur="([\d.]+)">([^<]+)<\/text>/g
    let match

    while ((match = regex.exec(xml)) !== null) {
      segments.push({
        start: Number.parseFloat(match[1]),
        duration: Number.parseFloat(match[2]),
        text: this.decodeHtml(match[3]),
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
