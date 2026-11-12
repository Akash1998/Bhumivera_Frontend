// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ScannerPwa from './ScannerPwa';
import api from '../services/api';

const scannerMock = vi.hoisted(() => ({ onResult: null, scanLoops: 0 }));

vi.mock('../services/api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

vi.mock('../utils/qrScanEngine', () => ({
  startCamera: vi.fn(() => Promise.resolve()),
  startScanLoop: (_video, { onResult }) => {
    scannerMock.onResult = onResult;
    scannerMock.scanLoops += 1;
    return vi.fn();
  },
  stopCamera: vi.fn(),
}));

const orderPayload = {
  v: 2,
  i: 99,
  n: 'ORD-99',
  s: 'confirmed',
  c: 'Sample Customer',
  x: [
    [901, 'Charcoal Face Wash', 'SKU-1', 'BAR-1', 1],
    [902, 'Aloe Vera Soap', 'SKU-2', 'BAR-2', 1],
  ],
};
const fulfillmentQr = `BV-PWA2:${btoa(unescape(encodeURIComponent(JSON.stringify([
  orderPayload.v,
  orderPayload.i,
  orderPayload.n,
  orderPayload.s,
  orderPayload.c,
  orderPayload.x,
]))))
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')}`;
const legacyFulfillmentQr = `BV-PWA1:${btoa(unescape(encodeURIComponent(JSON.stringify({
  v: 1,
  i: 100,
  n: 'ORD-100',
  s: 'confirmed',
  x: [{ i: 903, n: 'Test Soap', k: 'SKU-3', b: 'BAR-3', q: 1 }],
}))))
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')}`;

const prepareApi = () => {
  api.get.mockResolvedValue({ data: {} });
  api.post.mockImplementation(path => {
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
    if (path.endsWith('/fulfillment/pwa-batch')) {
      return Promise.resolve({ data: { success: true, count: 1, uploadedUnits: 2, message: 'Uploaded packed order.' } });
    }
    return Promise.resolve({ data: { success: true } });
  });
};

const signInAndStartWork = async () => {
  fireEvent.change(screen.getByLabelText('Staff ID'), { target: { value: 'sample' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
  fireEvent.click(screen.getByRole('button', { name: /Sign in/ }));
  await screen.findByRole('button', { name: /Go to Work/ });
  fireEvent.click(screen.getByRole('button', { name: /Go to Work/ }));
  await screen.findByText('Live shift');
};

describe('fulfillment scanner PWA', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    scannerMock.onResult = null;
    scannerMock.scanLoops = 0;
    prepareApi();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('requires the exact ordered item codes and uploads a fully packed order', async () => {
    render(<ScannerPwa />);
    await signInAndStartWork();

    fireEvent.click(screen.getByRole('button', { name: 'Scan Order Bill QR' }));
    await waitFor(() => expect(scannerMock.onResult).toBeTruthy());
    scannerMock.onResult(fulfillmentQr);
    await screen.findByText(/Order #ORD-99 loaded from printed manifest/i);
    expect(api.get).toHaveBeenCalledWith(
      '/inventory-software/orders/99/manifest',
      expect.objectContaining({ headers: { Authorization: 'Bearer staff-token' } }),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Scan Charcoal Face Wash' }));
    await waitFor(() => expect(scannerMock.onResult).toBeTruthy());
    const firstLoop = scannerMock.scanLoops;
    scannerMock.onResult('SKU-2');
    await screen.findByText(/Wrong product/i);
    await waitFor(() => expect(scannerMock.scanLoops).toBeGreaterThan(firstLoop));
    scannerMock.onResult('SKU-1');
    await screen.findByText(/Charcoal Face Wash: 1\/1 scanned\. Saved on this phone\./);
    expect(api.post).toHaveBeenCalledWith(
      '/inventory-software/fulfillment/pwa-scan',
      expect.objectContaining({
        orderId: 99,
        orderItemId: 901,
        scannedCode: 'SKU-1',
        scanId: expect.any(String),
      }),
      expect.objectContaining({ headers: { Authorization: 'Bearer staff-token' } }),
    );
    expect(localStorage.getItem('BV_SCANNER_ACTIVE_ORDER_sample')).toContain('"SKU-1"');

    fireEvent.click(screen.getByRole('button', { name: 'Scan Aloe Vera Soap' }));
    await waitFor(() => expect(scannerMock.onResult).toBeTruthy());
    scannerMock.onResult('BAR-2');
    await screen.findByText(/Aloe Vera Soap: 1\/1 scanned\. Saved on this phone\./);

    fireEvent.click(screen.getByRole('button', { name: 'Confirm Packed' }));
    fireEvent.click(await screen.findByRole('button', { name: /Upload Now/ }));
    await screen.findByText('Uploaded packed order.');
    expect(api.post).toHaveBeenCalledWith(
      '/inventory-software/fulfillment/pwa-batch',
      expect.objectContaining({
        sessionCode: 'STAFF-SAMPLE',
        packedOrders: [
          expect.objectContaining({
            orderId: 99,
            verifiedItems: [
              expect.objectContaining({ orderItemId: 901, scannedCodes: ['SKU-1'] }),
              expect.objectContaining({ orderItemId: 902, scannedCodes: ['BAR-2'] }),
            ],
          }),
        ],
      }),
      expect.objectContaining({ headers: { Authorization: 'Bearer staff-token' } }),
    );
  });

  it('loads an order manifest by order ID from Inventory Software', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        success: true,
        order: {
          id: 99,
          orderNumber: 'ORD-99',
          status: 'confirmed',
          customerName: 'Sample Customer',
          items: [
            { orderItemId: 901, name: 'Charcoal Face Wash', sku: 'SKU-1', quantity: 1 },
            { orderItemId: 902, name: 'Aloe Vera Soap', sku: 'SKU-2', quantity: 1 },
          ],
        },
      },
    });

    render(<ScannerPwa />);
    await signInAndStartWork();
    fireEvent.change(screen.getByPlaceholderText('Order number'), { target: { value: '99' } });
    fireEvent.click(screen.getByRole('button', { name: 'Load' }));

    await screen.findByText(/Order #ORD-99 loaded/i);
    expect(api.get).toHaveBeenCalledWith(
      '/inventory-software/orders/99/manifest',
      expect.objectContaining({ headers: { Authorization: expect.any(String) } }),
    );
    expect(screen.getByText('Charcoal Face Wash')).toBeTruthy();
    expect(screen.getByText('Aloe Vera Soap')).toBeTruthy();
  });

  it('continues to read previously printed fulfillment QR codes', async () => {
    render(<ScannerPwa />);
    await signInAndStartWork();

    fireEvent.click(screen.getByRole('button', { name: 'Scan Order Bill QR' }));
    await waitFor(() => expect(scannerMock.onResult).toBeTruthy());
    scannerMock.onResult(legacyFulfillmentQr);

    await screen.findByText(/Order #ORD-100 loaded from printed manifest/i);
    expect(screen.getByText('Test Soap')).toBeTruthy();
    expect(api.get).toHaveBeenCalledWith(
      '/inventory-software/orders/100/manifest',
      expect.objectContaining({ headers: { Authorization: 'Bearer staff-token' } }),
    );
  });

  it('restores active packing progress from local storage after a page reload', async () => {
    render(<ScannerPwa />);
    await signInAndStartWork();
    fireEvent.click(screen.getByRole('button', { name: 'Scan Order Bill QR' }));
    await waitFor(() => expect(scannerMock.onResult).toBeTruthy());
    scannerMock.onResult(fulfillmentQr);
    await screen.findByText(/Order #ORD-99 loaded from printed manifest/i);

    fireEvent.click(screen.getByRole('button', { name: 'Scan Charcoal Face Wash' }));
    await waitFor(() => expect(scannerMock.onResult).toBeTruthy());
    scannerMock.onResult('SKU-1');
    await screen.findByText(/Charcoal Face Wash: 1\/1 scanned\. Saved on this phone\./);
    cleanup();

    render(<ScannerPwa />);
    fireEvent.click(await screen.findByRole('button', { name: /Go to Work/ }));
    await screen.findByText('Charcoal Face Wash');
    expect(screen.getByText(/Qty 1\/1/)).toBeTruthy();
  });

  it('saves completed orders locally and uploads them from the bulk queue later', async () => {
    render(<ScannerPwa />);
    await signInAndStartWork();
    fireEvent.click(screen.getByRole('button', { name: 'Scan Order Bill QR' }));
    await waitFor(() => expect(scannerMock.onResult).toBeTruthy());
    scannerMock.onResult(fulfillmentQr);
    await screen.findByText(/Order #ORD-99 loaded/i);

    fireEvent.click(screen.getByRole('button', { name: 'Scan Charcoal Face Wash' }));
    await waitFor(() => expect(scannerMock.onResult).toBeTruthy());
    scannerMock.onResult('SKU-1');
    await screen.findByText(/Charcoal Face Wash: 1\/1 scanned\. Saved on this phone\./);
    fireEvent.click(screen.getByRole('button', { name: 'Scan Aloe Vera Soap' }));
    await waitFor(() => expect(scannerMock.onResult).toBeTruthy());
    scannerMock.onResult('SKU-2');
    await screen.findByText(/Aloe Vera Soap: 1\/1 scanned\. Saved on this phone\./);

    fireEvent.click(screen.getByRole('button', { name: 'Confirm Packed' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Save Bulk on This Device' }));
    await screen.findByText(/Packed order saved on this device/i);
    expect(localStorage.getItem('BV_SCANNER_PWA_PACKED_BATCH_sample')).toContain('"orderId":99');
    expect(api.post).not.toHaveBeenCalledWith('/inventory-software/fulfillment/pwa-batch', expect.anything(), expect.anything());

    fireEvent.click(screen.getByRole('button', { name: /Upload/ }));
    await screen.findByText('Uploaded packed order.');
    expect(localStorage.getItem('BV_SCANNER_PWA_PACKED_BATCH_sample')).toBe('[]');
  });
});
