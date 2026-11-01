// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductVerification from './ProductVerification';
import api from '../services/api';

const scannerMock = vi.hoisted(() => ({
  callback: null,
  stop: vi.fn(),
}));

vi.mock('../utils/qrScanEngine', () => ({
  startCamera: vi.fn(() => Promise.resolve()),
  stopCamera: scannerMock.stop,
  getCameraCapabilities: () => ({ zoom: null, torch: false, focus: [] }),
  setZoom: vi.fn(),
  setTorch: vi.fn(),
  focusAt: vi.fn(),
  startScanLoop: (_video, { onResult }) => {
    scannerMock.callback = text => onResult(text);
    return () => {};
  },
}));
vi.mock('../components/SEO', () => ({ default: () => null }));
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 7 } }),
}));
vi.mock('../services/api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

const renderVerification = (entry = '/verify') => render(
  <MemoryRouter initialEntries={[entry]}>
    <Routes>
      <Route path="/verify" element={<ProductVerification />} />
    </Routes>
  </MemoryRouter>,
);

describe('product authenticity and box gift verification', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    scannerMock.callback = null;
  });

  it('shows only a certificate returned as verified by the batch registry', async () => {
    api.get.mockImplementation((path) => {
      if (path.startsWith('/serials/batch-coa/')) {
        return Promise.resolve({
          data: {
            success: true,
            verified: true,
            coa: {
              productName: 'Test Product',
              serial: 'BV-2601-UNIQUE',
              batchCode: 'BV-2601-BATCH',
              bottleSequence: 'Bottle 1 of 2',
              calibratedPh: '5.2',
              extractionTemp: '26°C',
              microbiologicalAssay: 'Passed',
              heavyMetals: 'Passed',
              tamperCustody: 'Intact',
              disclosedActives: 'Verified',
              originLot: 'Test lot',
              pressedDate: '2026-01-01',
              remainingInBatch: 2,
            },
          },
        });
      }
      return Promise.resolve({
        data: { success: true, product_name: 'Test Product', serial_number: 'BV-2601-UNIQUE' },
      });
    });

    renderVerification('/verify?serial=BV-2601-UNIQUE');

    await waitFor(() => expect(screen.getByText('Verified batch certificate of analysis')).toBeTruthy());
    expect(screen.getAllByText('Test Product')).toHaveLength(2);
    expect(screen.getByText('5.2')).toBeTruthy();
    expect(api.get).toHaveBeenCalledWith('/serials/batch-coa/BV-2601-UNIQUE');
  });

  it('does not present an unregistered serial as an authentic certificate', async () => {
    api.get.mockRejectedValue({
      response: { data: { message: 'Serial number not found in the registry.' } },
    });

    renderVerification('/verify?serial=BV-NOT-REGISTERED');

    await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy());
    expect(screen.getByText('Serial number not found in the registry.')).toBeTruthy();
    expect(screen.queryByText('Verified batch certificate of analysis')).toBeNull();
  });

  it('reads a box QR with the camera decoder and checks gift eligibility', async () => {
    api.get.mockResolvedValue({
      data: { valid: true, canRedeem: true, reward: { creditInr: 250, loyaltyPoints: 100 } },
    });
    renderVerification();

    fireEvent.click(screen.getByRole('button', { name: /open live camera qr scanner/i }));
    await waitFor(() => expect(scannerMock.callback).toBeTruthy());
    scannerMock.callback('https://bhumivera.com/verify?qr=BHUMIVERA-GIFT-2026');

    await waitFor(() => expect(api.get).toHaveBeenCalledWith(
      '/gamification/box-qr-status',
      { params: { qr: 'BHUMIVERA-GIFT-2026' } },
    ));
    expect(screen.getByText(/account is eligible/i)).toBeTruthy();
    expect(scannerMock.stop).toHaveBeenCalled();
  });

  it('automatically checks a gift code from a direct camera URL', async () => {
    api.get.mockResolvedValue({
      data: { valid: false, canRedeem: false, message: 'A delivered order is required.' },
    });
    renderVerification('/verify?qr=BHUMIVERA-GIFT-2026');

    await waitFor(() => expect(api.get).toHaveBeenCalledWith(
      '/gamification/box-qr-status',
      { params: { qr: 'BHUMIVERA-GIFT-2026' } },
    ));
    expect(screen.getByText('A delivered order is required.')).toBeTruthy();
  });
});
