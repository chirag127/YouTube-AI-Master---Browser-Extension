import { buildContextString } from './utils.js';
import { analyzeTranscript, buildPatternHints } from '../../utils/patterns/index.js';
import { sg } from '../../utils/shortcuts/storage.js';
export const segments = async context => {
  const cfg = await sg('config');
  const pCfg = cfg.config?.prompts?.segments || {};
  const role =
    pCfg.roleDescription ||
    'Elite Video Segmentation Specialist with 15+ years analyzing YouTube content structure and SponsorBlock taxonomy';
  const timingTarget = pCfg.timingAccuracyTarget || 2;
  const sponsorRange = pCfg.sponsorDurationRange || [30, 90];
  const introRange = pCfg.introDurationRange || [5, 15];
  const outroRange = pCfg.outroDurationRange || [10, 30];
  const minShort = pCfg.minSegmentsShort || 3;
  const minLong = pCfg.minSegmentsLong || 8;
  const threshold = pCfg.videoLengthThreshold || 600;
  const hintsEnabled = pCfg.enablePatternHints !== false;
  const transcript =
    context.transcript && context.transcript.length > 0
      ? typeof context.transcript === 'string'
        ? context.transcript
        : JSON.stringify(context.transcript)
      : '[]';
  const videoDuration = context.metadata?.lengthSeconds || 0;
  const minSegs = videoDuration > threshold ? minLong : minShort;
  const patternMatches = hintsEnabled ? analyzeTranscript(transcript) : {};
  const hints = hintsEnabled ? buildPatternHints(patternMatches) : '';
  return `Role: ${role}
Task: Generate PRECISE video segments with WORD-LEVEL timing predictions. Return ONLY valid JSON.

${buildContextString(context)}

${
  hintsEnabled
    ? `PATTERN DETECTION HINTS (Pre-Analyzed via Regex):
${hints || 'No patterns detected - analyze transcript semantically'}

`
    : ''
}CRITICAL TIMING PREDICTION PROTOCOL:
- Transcript provides SENTENCE-LEVEL timing blocks, NOT word-level
- YOU MUST predict word-level boundaries by:
  * Estimating speaking rate (words/second) within each block
  * Detecting transition phrases mid-block (e.g., "But first", "Now back to")
  * Calculating proportional time allocation for multi-topic blocks
  * Using typical segment durations as calibration (Sponsor: ${sponsorRange[0]}-${sponsorRange[1]}s, Intro: ${introRange[0]}-${introRange[1]}s, Outro: ${outroRange[0]}-${outroRange[1]}s)
- Segment boundaries MUST align with natural speech pauses (sentence endings)
- Accuracy target: ±${timingTarget} seconds of actual topic change

SPONSORBLOCK CATEGORY DEFINITIONS (November 2025 Official Guidelines):
- sponsor: Paid promotion of external product/service. Transitions: "sponsored by", "thanks to", "brought to you by", "use code". If >50% of video, use fullVideoLabel.
- selfpromo: Creator's own products (merch, courses, Patreon), unpaid shout-outs. Keywords: "my course", "my merch", "link in description", "join my".
- interaction: Explicit reminders to like/subscribe/follow. Keywords: "like and subscribe", "hit the bell", "leave a comment", "smash that like".
- intro: Opening animations, channel branding, livestream pauses. Keywords: "hey guys", "welcome back", "what's up". Duration: ${introRange[0]}-${introRange[1]}s typical.
- outro: Endcards/credits near video end. Keywords: "that's it for today", "thanks for watching", "see you next time". Duration: ${outroRange[0]}-${outroRange[1]}s typical.
- preview: Clips showing future content where info repeats later. Keywords: "coming up", "later in video", "stick around". Do NOT mark unique recaps.
- hook: Narrated trailers, greetings before intro. Keywords: "in this video", "today we're", "watch what happens". Duration: 5-20s typical.
- filler: Tangential content not required for understanding (B-roll, time-lapses, fake sponsors, slow-mo replays). Keywords: "by the way", "off topic", "fun fact".
- music_offtopic: (Music videos only) Non-music sections. Only complete silence or off-topic content.
- poi_highlight: Point of Interest - specific highlight moment (start = end time).
- exclusive_access: (Full Video Label Only) Showcasing product/location with free/subsidized access.
- chapter: Chapter markers for navigation.
- content: Primary video content. NEVER skipped. Default for educational/entertainment material.

SEGMENTATION STRATEGY (MANDATORY):
1. Identify SPECIAL categories first (sponsor, selfpromo, interaction, intro, outro, preview, hook, filler)
2. Segment "content" by TOPIC - create ${minSegs}+ segments minimum for this video (${videoDuration}s)
3. MERGE adjacent segments of same category ONLY if same specific topic
4. NEVER create one giant "content" segment - break down by topic changes, scene changes, subject shifts

DESCRIPTION QUALITY RULES:
- Concise summaries (1-2 sentences max)
- FORBIDDEN: Raw transcript quotes or direct text
- REQUIRED: Summarize topic/content in your own words
- Focus on WHAT is discussed, not HOW

COMMUNITY SEGMENTS PRIORITY:
- IF Community Segments (SponsorBlock) provided: Use as PRIMARY REFERENCE (verified ground truth)
- Use their EXACT start/end times and category codes
- May refine descriptions or adjust ±1-2s if transcript adds context
- IF NOT provided: Analyze transcript independently

FULL VIDEO LABEL RULE:
- Calculate total video duration from transcript
- IF single category >50% duration: Set fullVideoLabel to that category, DO NOT create segments for it
- IF NO category >50%: Set fullVideoLabel to null
- Many videos are fully sponsored - use fullVideoLabel: "sponsor"

TRANSITION DETECTION SIGNALS:
- Sponsor: "This video is sponsored", "Thanks to [brand]", "Now back to", "But first"
- Selfpromo: "Check out my", "Link in description", "My course/merch"
- Interaction: "Don't forget to like", "Subscribe for", "Hit the bell"
- Topic changes: "Now let's", "Moving on to", "Speaking of", "Next up"

TIMING CALIBRATION:
- Sponsor mentions: ${sponsorRange[0]}-${sponsorRange[1]}s typical
- Intros: ${introRange[0]}-${introRange[1]}s typical
- Outros/Endcards: ${outroRange[0]}-${outroRange[1]}s typical
- Interaction reminders: 5-10s typical
- Use these to validate predictions

JSON FORMAT (EXACT SponsorBlock API category names):
{
  "segments": [
    {
      "s": number,
      "e": number,
      "l": "sponsor"|"selfpromo"|"interaction"|"intro"|"outro"|"preview"|"hook"|"filler"|"music_offtopic"|"poi_highlight"|"exclusive_access"|"chapter"|"content",
      "t": "Title",
      "d": "Description"
    }
  ],
  "fullVideoLabel": "sponsor"|"selfpromo"|"exclusive_access"|null
}

VALID CATEGORIES: sponsor, selfpromo, interaction, intro, outro, preview, hook, filler, music_offtopic, poi_highlight, exclusive_access, chapter, content

Transcript:
${transcript}`;
};
