import { describe, expect, it } from 'vitest';
import { getInvoiceNumber } from '../../../utils/invoiceNumber';

describe('fulfillment invoice numbering', () => {
  it('creates a stable fiscal-year invoice number unique to the order ID', () => {
    const date = '2026-11-10T12:00:00.000Z';

    expect(getInvoiceNumber({ id: 9, createdAt: date })).toBe('BV/26-27/0009');
    expect(getInvoiceNumber({ id: 10, createdAt: date })).toBe('BV/26-27/0010');
    expect(getInvoiceNumber({ id: 9, createdAt: date })).toBe('BV/26-27/0009');
  });

  it('assigns orders before April to the preceding fiscal year', () => {
    expect(getInvoiceNumber({ id: 12, createdAt: '2027-02-01T12:00:00.000Z' })).toBe('BV/26-27/0012');
  });
});
