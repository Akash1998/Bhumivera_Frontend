import { describe, expect, it } from 'vitest';
import { getDeliveryEstimate } from './deliveryEstimate';

describe('product delivery estimate', () => {
  it('shows a date range five to seven days after the order date', () => {
    expect(getDeliveryEstimate(new Date(2026, 9, 14, 9))).toBe('19 Oct - 21 Oct');
  });

  it('includes the year when the estimate crosses into a new year', () => {
    expect(getDeliveryEstimate(new Date(2026, 11, 28, 9))).toBe('2 Jan 2027 - 4 Jan 2027');
  });
});
