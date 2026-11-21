// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PromoterProgramManagement from './PromoterProgramManagement';
import { affiliate } from '../../services/api';

vi.mock('../../services/api', () => ({
  affiliate: {
    getAdminProgramConfig: vi.fn(),
    getAdminPartners: vi.fn(),
    getAdminCommissions: vi.fn(),
    updateAdminPartner: vi.fn(),
  },
}));

vi.mock('./PromoterAnalyticsDashboard', () => ({ default: () => null }));

describe('PromoterProgramManagement', () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    affiliate.getAdminProgramConfig.mockResolvedValue({
      data: { config: { default_customer_discount_percent: 10, default_commission_share_percent: 20 } },
    });
    affiliate.getAdminPartners.mockResolvedValue({
      data: {
        partners: [{
          id: 17,
          status: 'approved',
          user_name: 'Creator Name',
          user_email: 'creator@example.com',
          social_platform: 'Instagram',
          social_handle: '@creator',
          follower_count: 5000,
          discount_percent: 12,
          commission_share_percent: 20,
          referral_code: 'CREATOR17',
          admin_notes: 'Initial note',
        }],
      },
    });
    affiliate.getAdminCommissions.mockResolvedValue({ data: { commissions: [], payouts: [] } });
    affiliate.updateAdminPartner.mockResolvedValue({
      data: {
        partner: {
          id: 17,
          status: 'approved',
          commission_share_percent: 30,
          admin_notes: 'Long-term nature storytelling partner',
        },
      },
    });
  });

  it('saves creator promo discounts, usage limits, and notes without changing status', async () => {
    render(<PromoterProgramManagement />);

    fireEvent.click(await screen.findByRole('button', { name: 'Show details for Creator Name' }));
    fireEvent.change(await screen.findByLabelText('Customer promo discount %'), { target: { value: '18' } });
    fireEvent.change(await screen.findByLabelText('Contribution share %'), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText(/Total promo uses/), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText(/Uses per customer/), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Private admin notes'), {
      target: { value: 'Long-term nature storytelling partner' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => {
      expect(affiliate.updateAdminPartner).toHaveBeenCalledWith(17, {
        discountPercent: 18,
        commissionSharePercent: 30,
        referralCode: 'CREATOR17',
        promoUsageLimit: 25,
        promoPerUserLimit: 2,
        adminNotes: 'Long-term nature storytelling partner',
      });
    });
    expect((await screen.findByRole('status')).textContent).toMatch(/promo settings saved/);
    expect(screen.getByText('approved', { selector: 'span' })).toBeTruthy();
  });

  it('shows creators in 20-row pages instead of one long expanded list', async () => {
    const creators = Array.from({ length: 41 }, (_, index) => ({
      id: index + 1,
      status: 'approved',
      user_name: `Creator ${index + 1}`,
      user_email: `creator${index + 1}@example.com`,
      social_platform: 'Instagram',
      social_handle: `@creator${index + 1}`,
      follower_count: 5000,
      discount_percent: 12,
      commission_share_percent: 20,
      referral_code: `CREATOR${index + 1}`,
      admin_notes: '',
    }));
    affiliate.getAdminPartners.mockResolvedValue({ data: { partners: creators } });

    render(<PromoterProgramManagement />);

    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(20));
    const firstPageRows = screen.getAllByRole('article').map(row => row.textContent);
    expect(firstPageRows.some(text => text.includes('Creator 1 · Instagram'))).toBe(true);
    expect(firstPageRows.some(text => text.includes('Creator 21 · Instagram'))).toBe(false);

    fireEvent.click(screen.getAllByRole('button', { name: 'Next creator page' })[0]);

    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(20);
      expect(screen.getAllByRole('article').some(row => row.textContent.includes('Creator 21 · Instagram'))).toBe(true);
    });
    expect(screen.getAllByRole('article').some(row => row.textContent.includes('Creator 1 · Instagram'))).toBe(false);
  });
});