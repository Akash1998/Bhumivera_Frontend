import { describe, it, expect } from 'vitest';
import { matchAiIntentWithFuzzy, calculateLevenshteinDistance, collapseRepeatedChars } from './aiIntentMatcher';

describe('aiIntentMatcher fuzzy typo tolerance', () => {
  it('correctly calculates Levenshtein distance', () => {
    expect(calculateLevenshteinDistance('password', 'paswrd')).toBe(2);
    expect(calculateLevenshteinDistance('password', 'passpot')).toBe(3);
    expect(calculateLevenshteinDistance('track', 'trak')).toBe(1);
  });

  it('collapses repeated characters', () => {
    expect(collapseRepeatedChars('passsswword')).toBe('pasword');
    expect(collapseRepeatedChars('dammmage')).toBe('damage');
  });

  it('resolves typo-filled password queries (passpot, paswrd, pswrd)', () => {
    const res1 = matchAiIntentWithFuzzy('how do i change my passpot');
    expect(res1).not.toBeNull();
    expect(res1.intent).toBe('PASSWORD_GUIDE');

    const res2 = matchAiIntentWithFuzzy('my paswrd is not working');
    expect(res2).not.toBeNull();
    expect(res2.intent).toBe('PASSWORD_GUIDE');

    const res3 = matchAiIntentWithFuzzy('forgot pswrd otp');
    expect(res3).not.toBeNull();
    expect(res3.intent).toBe('PASSWORD_GUIDE');
  });

  it('resolves damaged items, leakages, and return policy queries', () => {
    const res1 = matchAiIntentWithFuzzy('my shampoo bottle arrived leaking');
    expect(res1).not.toBeNull();
    expect(res1.intent).toBe('DAMAGED_ITEM_CREDIT');
    expect(res1.reply).toContain('Zero return shipping hassle');

    const res2 = matchAiIntentWithFuzzy('can i return this facewash');
    expect(res2).not.toBeNull();
    expect(res2.intent).toBe('DAMAGED_ITEM_CREDIT');
    expect(res2.reply).toContain('Why No Physical Returns?');

    const res3 = matchAiIntentWithFuzzy('item damadge in courier');
    expect(res3).not.toBeNull();
    expect(res3.intent).toBe('DAMAGED_ITEM_CREDIT');
  });

  it('resolves order tracking and delivery queries with typos', () => {
    const res1 = matchAiIntentWithFuzzy('where is my ordr');
    expect(res1).not.toBeNull();
    expect(res1.intent).toBe('ORDER_TRACKING');

    const res2 = matchAiIntentWithFuzzy('live traking status');
    expect(res2).not.toBeNull();
    expect(res2.intent).toBe('ORDER_TRACKING');
  });

  it('resolves address and Google map pinpoint queries', () => {
    const res = matchAiIntentWithFuzzy('how to set google map delivery location');
    expect(res).not.toBeNull();
    expect(res.intent).toBe('ADDRESS_PINPOINT');
  });

  it('resolves payment and UPI queries', () => {
    const res = matchAiIntentWithFuzzy('upi money debited but order not confirmed');
    expect(res).not.toBeNull();
    expect(res.intent).toBe('PAYMENT_TROUBLESHOOT');
  });
});
