import {
  analyzeSentiment,
  detectSpam,
  isQuestion,
} from '../../../extension/utils/patterns/comments.js';

describe('Comments Patterns', () => {
  describe('analyzeSentiment', () => {
    it('should detect positive sentiment', () => {
      expect(analyzeSentiment('This is amazing and helpful')).toBe('positive');
      expect(analyzeSentiment('Great video thanks')).toBe('positive');
    });

    it('should detect negative sentiment', () => {
      expect(analyzeSentiment('This is terrible and useless')).toBe('negative');
      expect(analyzeSentiment('I hate this garbage')).toBe('negative');
    });

    it('should detect neutral sentiment', () => {
      expect(analyzeSentiment('This is a video')).toBe('neutral');
    });
  });

  describe('detectSpam', () => {
    it('should detect spam', () => {
      expect(detectSpam('Check out my channel')).toBe(true);
      expect(detectSpam('Free money click here')).toBe(true);
    });

    it('should not detect non-spam', () => {
      expect(detectSpam('This is a great video')).toBe(false);
    });
  });

  describe('isQuestion', () => {
    it('should detect questions', () => {
      expect(isQuestion('How do I do this?')).toBe(true);
      expect(isQuestion('Can you help me')).toBe(true);
    });

    it('should not detect non-questions', () => {
      expect(isQuestion('This is a statement')).toBe(false);
    });
  });
});
