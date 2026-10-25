// @vitest-environment jsdom
import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductVerification from './ProductVerification';
import { serials } from '../services/api';

vi.mock('../components/SEO', () => ({ default: () => null }));
vi.mock('../services/api', () => ({
  serials: { verify: vi.fn() },
}));

describe('product authenticity verification', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('shows recorded expiry and only the public batch information returned by the registry', async () => {
    serials.verify.mockResolvedValue({
      data: {
        verified: true,
        expired: false,
        serialNumber: 'BV-2601-UNIQUE',
        productName: 'Test Product',
        batchNumber: 'BV-2601-BATCH',
        manufactureDate: '2026-01-01',
        expiryDate: '2027-01-01',
        batchQuantity: 2,
        details: [{ label: 'Calibrated pH', value: '5.2' }],
      },
    });

    render(
      <MemoryRouter initialEntries={['/verify?serial=BV-2601-UNIQUE']}>
        <Routes>
          <Route path="/verify" element={<ProductVerification />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByText('Official batch record matched')).toBeTruthy());
    expect(screen.getByText('Test Product')).toBeTruthy();
    expect(screen.getByText('BV-2601-UNIQUE')).toBeTruthy();
    expect(screen.getByText('Calibrated pH')).toBeTruthy();
    expect(screen.getByText('5.2')).toBeTruthy();
    expect(serials.verify).toHaveBeenCalledWith('BV-2601-UNIQUE');
  });

  it('does not claim a code is authentic when the registry lookup fails', async () => {
    serials.verify.mockRejectedValue({
      response: { data: { message: 'This code is not in the Bhumivera batch registry.' } },
    });

    render(
      <MemoryRouter initialEntries={['/verify?serial=BV-NOT-REGISTERED']}>
        <Routes>
          <Route path="/verify" element={<ProductVerification />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy());
    expect(screen.getByText('This code is not in the Bhumivera batch registry.')).toBeTruthy();
    expect(screen.queryByText('Official batch record matched')).toBeNull();
  });
});
