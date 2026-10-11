// @vitest-environment jsdom
import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AffiliateManagement from './AffiliateManagement';
import { affiliate } from '../../services/api';

vi.mock('../../services/api', () => ({
  affiliate: {
    getAllPartners: vi.fn(),
    getAllWithdrawals: vi.fn(),
    getConfig: vi.fn(),
    updatePartnerStatus: vi.fn(),
    approveWithdrawal: vi.fn(),
    updateConfig: vi.fn(),
  },
}));

describe('AffiliateManagement unavailable state', () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    const unavailable = Promise.reject({ response: { status: 501 } });
    affiliate.getAllPartners.mockReturnValue(unavailable);
    affiliate.getAllWithdrawals.mockReturnValue(unavailable);
    affiliate.getConfig.mockReturnValue(unavailable);
  });

  it('clearly reports unimplemented workflows instead of presenting fake data or actions', async () => {
    render(<AffiliateManagement />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Affiliate network unavailable' })).toBeTruthy();
    });

    expect(screen.getByText(/not available yet because these workflows are not persisted/i)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Save config' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Approve' })).toBeNull();
  });
});
