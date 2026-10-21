import { describe, expect, it } from 'vitest';
import {
  getDeliveryEstimate,
  getDispatchCountdown,
} from './deliveryEstimate';

describe('product delivery estimate', () => {
  it('includes the order date in the delivery window before the dispatch cutoff', () => {
    expect(getDeliveryEstimate(new Date('2026-10-14T03:30:00.000Z')))
      .toBe('18th October 2026 – 20th October 2026');
  });

  it('includes the year when the estimate crosses into a new year', () => {
    expect(getDeliveryEstimate(new Date('2026-12-28T03:30:00.000Z')))
      .toBe('1st January 2027 – 3rd January 2027');
  });

  it('starts the delivery window one day later after the India-time dispatch cutoff', () => {
    expect(getDeliveryEstimate(new Date('2026-10-14T08:30:00.000Z')))
      .toBe('19th October 2026 – 21st October 2026');
  });

  it('counts down to 2:00 PM India time and stops at the cutoff', () => {
    expect(getDispatchCountdown(new Date('2026-10-14T20:30:00.000Z'))).toBe('12:00:00');
    expect(getDispatchCountdown(new Date('2026-10-14T08:30:00.000Z'))).toBeNull();
  });
});
