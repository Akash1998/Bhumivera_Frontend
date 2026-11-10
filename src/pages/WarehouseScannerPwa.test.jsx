// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import WarehouseScannerPwa from './WarehouseScannerPwa';
import api from '../services/api';

const scannerMock = vi.hoisted(() => ({ onResult: null }));

vi.mock('../services/api', () => ({
  default: { post: vi.fn() },
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
        return Promise.resolve({ data: { queue: [] } });
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
    fireEvent.change(screen.getByLabelText('Staff ID'), { target: { value: 'sample' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Connect Scanner' }));

    await screen.findByText('Sample Staff');
    fireEvent.click(screen.getByRole('button', { name: 'Scan Product' }));
    await waitFor(() => expect(scannerMock.onResult).toBeTruthy());
    scannerMock.onResult('SKU-1');

    expect(await screen.findByText('Sample Product')).toBeTruthy();
    expect(api.post).toHaveBeenCalledWith(
      '/inventory-software/scanner/scan',
      expect.objectContaining({ qrCode: 'SKU-1', sessionCode: 'STAFF-SAMPLE' }),
      expect.objectContaining({ headers: { Authorization: 'Bearer staff-token' } }),
    );
  });
});
