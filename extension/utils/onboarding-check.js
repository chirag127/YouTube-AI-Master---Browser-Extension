import { ssg as sg, ss, url, tab, w } from './shortcuts/index.js';

export class OnboardingChecker {
  static async isCompleted() {
    const r = await sg('obDone');
    return r.obDone === true;
  }
  static async hasApiKey() {
    const r = await sg('apiKey');
    return !!(r.apiKey && r.apiKey.trim());
  }
  static async shouldShowOnboarding() {
    return !(await this.isCompleted());
  }
  static async openOnboarding() {
    await tab({ url: url('onboarding/onboarding.html') });
  }
  static async checkAndPrompt() {
    if (await this.shouldShowOnboarding()) {
      await this.openOnboarding();
      return false;
    }
    if (!(await this.hasApiKey())) {
      w('API key not configured');
      return false;
    }
    return true;
  }
  static async markCompleted() {
    await ss('obDone', true);
  }
}
