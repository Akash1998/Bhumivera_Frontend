// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import WelcomeCardManagement from './WelcomeCardManagement';
import { welcomeGifts } from '../../services/api';

vi.mock('qrcode', () => ({
  default: { toDataURL: vi.fn(async () => 'data:image/png;base64,test') },
}));

vi.mock('../../services/api', () => ({
  welcomeGifts: {
    getCampaigns: vi.fn(),
    getCampaign: vi.fn(),
    deleteCards: vi.fn(),
  },
}));

vi.mock('../../context/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

const campaign = {
  id: 5,
  label: 'Campaign A',
  total_value: 200,
  per_order_value: 100,
  min_order_amount: 999,
  cards: [
    { id: 10, code: 'WC-UNCLAIMED1', status: 'unclaimed' },
    { id: 11, code: 'WC-CLAIMED001', status: 'claimed', claimed_by_name: 'Customer' },
    { id: 12, code: 'WC-UNCLAIMED2', status: 'unclaimed' },
  ],
};
const campaignSummary = {
  id: campaign.id,
  label: campaign.label,
  total_value: campaign.total_value,
  per_order_value: campaign.per_order_value,
  min_order_amount: campaign.min_order_amount,
  card_count: campaign.cards.length,
  claimed_count: 1,
};

describe('WelcomeCardManagement bulk actions', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('selects, prints, and deletes selected unclaimed cards in bulk', async () => {
    welcomeGifts.getCampaigns.mockResolvedValue({ data: { campaigns: [campaignSummary] } });
    welcomeGifts.getCampaign.mockResolvedValue({ data: { campaign } });
    welcomeGifts.deleteCards.mockResolvedValue({ data: { count: 2 } });
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const printDocument = { write: vi.fn(), open: vi.fn(), close: vi.fn() };
    vi.spyOn(window, 'open').mockReturnValue({
      document: printDocument,
      focus: vi.fn(),
      print: vi.fn(),
    });

    render(<WelcomeCardManagement />);
    fireEvent.click(await screen.findByRole('button', { name: 'Manage' }));

    fireEvent.click(await screen.findByRole('checkbox', { name: 'Select all unclaimed cards' }));

    expect(screen.getByRole('checkbox', { name: 'Select card WC-UNCLAIMED1' }).checked).toBe(true);
    expect(screen.getByRole('checkbox', { name: 'Select card WC-UNCLAIMED2' }).checked).toBe(true);
    expect(screen.getByRole('checkbox', { name: 'Select card WC-CLAIMED001' }).disabled).toBe(true);
    expect(screen.getByRole('button', { name: 'Print selected (2)' }).disabled).toBe(false);

    fireEvent.click(screen.getByRole('button', { name: 'Print selected (2)' }));
    await waitFor(() => {
      expect(printDocument.write).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Delete selected (2)' }));

    await waitFor(() => {
      expect(welcomeGifts.deleteCards).toHaveBeenCalledWith(5, [10, 12]);
    });
  });
});
