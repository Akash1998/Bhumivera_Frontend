import { describe, expect, it } from 'vitest';
import {
  FRONTEND_INGREDIENT_MEMORY,
  FRONTEND_PRODUCTS_GUIDE,
  resolveClientSideConciergeFallback,
} from './bhumiveraAiConciergeFallback';

describe('Bhumivera AI concierge fallback', () => {
  it('provides product guide data for the science page', () => {
    expect(FRONTEND_PRODUCTS_GUIDE.length).toBeGreaterThan(0);
    expect(FRONTEND_PRODUCTS_GUIDE[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      bestTimeToUse: {
        morning: expect.any(String),
        evening: expect.any(String),
        frequency: expect.any(String),
      },
      prompts: {
        knowMore: expect.any(String),
        usage: expect.any(String),
        niacinamide: expect.any(String),
      },
    });
    expect(FRONTEND_INGREDIENT_MEMORY.length).toBeGreaterThan(0);
  });

  it('answers product questions from local guide data', () => {
    const result = resolveClientSideConciergeFallback(
      'Tell me about Sea Buckthorn Face Wash and its key ingredients'
    );

    expect(result.reply).toContain('Bhumivera Sea Buckthorn Face Wash');
    expect(result.reply).toContain('Niacinamide (Vitamin B3)');
    expect(result.quickActions.length).toBeGreaterThan(0);
  });

  it('answers ingredient-specific questions without needing the API', () => {
    const result = resolveClientSideConciergeFallback(
      'Tell me about Niacinamide in Sea Buckthorn Face Wash'
    );

    expect(result.reply).toContain('Niacinamide');
    expect(result.reply).toContain('vitamin B3');
  });

  it('does not invent live account information for unsupported requests', () => {
    const result = resolveClientSideConciergeFallback('What is my account balance?');

    expect(result.reply).toContain('temporarily unavailable');
    expect(result.reply).toContain('cannot look up live account details');
  });
});
