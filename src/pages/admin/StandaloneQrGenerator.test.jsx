// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import StandaloneQrGenerator from './StandaloneQrGenerator';
import { computeStandaloneA4QrLayout, getStandaloneQrPageCount } from '../../utils/standaloneQrUtils';

vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn(async code => `data:image/png;base64,${code}`),
  },
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('standalone authenticity QR generator', () => {
  it('fits up to 30 QRs on A4 at the 38 mm size cap and paginates larger sets', () => {
    const layout = computeStandaloneA4QrLayout(30);

    expect(layout.count).toBe(30);
    expect(layout.cols * layout.rows).toBeGreaterThanOrEqual(30);
    expect(layout.qrSizeMm).toBe(38);
    expect(getStandaloneQrPageCount(30)).toBe(1);
    expect(getStandaloneQrPageCount(31)).toBe(2);
  });

  it('generates standalone codes without requiring product or batch details', async () => {
    render(<StandaloneQrGenerator />);

    fireEvent.change(screen.getByLabelText(/number of qr codes/i), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /generate qr codes/i }));

    await waitFor(() => expect(screen.getByText('2 codes ready')).toBeTruthy());
    const codes = [...screen.getByRole('table').querySelectorAll('tbody td:first-child')].map(node => node.textContent);

    expect(codes).toHaveLength(2);
    expect(new Set(codes).size).toBe(2);
  });
});
