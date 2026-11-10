import { describe, expect, it } from 'vitest';
import { formatOrderNumber } from './formatOrderNumber';

describe('formatOrderNumber', () => {
  it('formats a valid internal order ID as a stable nine-digit reference', () => {
    expect(formatOrderNumber(12345)).toBe('000012345');
  });

  it('keeps nine-digit IDs intact', () => {
    expect(formatOrderNumber(123456789)).toBe('123456789');
  });

  it('returns a placeholder for invalid IDs', () => {
    expect(formatOrderNumber('not-an-id')).toBe('—');
    expect(formatOrderNumber(0)).toBe('—');
  });
});
