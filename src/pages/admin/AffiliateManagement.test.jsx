// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AffiliateManagement from './AffiliateManagement';
import { affiliate } from '../../services/api';
import { ToastProvider } from '../../context/ToastContext';

vi.mock('../../services/api', () => ({
  affiliate: {
    getAdminConfig: vi.fn(),
    getAdminReferrals: vi.fn(),
    decideAdminReferral: vi.fn(),
    updateAdminConfig: vi.fn(),
  },
}));

describe('AffiliateManagement referral engine', () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    affiliate.getAdminConfig.mockResolvedValue({
      data: { config: { enabled: 1, reward_mode: 'wallet', wallet_reward_amount: 1000 } },
    });
    affiliate.getAdminReferrals.mockResolvedValue({
      data: {
        referrals: [{
          claim_id: 12,
          status: 'pending',
          referrer_name: 'Akash Prasad',
          referrer_email: 'akash@example.com',
          referred_name: 'Sonali Banerjee',
          referred_email: 'sonali@example.com',
          verified_at: '2026-10-11T17:32:43.000Z',
          auto_approve_at: '2026-10-11T18:32:43.000Z',
        }],
      },
    });
    affiliate.decideAdminReferral.mockResolvedValue({ data: { success: true } });
    affiliate.updateAdminConfig.mockResolvedValue({
      data: { config: { enabled: 1, reward_mode: 'wallet', wallet_reward_amount: 250 } },
    });
  });

  it('shows verified referral claims and issues the reward when approved', async () => {
    render(<ToastProvider><AffiliateManagement /></ToastProvider>);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Referral engine' })).toBeTruthy();
    });

    expect(await screen.findByText('Sonali Banerjee')).toBeTruthy();
    expect(screen.getByText('akash@example.com')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Approve reward' }));

    await waitFor(() => {
      expect(affiliate.decideAdminReferral).toHaveBeenCalledWith(12, {
        decision: 'approved',
        reason: null,
      });
    });
  });

  it('saves changed referral reward settings and keeps the saved values', async () => {
    render(<ToastProvider><AffiliateManagement /></ToastProvider>);

    const rewardInput = await screen.findByLabelText('Spendable wallet reward per approved referral (₹)');
    fireEvent.change(rewardInput, { target: { value: '250' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save referral rewards' }));

    await waitFor(() => {
      expect(affiliate.updateAdminConfig).toHaveBeenCalledWith(expect.objectContaining({
        reward_mode: 'wallet',
        wallet_reward_amount: 250,
        wallet_reward_per_order_limit: 100,
      }));
    });
    expect(screen.getByLabelText('Spendable wallet reward per approved referral (₹)').value).toBe('250');
  });
});
