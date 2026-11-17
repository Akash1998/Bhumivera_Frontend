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

  it('saves profile-specific rate and notes without sending or changing status', async () => {
    render(<PromoterProgramManagement />);

    fireEvent.change(await screen.findByLabelText('Contribution share %'), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText('Private admin notes'), {
      target: { value: 'Long-term nature storytelling partner' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => {
      expect(affiliate.updateAdminPartner).toHaveBeenCalledWith(17, {
        discountPercent: 12,
        commissionSharePercent: 30,
        referralCode: 'CREATOR17',
        adminNotes: 'Long-term nature storytelling partner',
      });
    });
    expect((await screen.findByRole('status')).textContent).toMatch(/profile settings saved/);
    expect(screen.getByText('approved', { selector: 'span' })).toBeTruthy();
  });
});