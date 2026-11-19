import { describe, expect, it } from 'vitest';
import { computeOptimalA4QrLayout } from './BatchBarcodeGeneratorModal';

describe('A4 QR print layout', () => {
  it('uses the full page for a single QR instead of placing it in a small grid cell', () => {
    const layout = computeOptimalA4QrLayout(1);

    expect(layout).toMatchObject({
      cols: 1,
      rows: 1,
      perPage: 1,
      totalPages: 1,
      qrSizeMm: 72,
    });
  });

  it('keeps larger batches scannable by using additional pages', () => {
    const twelveCodes = computeOptimalA4QrLayout(12);
    const thirteenCodes = computeOptimalA4QrLayout(13);

    expect(twelveCodes).toMatchObject({ cols: 3, rows: 4, perPage: 12, totalPages: 1 });
    expect(twelveCodes.qrSizeMm).toBeGreaterThan(38);
    expect(thirteenCodes).toMatchObject({ perPage: 12, totalPages: 2 });
    expect(thirteenCodes.qrSizeMm).toBe(twelveCodes.qrSizeMm);
  });
});
