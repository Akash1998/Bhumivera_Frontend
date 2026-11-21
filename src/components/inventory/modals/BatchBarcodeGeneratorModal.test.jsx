// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import BatchBarcodeGeneratorModal, { computeQrSheetLayout } from './BatchBarcodeGeneratorModal';
import { serials as serialApi } from '../../../services/api';

vi.mock('../../../services/api', () => ({
  serials: { createGenuinityQR: vi.fn() },
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('print-ready QR sheet layout', () => {
  it('fits exact 19 mm square QRs on A4 and A3 sheets', () => {
    expect(computeQrSheetLayout()).toMatchObject({
      cols: 10,
      rows: 14,
      capacity: 140,
      qrSizeMm: 19,
    });
    expect(computeQrSheetLayout(297, 420)).toMatchObject({
      cols: 14,
      rows: 20,
      capacity: 280,
      qrSizeMm: 19,
    });
  });

  it('recalculates the full-page count after selecting A3 or changing custom paper length', () => {
    render(
      <BatchBarcodeGeneratorModal
        isOpen
        onClose={() => {}}
        initialProduct={{ id: 1, sku: 'BV-PRODUCT', name: 'Test product' }}
      />,
    );

    fireEvent.change(screen.getByLabelText('Paper Size'), { target: { value: 'a3' } });
    expect(screen.getByText(/280 QRs per page \(14 columns × 20 rows\)/)).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Paper Length (mm)'), { target: { value: '500' } });
    expect(screen.getByText(/336 QRs per page \(14 columns × 24 rows\)/)).toBeTruthy();
  });

  it('opens a vector-only, caption-free print sheet at exact paper and QR dimensions', async () => {
    const popupDocument = {
      write: vi.fn(),
      open: vi.fn(),
      close: vi.fn(),
    };
    vi.spyOn(window, 'open').mockReturnValue({ document: popupDocument });
    serialApi.createGenuinityQR.mockResolvedValue({
      data: {
        success: true,
        serials: Array.from({ length: 200 }, (_, index) => `BV_PRODUCT_${String(index).padStart(11, '0')}`),
      },
    });

    render(
      <BatchBarcodeGeneratorModal
        isOpen
        onClose={() => {}}
        initialProduct={{ id: 1, sku: 'BV-PRODUCT', name: 'Test product' }}
      />,
    );
    fireEvent.change(screen.getByLabelText('Unique codes per selected product'), { target: { value: '200' } });
    fireEvent.click(screen.getByRole('button', { name: /register unique codes and create pdf/i }));
    await waitFor(() => expect(popupDocument.close).toHaveBeenCalledOnce());

    const printHtml = popupDocument.write.mock.calls[popupDocument.write.mock.calls.length - 1][0];
    expect(printHtml).toContain('@page { size: 210mm 297mm; margin: 0; }');
    expect(printHtml).toContain('grid-template-columns: repeat(10, 19mm)');
    expect(printHtml).toContain('grid-template-rows: repeat(14, 19mm)');
    expect(printHtml).toMatch(/<main class="qr-sheet">\s*<img src="data:image\/svg\+xml/);
    expect((printHtml.match(/<main class="qr-sheet">/g) || []).length).toBe(2);
    expect((printHtml.match(/<img src="data:image\/svg\+xml/g) || []).length).toBe(200);
    const qrDataUrl = document.querySelector('img').getAttribute('src');
    const qrSvg = decodeURIComponent(qrDataUrl.slice(qrDataUrl.indexOf(',') + 1));
    expect(qrSvg).toContain('width="8192"');
    expect(qrSvg).toContain('shape-rendering="crispEdges"');
    expect(printHtml).not.toContain('Test product');
    expect(printHtml).not.toContain('qr-caption');
    expect(serialApi.createGenuinityQR).toHaveBeenCalledWith({
      productId: 1,
      count: 200,
      batchNumber: undefined,
      manufactureDate: undefined,
      expiryDate: undefined,
    });
  });
});
