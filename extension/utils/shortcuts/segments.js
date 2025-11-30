export const LM = {
  sponsor: 'Sponsor',
  selfpromo: 'Self Promotion',
  interaction: 'Interaction Reminder',
  intro: 'Intro',
  outro: 'Outro',
  preview: 'Preview',
  music_offtopic: 'Music: Off-Topic',
  poi_highlight: 'Highlight',
  filler: 'Filler',
  exclusive_access: 'Exclusive Access',
  hook: 'Hook',
  chapter: 'Chapter',
  content: 'Content',
};
export const CM = {
  sponsor: '#00d26a',
  selfpromo: '#ffff00',
  interaction: '#a020f0',
  intro: '#00ffff',
  outro: '#0000ff',
  preview: '#00bfff',
  music_offtopic: '#ff9900',
  poi_highlight: '#ff0055',
  filler: '#9400d3',
  exclusive_access: '#008b45',
  hook: '#4169e1',
  chapter: '#1e90ff',
  content: '#999999',
};
export const lk = l => {
  if (!l) return 'content';
  if (LM[l]) return l;
  const fm = {
    Sponsor: 'sponsor',
    'Self Promotion': 'selfpromo',
    'Self Promotion/Unpaid Promotion': 'selfpromo',
    'Unpaid/Self Promotion': 'selfpromo',
    'Interaction Reminder': 'interaction',
    'Intermission/Intro Animation': 'intro',
    'Intermission/Intro': 'intro',
    Intro: 'intro',
    'Endcards/Credits': 'outro',
    Outro: 'outro',
    'Preview/Recap': 'preview',
    Preview: 'preview',
    'Tangents/Jokes': 'filler',
    'Filler/Tangent': 'filler',
    Filler: 'filler',
    Highlight: 'poi_highlight',
    'Exclusive Access': 'exclusive_access',
    'Off-Topic': 'music_offtopic',
    'Music: Non-Music Section': 'music_offtopic',
    'Music: Off-Topic': 'music_offtopic',
    'Hook/Greetings': 'hook',
    Hook: 'hook',
    Chapter: 'chapter',
    Content: 'content',
    'Main Content': 'content',
    'Content (Main Video)': 'content',
  };
  return fm[l] || l.toLowerCase().replace(/\s+/g, '_');
};
export const ln = c => LM[c] || c;
export const lgc = c => CM[c] || '#999999';
