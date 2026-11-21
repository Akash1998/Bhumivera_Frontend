// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import StandaloneQrGenerator from './StandaloneQrGenerator';
import { calculateQrSheetLayout, PAPER_FORMATS } from '../../utils/standaloneQrUtils';

vi.mock('qrcode', () => ({
  default: {
    create: vi.fn(() => ({
      modules: { size: 2, data: new Uint8Array([1, 0, 0, 1]) },
    })),
  },
}));

vi.mock('jspdf', () => ({
  jsPDF: class {
    constructor(options) {
      window.__lastPdfOptions = options;
      this.rect = vi.fn();
      this.setFillColor = vi.fn();
      this.text = vi.fn();
      this.save = vi.fn();
      window.__lastPdfDocument = this;
    }
  },
}));

afterEach(() => {
  cleanup();
  delete window.__lastPdfOptions;
  delete window.__lastPdfDocument;
  vi.restoreAllMocks();
});

describe('standalone QR sheet generator', () => {
  it('fills A4 and A3 using 18 by 16 mm cells and recalculates for custom paper length', () => {
    const a4Layout = calculateQrSheetLayout(PAPER_FORMATS.A4.widthMm, PAPER_FORMATS.A4.heightMm);
    const a3Layout = calculateQrSheetLayout(PAPER_FORMATS.A3.widthMm, PAPER_FORMATS.A3.heightMm);
    const customLayout = calculateQrSheetLayout(PAPER_FORMATS.A4.widthMm, 304);

    expect(a4Layout).toMatchObject({ columns: 11, rows: 18, qrCount: 198 });
    expect(a3Layout).toMatchObject({ columns: 16, rows: 26, qrCount: 416 });
    expect(customLayout).toMatchObject({ heightMm: 304, rows: 19, qrCount: 209 });
  });

  it('creates a text-free full-page PDF and keeps generated IDs available for manual linking', async () => {
    render(<StandaloneQrGenerator />);

    fireEvent.change(screen.getByLabelText(/page length/i), { target: { value: '16' } });
    fireEvent.click(screen.getByRole('button', { name: /generate full sheet hq pdf/i }));

    await waitFor(() => expect(screen.getByText('11 codes generated')).toBeTruthy());
    expect(window.__lastPdfOptions.format).toEqual([210, 16]);
    expect(window.__lastPdfDocument.rect).toHaveBeenCalledTimes(22);
    expect(window.__lastPdfDocument.text).not.toHaveBeenCalled();
    expect(screen.getAllByText(/^BV-QR-[A-F0-9]{32}$/)).toHaveLength(11);
  });
});
