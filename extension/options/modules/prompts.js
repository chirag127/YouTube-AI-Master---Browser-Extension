import { SettingsManager } from './settings-manager.js';
import { NotificationManager } from './notification-manager.js';
const sm = new SettingsManager();
const nm = new NotificationManager();
export const initPromptsSection = async () => {
  await sm.load();
  const cfg = sm.get('prompts') || {};
  const el = id => document.getElementById(id);
  el('prompts-segments-role').value = cfg.segments?.roleDescription || '';
  el('prompts-segments-timing').value = cfg.segments?.timingAccuracyTarget || 2;
  el('prompts-segments-hints').checked = cfg.segments?.enablePatternHints !== false;
  el('prompts-segments-sponsor-range').value =
    cfg.segments?.sponsorDurationRange?.join(',') || '30,90';
  el('prompts-segments-intro-range').value = cfg.segments?.introDurationRange?.join(',') || '5,15';
  el('prompts-segments-outro-range').value = cfg.segments?.outroDurationRange?.join(',') || '10,30';
  el('prompts-segments-min-short').value = cfg.segments?.minSegmentsShort || 3;
  el('prompts-segments-min-long').value = cfg.segments?.minSegmentsLong || 8;
  el('prompts-segments-threshold').value = cfg.segments?.videoLengthThreshold || 600;
  el('prompts-comprehensive-role').value = cfg.comprehensive?.roleDescription || '';
  el('prompts-comprehensive-bold').checked = cfg.comprehensive?.keywordBoldingEnabled !== false;
  el('prompts-comprehensive-resources').checked =
    cfg.comprehensive?.includeResourcesSection !== false;
  el('prompts-comprehensive-takeaways').checked =
    cfg.comprehensive?.includeActionableTakeaways !== false;
  el('prompts-comprehensive-max-resources').value = cfg.comprehensive?.maxResourcesMentioned || 10;
  el('prompts-comprehensive-max-takeaways').value = cfg.comprehensive?.maxTakeaways || 5;
  el('prompts-comments-role').value = cfg.comments?.roleDescription || '';
  el('prompts-comments-spam').checked = cfg.comments?.enableSpamFiltering !== false;
  el('prompts-comments-sentiment').checked = cfg.comments?.enableSentimentLabeling !== false;
  el('prompts-comments-likes').value = cfg.comments?.minLikesForHighEngagement || 10;
  el('prompts-comments-themes').value = cfg.comments?.maxThemes || 7;
  el('prompts-comments-questions').value = cfg.comments?.maxQuestions || 5;
  el('prompts-comments-opportunities').checked =
    cfg.comments?.includeCreatorOpportunities !== false;
  el('save-prompts').addEventListener('click', savePrompts);
};
const savePrompts = async () => {
  const el = id => document.getElementById(id);
  const sponsorRange = el('prompts-segments-sponsor-range').value.split(',').map(Number);
  const introRange = el('prompts-segments-intro-range').value.split(',').map(Number);
  const outroRange = el('prompts-segments-outro-range').value.split(',').map(Number);
  sm.set('prompts.segments.roleDescription', el('prompts-segments-role').value);
  sm.set('prompts.segments.timingAccuracyTarget', Number(el('prompts-segments-timing').value));
  sm.set('prompts.segments.enablePatternHints', el('prompts-segments-hints').checked);
  sm.set('prompts.segments.sponsorDurationRange', sponsorRange);
  sm.set('prompts.segments.introDurationRange', introRange);
  sm.set('prompts.segments.outroDurationRange', outroRange);
  sm.set('prompts.segments.minSegmentsShort', Number(el('prompts-segments-min-short').value));
  sm.set('prompts.segments.minSegmentsLong', Number(el('prompts-segments-min-long').value));
  sm.set('prompts.segments.videoLengthThreshold', Number(el('prompts-segments-threshold').value));
  sm.set('prompts.comprehensive.roleDescription', el('prompts-comprehensive-role').value);
  sm.set('prompts.comprehensive.keywordBoldingEnabled', el('prompts-comprehensive-bold').checked);
  sm.set(
    'prompts.comprehensive.includeResourcesSection',
    el('prompts-comprehensive-resources').checked
  );
  sm.set(
    'prompts.comprehensive.includeActionableTakeaways',
    el('prompts-comprehensive-takeaways').checked
  );
  sm.set(
    'prompts.comprehensive.maxResourcesMentioned',
    Number(el('prompts-comprehensive-max-resources').value)
  );
  sm.set(
    'prompts.comprehensive.maxTakeaways',
    Number(el('prompts-comprehensive-max-takeaways').value)
  );
  sm.set('prompts.comments.roleDescription', el('prompts-comments-role').value);
  sm.set('prompts.comments.enableSpamFiltering', el('prompts-comments-spam').checked);
  sm.set('prompts.comments.enableSentimentLabeling', el('prompts-comments-sentiment').checked);
  sm.set('prompts.comments.minLikesForHighEngagement', Number(el('prompts-comments-likes').value));
  sm.set('prompts.comments.maxThemes', Number(el('prompts-comments-themes').value));
  sm.set('prompts.comments.maxQuestions', Number(el('prompts-comments-questions').value));
  sm.set(
    'prompts.comments.includeCreatorOpportunities',
    el('prompts-comments-opportunities').checked
  );
  await sm.save();
  nm.show('Prompt settings saved successfully', 'success');
};
