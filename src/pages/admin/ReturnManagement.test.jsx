// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ReturnManagement from './ReturnManagement';
import api from '../../services/api';

const { showToast } = vi.hoisted(() => ({ showToast: vi.fn() }));

vi.mock('../../services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}));

vi.mock('../../context/ToastContext', () => ({
  useToast: () => ({ showToast }),
}));

const returnRequest = {
  id: 4,
  order_id: 9,
  status: 'received',
  refund_type: 'refund',
  payment_mode: 'online',
  payment_status: 'paid',
  refund_amount: '5.00',
  reason: 'Damaged item',
  created_at: '2026-10-11T10:00:00.000Z',
  customer_name: 'Test Customer',
  items: [],
  image_urls: [],
};

describe('ReturnManagement provider refunds', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockImplementation(path => {
      if (path === '/returns/admin/all') return Promise.resolve({ data: [returnRequest] });
      if (path === '/shipping/labels') return Promise.resolve({ data: [] });
      throw new Error(`Unexpected API request: ${path}`);
    });
    api.post.mockResolvedValueOnce({
      status: 202,
      data: {
        data: {
          status: 'pending',
          returnStatus: 'refund_pending',
          amountPaise: 500,
          receipt: 'bvrma-4-1',
        },
      },
    }).mockResolvedValueOnce({
      status: 200,
      data: {
        data: {
          status: 'processed',
          returnStatus: 'refunded',
          amountPaise: 500,
          receipt: 'bvrma-4-1',
          providerRefundId: 'rfnd_123',
        },
      },
    });
    api.put.mockResolvedValue({ data: {} });
    vi.stubGlobal('confirm', vi.fn(() => true));
  });

  it('submits an explicit refund request and waits for Razorpay confirmation', async () => {
    render(<ReturnManagement />);
    fireEvent.click(await screen.findByRole('button', { name: /inspect/i }));

    const amountInput = screen.getByPlaceholderText('Admin-confirmed amount');
    fireEvent.change(amountInput, { target: { value: '5.00' } });
    fireEvent.click(screen.getByRole('button', { name: /issue razorpay refund/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/returns/admin/4/refund', {
        refund_amount: '5.00',
        admin_notes: '',
      });
    });
    expect(api.put).not.toHaveBeenCalledWith('/returns/admin/4', expect.objectContaining({ status: 'refunded' }));
    expect(await screen.findByText(/after provider confirmation/i)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /refresh refund status/i }));
    await waitFor(() => {
      expect(api.post).toHaveBeenLastCalledWith('/returns/admin/4/refund/reconcile');
    });
    expect((await screen.findAllByText('Refund Issued')).length).toBeGreaterThan(0);
  });

  it('does not offer Razorpay refunds for orders without a captured online payment', async () => {
    api.get.mockImplementation(path => {
      if (path === '/returns/admin/all') {
        return Promise.resolve({ data: [{ ...returnRequest, payment_mode: 'cod' }] });
      }
      if (path === '/shipping/labels') return Promise.resolve({ data: [] });
      throw new Error(`Unexpected API request: ${path}`);
    });
    render(<ReturnManagement />);
    fireEvent.click(await screen.findByRole('button', { name: /inspect/i }));

    expect(screen.queryByRole('button', { name: /issue razorpay refund/i })).toBeNull();
    expect(screen.getByText(/automated refunds require a captured online payment/i)).toBeTruthy();
  });
});
