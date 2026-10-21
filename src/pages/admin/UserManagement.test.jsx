// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import UserManagement from './UserManagement';
import api from '../../services/api';

const mockShowToast = vi.hoisted(() => vi.fn());

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock('../../context/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

describe('UserManagement promotional email campaign', () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockImplementation(url => {
      if (url === '/admin/users/email-campaigns/recipients') {
        return Promise.resolve({ data: { recipientCount: 12 } });
      }
      return Promise.resolve({
        data: { users: [], summary: { total: 0, active: 0, disabled: 0 }, pagination: {} },
      });
    });
    api.post.mockResolvedValue({
      data: { message: 'Campaign sent to 12 opted-in customer(s).' },
    });
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  it('offers an all-opted-in audience, shows its count, and submits the campaign', async () => {
    render(<UserManagement />);

    fireEvent.click(screen.getByRole('button', { name: /email opted-in customers/i }));
    expect(await screen.findByText(/12 active, opted-in email recipient/i)).toBeTruthy();
    fireEvent.change(screen.getByPlaceholderText('Email subject'), { target: { value: 'Weekend offer' } });
    fireEvent.change(screen.getByPlaceholderText('Email message'), { target: { value: 'Use code WEEKEND' } });
    fireEvent.click(screen.getByRole('button', { name: 'Email all opted-in customers' }));

    await waitFor(() => expect(api.post).toHaveBeenCalledWith(
      '/admin/users/email-campaigns',
      { audience: 'all_opted_in', title: 'Weekend offer', message: 'Use code WEEKEND' },
      { notify: false },
    ));
    expect(window.confirm).toHaveBeenCalledWith(
      'Send this email campaign to all active customers who opted in to promotional email?',
    );
  });
});
