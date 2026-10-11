// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import OrderManagement from './OrderManagement';
import api from '../../services/api';

const { showToast } = vi.hoisted(() => ({ showToast: vi.fn() }));

vi.mock('../../services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}));

vi.mock('../../context/ToastContext', () => ({
  useToast: () => ({ showToast }),
}));

const onlineOrders = [
  {
    id: 12,
    payment_mode: 'online',
    payment_status: 'paid',
    payment_id: 'pay_12',
    total: '19.99',
    status: 'confirmed',
    created_at: '2026-10-11T10:00:00.000Z',
    user_name: 'Sam',
  },
  {
    id: 13,
    payment_mode: 'online',
    payment_status: 'pending',
    payment_id: null,
    total: '9.99',
    status: 'pending',
    created_at: '2026-10-11T11:00:00.000Z',
    user_name: 'Alex',
  },
];

describe('OrderManagement payment reconciliation', () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockImplementation((path) => {
      if (path === '/orders/all') {
        return Promise.resolve({
          data: {
            orders: onlineOrders,
            pagination: { page: 1, limit: 25, total: 2, totalPages: 1 },
            summary: {},
          },
        });
      }
      if (path === '/shipping/labels') return Promise.resolve({ data: [] });
      if (path === '/orders/admin/reconciliation/payments') {
        return Promise.resolve({
          data: {
            rows: [
              { orderId: 12, localStatus: 'paid', providerStatus: 'captured', outcome: 'matched' },
              { orderId: 13, localStatus: 'pending', outcome: 'missing_payment_id' },
            ],
          },
        });
      }
      throw new Error(`Unexpected API request: ${path}`);
    });
  });

  it('checks online orders including ones missing a provider payment ID and reports read-only results', async () => {
    render(<OrderManagement />);

    fireEvent.click(await screen.findByRole('button', { name: /check online orders/i }));
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/orders/admin/reconciliation/payments', {
        params: { order_ids: '12,13' },
      });
    });

    expect(await screen.findByRole('region', { name: /payment reconciliation results/i })).toBeTruthy();
    expect(screen.getByText('matched')).toBeTruthy();
    expect(screen.getByText('missing payment id')).toBeTruthy();
    expect(screen.getByText(/never changes order or payment records/i)).toBeTruthy();
    expect(api.put).not.toHaveBeenCalled();
    expect(api.post).not.toHaveBeenCalled();
  });
});
