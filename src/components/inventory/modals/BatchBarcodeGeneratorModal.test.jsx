// @vitest-environment jsdom
import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import BatchBarcodeGeneratorModal, { computeOptimalA4QrLayout } from './BatchBarcodeGeneratorModal';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

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

  it('uses the existing product QR labels for a combo instead of a combo QR', async () => {
    let renderedSvg = '';
    const canvasContext = {
      imageSmoothingEnabled: true,
      fillStyle: '',
      fillRect: vi.fn(),
      drawImage: vi.fn(),
    };
    vi.stubGlobal('Image', class {
      set src(value) {
        renderedSvg = decodeURIComponent(value.split(',').slice(1).join(','));
        this.onload();
      }
    });
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(canvasContext);
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,component-qr');
    const combo = {
      id: 20,
      productId: 200,
      sku: 'BV-CREATOR-COMBO',
      name: 'Creator Face & Body Combo',
      isBundle: true,
      comboComponents: [
        { product_id: 101, quantity: 1 },
        { product_id: 102, quantity: 1 },
      ],
    };
    const catalog = [
      combo,
      { id: 1, productId: 101, sku: 'BV-FACEWASH', name: 'Face Wash', price: 249 },
      { id: 2, productId: 102, sku: 'BV-SOAP', name: 'Soap', price: 129 },
    ];

    render(
      <BatchBarcodeGeneratorModal
        isOpen
        onClose={() => {}}
        catalog={catalog}
        initialProduct={combo}
      />,
    );

    expect(await screen.findByText(/No combo QR is needed\. Pack this combo by scanning each included product’s existing QR: Face Wash, Soap/i)).toBeTruthy();
    expect(screen.getByText(/Unique Standalone QR for Each Product \(2 Selected\)/i)).toBeTruthy();
    const downloadLink = await screen.findByRole('link', { name: /download 4k qr with cut border/i });
    await waitFor(() => expect(downloadLink.getAttribute('href')).toBe('data:image/png;base64,component-qr'));
    expect(downloadLink.getAttribute('download')).toBe('BV-FACEWASH-qr-4k.png');
    expect(renderedSvg).toContain('BV-FACEWASH');
    expect(renderedSvg).not.toContain('BV-CREATOR-COMBO');
    expect(renderedSvg).toContain('Face Wash');
  });

  it('offers the preview QR as a 4K PNG with a dashed cutting border', async () => {
    let renderedSvg = '';
    let canvasDimensions;
    const canvasContext = {
      imageSmoothingEnabled: true,
      fillStyle: '',
      fillRect: vi.fn(),
      drawImage: vi.fn(),
    };
    vi.stubGlobal('Image', class {
      set src(value) {
        renderedSvg = decodeURIComponent(value.split(',').slice(1).join(','));
        this.onload();
      }
    });
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function getContext() {
      canvasDimensions = { width: this.width, height: this.height };
      return canvasContext;
    });
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,4k-qr');

    render(<BatchBarcodeGeneratorModal isOpen onClose={() => {}} />);

    const downloadLink = await screen.findByRole('link', { name: /download 4k qr with cut border/i });
    await waitFor(() => expect(downloadLink.getAttribute('href')).toBe('data:image/png;base64,4k-qr'));

    expect(downloadLink.getAttribute('download')).toBe('BV-PRODUCT-qr-4k.png');
    expect(canvasDimensions).toEqual({ width: 4352, height: 5120 });
    expect(renderedSvg).toContain('width="4096" height="4096"');
    expect(renderedSvg).toContain('stroke-dasharray="18 14"');
    expect(renderedSvg).toContain('shape-rendering="crispEdges"');
    expect(renderedSvg).toContain('Bhumivera Formulation');
    expect(renderedSvg).not.toContain('BV-QR:BV-PRODUCT');
    expect(renderedSvg).not.toContain('Scan to verify');
    expect(renderedSvg).toContain('₹299');
  });
});
