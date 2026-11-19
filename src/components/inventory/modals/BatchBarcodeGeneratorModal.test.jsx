import { describe, expect, it } from 'vitest';
import { computeOptimalA4QrLayout } from './BatchBarcodeGeneratorModal';

describe('A4 QR print layout', () => {
  it('uses one A4 page and keeps a single QR within its physical size cap', () => {
    const layout = computeOptimalA4QrLayout(1);

    expect(layout).toMatchObject({
      cols: 1,
      rows: 1,
      perPage: 1,
      totalPages: 1,
      qrSizeMm: 38,
    });
  });

  it('fits a large batch on one page and maximizes QR size for that grid', () => {
    const layout = computeOptimalA4QrLayout(72);

    expect(layout.totalPages).toBe(1);
    expect(layout.perPage).toBe(72);
    expect(layout.cols * layout.rows).toBeGreaterThanOrEqual(72);
    expect(layout.qrSizeMm).toBeLessThanOrEqual(38);
    expect(layout.qrSizeMm).toBeGreaterThan(20);
  });
});
