// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import WarehouseScannerPwa from './WarehouseScannerPwa';
import api from '../services/api';

const scannerMock = vi.hoisted(() => ({ onResult: null }));

vi.mock('../services/api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

vi.mock('../utils/qrScanEngine', () => ({
  startCamera: vi.fn(() => Promise.resolve()),
  startScanLoop: (_video, { onResult }) => {
    scannerMock.onResult = onResult;
    return vi.fn();
  },
  stopCamera: vi.fn(),
}));

describe('warehouse scanner PWA', () => {
  beforeEach(() => {
    localStorage.clear();
    scannerMock.onResult = null;
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('signs staff in and sends camera scans to the POS queue', async () => {
    api.post.mockImplementation((path) => {
      if (path.endsWith('/scanner/auth/login')) {
        return Promise.resolve({
          data: {
            success: true,
            token: 'staff-token',
            sessionCode: 'STAFF-SAMPLE',
            staff: { username: 'sample', fullName: 'Sample Staff' },
          },
        });
      }
      if (path.endsWith('/scanner/connect')) {
        return Promise.resolve({ data: { success: true, connected: true, queue: [] } });
      }
      if (path.endsWith('/scanner/scan')) {
        return Promise.resolve({
          data: {
            message: 'Scanned sample product.',
            queue: [{ id: 1, product_name: 'Sample Product', sku: 'SKU-1', quantity: 1 }],
          },
        });
      }
      throw new Error(`Unexpected scanner request: ${path}`);
    });

    render(<WarehouseScannerPwa />);
    fireEvent.click(screen.getByRole('button', { name: /or sign in with a staff account/i }));
    fireEvent.change(screen.getByLabelText('Staff ID'), { target: { value: 'sample' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in and connect' }));

    await screen.findByText(/Live terminal connected/i);
    fireEvent.click(screen.getByRole('button', { name: 'Scan Product' }));
    await waitFor(() => expect(scannerMock.onResult).toBeTruthy());
    expect(document.querySelector('video').style.filter).toBe('none');
    expect(document.querySelector('video').style.backdropFilter).toBe('none');
    scannerMock.onResult('SKU-1');

    expect(await screen.findByText('Sample Product')).toBeTruthy();
    expect(api.post).toHaveBeenCalledWith(
      '/inventory-software/scanner/scan',
      expect.objectContaining({ qrCode: 'SKU-1', sessionCode: 'STAFF-SAMPLE' }),
      expect.objectContaining({ headers: { Authorization: 'Bearer staff-token' } }),
    );
  });

  it('pairs to the exact desktop terminal from its QR and connects with the scanner key', async () => {
    api.post.mockImplementation(path => {
      if (path.endsWith('/scanner/connect')) {
        return Promise.resolve({ data: { success: true, connected: true, queue: [] } });
      }
      if (path.endsWith('/scanner/scan')) {
        return Promise.resolve({
          data: { success: true, queue: [{ id: 2, product_name: 'Paired Product', sku: 'SKU-PAIR', quantity: 1 }] },
        });
      }
      throw new Error(`Unexpected scanner request: ${path}`);
    });

    render(<WarehouseScannerPwa />);
    fireEvent.click(screen.getByRole('button', { name: /scan terminal pairing qr/i }));
    await waitFor(() => expect(scannerMock.onResult).toBeTruthy());
    scannerMock.onResult(JSON.stringify({
      app: 'BHUMIVERA_ANDROID_QR_SCANNER',
      scannerApiKey: 'BV-SCAN-PAIRING-KEY',
      sessionCode: 'STAFF-DESKTOP-OPERATOR',
      operatorName: 'Desktop Operator',
    }));

    await screen.findByText('STAFF-DESKTOP-OPERATOR');
    await screen.findByText(/Live terminal connected/i);
    expect(api.post).toHaveBeenCalledWith(
      '/inventory-software/scanner/connect',
      expect.objectContaining({ sessionCode: 'STAFF-DESKTOP-OPERATOR' }),
      expect.objectContaining({ headers: { 'x-scanner-api-key': 'BV-SCAN-PAIRING-KEY' } }),
    );
    expect(localStorage.getItem('BV_SCANNER_PWA_STAFF')).toContain('STAFF-DESKTOP-OPERATOR');

    fireEvent.click(screen.getByRole('button', { name: 'Scan Product' }));
    await waitFor(() => expect(scannerMock.onResult).toBeTruthy());
    scannerMock.onResult('SKU-PAIR');
    expect(await screen.findByText('Paired Product')).toBeTruthy();
    expect(api.post).toHaveBeenCalledWith(
      '/inventory-software/scanner/scan',
      expect.objectContaining({ qrCode: 'SKU-PAIR', sessionCode: 'STAFF-DESKTOP-OPERATOR' }),
      expect.objectContaining({ headers: { 'x-scanner-api-key': 'BV-SCAN-PAIRING-KEY' } }),
    );
  });

  it('restores a paired terminal and supports pause and resume', async () => {
    localStorage.setItem('BV_SCANNER_PWA_STAFF', JSON.stringify({
      scannerApiKey: 'BV-SCAN-SAVED-KEY',
      sessionCode: 'STAFF-SAVED-TERMINAL',
      operatorName: 'Saved Operator',
    }));
    api.post.mockImplementation(path => {
      if (path.endsWith('/scanner/connect') || path.endsWith('/scanner/disconnect')) {
        return Promise.resolve({ data: { success: true, connected: true, queue: [] } });
      }
      throw new Error(`Unexpected scanner request: ${path}`);
    });

    render(<WarehouseScannerPwa />);
    await screen.findByText(/Live terminal connected/i);
    fireEvent.click(screen.getByRole('button', { name: /pause connection/i }));

    await screen.findByRole('button', { name: /connect \/ resume/i });
    expect(api.post).toHaveBeenCalledWith(
      '/inventory-software/scanner/disconnect',
      { sessionCode: 'STAFF-SAVED-TERMINAL' },
      expect.objectContaining({ headers: { 'x-scanner-api-key': 'BV-SCAN-SAVED-KEY' } }),
    );

    fireEvent.click(screen.getByRole('button', { name: /connect \/ resume/i }));
    await screen.findByText(/Live terminal connected/i);
    expect(api.post).toHaveBeenCalledTimes(3);
  });
});
