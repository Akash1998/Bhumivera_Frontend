// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SupportManagement from './SupportManagement';
import { returns, support } from '../../services/api';

vi.mock('../../services/api', () => ({
  returns: { getAllAdmin: vi.fn() },
  support: {
    getAllAdmin: vi.fn(),
    updateStatus: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../context/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

describe('SupportManagement unified customer queue', () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    support.getAllAdmin.mockResolvedValue({
      data: { data: [{ id: 1, name: 'Sam', email: 'sam@example.com', subject: 'Product question', message: 'Need help', status: 'open', messages: [] }] },
    });
    returns.getAllAdmin.mockResolvedValue({
      data: [{ id: 1, customer_name: 'Alex', user_email: 'alex@example.com', order_id: 22, reason: 'Damaged item', description: 'Box arrived damaged', status: 'pending_admin_review' }],
    });
  });

  it('shows contact tickets and returns together without ID collisions', async () => {
    render(<MemoryRouter><SupportManagement /></MemoryRouter>);

    expect(await screen.findByText('All requests')).toBeTruthy();
    expect(screen.getAllByText('2')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: /return request · damaged item/i }));

    expect(screen.getByText(/return request #1 · order #22/i)).toBeTruthy();
    expect(screen.getAllByText('Box arrived damaged')).toHaveLength(2);
    expect(screen.getByRole('button', { name: /manage return/i })).toBeTruthy();
  });
});
