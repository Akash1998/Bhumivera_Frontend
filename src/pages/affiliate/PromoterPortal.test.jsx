// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { affiliate } from '../../services/api';
import PromoterPortal from './PromoterPortal';

vi.mock('../../services/api', () => ({
  affiliate: {
    getPartnerDashboard: vi.fn(),
  },
}));

describe('creator partnership dashboard', () => {
  afterEach(cleanup);

  it('shows only the collected impact total returned for the creator’s referrals', async () => {
    affiliate.getPartnerDashboard.mockResolvedValue({
      data: {
        dashboard: {
          partner: {
            status: 'approved',
            social_platform: 'Instagram',
            social_handle: '@creator',
            discount_percent: 10,
            commission_share_percent: 20,
            referral_code: 'BVCREATOR1',
          },
          summary: {
            attributed_orders: 2,
            delivered_orders: 2,
            funded_impact_contributions: 1,
            impact_amount: '250.00',
            pending_commission: 0,
            payable_commission: 0,
          },
          milestones: [],
          commissions: [{
            id: 8,
            order_id: 902,
            order_subtotal: 1200,
            discount_amount: 120,
            revenue_ex_tax: 915.25,
            product_cost: 222,
            fulfillment_cost: 110,
            rto_reserve: 40,
            payment_fee: 21.6,
            contribution_profit: 493.65,
            commission_share_percent: 20,
            commission_amount: 98.73,
            retained_profit: 394.92,
            retained_margin_percent: 43.15,
            status: 'pending',
          }],
          programConfig: {},
        },
      },
    });

    render(<MemoryRouter><PromoterPortal /></MemoryRouter>);

    expect(await screen.findByText('Impact contributions from your referred orders')).toBeTruthy();
    expect(screen.getByText('₹250.00')).toBeTruthy();
    expect(screen.getByText('1 collected contribution')).toBeTruthy();
    expect(screen.getByText(/not a fixed percentage of every order/)).toBeTruthy();
    expect(screen.queryByText(/₹300/)).toBeNull();
    expect(screen.getByText('Your order economics, without guesswork')).toBeTruthy();
    expect(screen.getByText('Open order ledger')).toBeTruthy();
    expect(screen.getByText('View breakdown')).toBeTruthy();
    expect(screen.getByText('Bhumivera retained contribution*')).toBeTruthy();
    expect(screen.getByText('Order #902 · calculation record')).toBeTruthy();
    expect(screen.getByText('−₹222.00')).toBeTruthy();
    expect(screen.getAllByText('Paid UGC & trial reimbursement').length).toBe(2);
    expect(screen.getByText(/Coming soon · not accepting submissions/)).toBeTruthy();
  });

  it('keeps only the current long-term partnership track selectable for new applications', async () => {
    affiliate.getPartnerDashboard.mockResolvedValue({
      data: { dashboard: null },
    });

    render(<MemoryRouter><PromoterPortal /></MemoryRouter>);

    const trackSelect = await screen.findByLabelText('Preferred collaboration track');
    expect(trackSelect.value).toBe('both');
    expect(screen.getByRole('option', { name: /Paid collaboration — Coming soon/ }).disabled).toBe(true);
  });

  it('lets a rejected applicant revise and resubmit their partnership intent', async () => {
    affiliate.getPartnerDashboard.mockResolvedValue({
      data: {
        dashboard: {
          partner: {
            status: 'rejected',
            social_platform: 'Instagram',
            social_handle: '@creator',
            profile_url: 'https://instagram.com/creator',
            follower_count: 1000,
            follower_tier: '1k_10k',
            content_niche: 'Skincare',
            partnership_intent: 'I want to create honest, useful skincare education with my community over time.',
          },
          summary: {},
        },
      },
    });

    render(<MemoryRouter><PromoterPortal /></MemoryRouter>);

    fireEvent.click(await screen.findByRole('button', { name: 'Update and resubmit' }));
    expect(screen.getByLabelText(/What would a meaningful, long-term partnership look like to you/).value)
      .toBe('I want to create honest, useful skincare education with my community over time.');
  });

  it('paginates the complete creator order ledger', async () => {
    const partner = {
      status: 'approved',
      social_platform: 'Instagram',
      social_handle: '@creator',
      discount_percent: 10,
      commission_share_percent: 20,
      referral_code: 'BVCREATOR1',
    };
    affiliate.getPartnerDashboard
      .mockResolvedValueOnce({
        data: {
          dashboard: {
            partner,
            summary: {},
            commissions: [],
            commissionPagination: { page: 1, pageSize: 20, total: 21, pages: 2 },
            programConfig: {},
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          dashboard: {
            partner,
            summary: {},
            commissions: [],
            commissionPagination: { page: 2, pageSize: 20, total: 21, pages: 2 },
            programConfig: {},
          },
        },
      });

    render(<MemoryRouter><PromoterPortal /></MemoryRouter>);

    expect(await screen.findByText('Showing 1–20 of 21 attributed orders')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(await screen.findByText('Page 2 of 2')).toBeTruthy();
    expect(affiliate.getPartnerDashboard).toHaveBeenLastCalledWith({ commissionPage: 2 });
  });
});
