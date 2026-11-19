// @vitest-environment jsdom
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BatchBarcodeGeneratorModal, { computeOptimalA4QrLayout } from './BatchBarcodeGeneratorModal';

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

  it('offers the preview QR as a downloadable 1080px vector SVG', async () => {
    render(<BatchBarcodeGeneratorModal isOpen onClose={() => {}} />);

    const downloadLink = await screen.findByRole('link', { name: /download highest-quality qr/i });
    await waitFor(() => expect(downloadLink.getAttribute('href')).toMatch(/^data:image\/svg\+xml;charset=utf-8,/));

    const svg = decodeURIComponent(downloadLink.getAttribute('href').split(',').slice(1).join(','));
    expect(downloadLink.getAttribute('download')).toBe('BV-PRODUCT-qr.svg');
    expect(svg).toContain('width="1080"');
    expect(svg).toContain('shape-rendering="crispEdges"');
    expect(svg).toContain('Bhumivera Formulation');
    expect(svg).toContain('BV-QR:BV-PRODUCT');
    expect(svg).toContain('₹299');
  });
});
