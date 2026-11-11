// @vitest-environment jsdom
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import LifecycleOffers from './LifecycleOffers';

const apiMocks = vi.hoisted(() => ({
  settingsGet: vi.fn(),
  productsGetAllAdmin: vi.fn(),
  couponsGetAllAdmin: vi.fn(),
  settingsUpdate: vi.fn(),
  showToast: vi.fn(),
}));

vi.mock('../../services/api', () => ({
  settings: { get: apiMocks.settingsGet, update: apiMocks.settingsUpdate },
  products: { getAllAdmin: apiMocks.productsGetAllAdmin },
  coupons: { getAllAdmin: apiMocks.couponsGetAllAdmin },
}));

vi.mock('../../context/ToastContext', () => ({
  useToast: () => ({ showToast: apiMocks.showToast }),
}));

describe('LifecycleOffers', () => {
  afterEach(cleanup);

  beforeEach(() => {
    apiMocks.settingsGet.mockResolvedValue({ data: { lifecycle: {} } });
    apiMocks.productsGetAllAdmin.mockResolvedValue({ data: { products: [] } });
    apiMocks.couponsGetAllAdmin.mockResolvedValue({ data: { data: [] } });
  });

  it('leaves lifecycle intervals blank when no values are configured', async () => {
    render(<LifecycleOffers />);

    const inactiveDays = await screen.findByLabelText('Inactive days');
    expect(inactiveDays.value).toBe('');
    expect(screen.getByLabelText('Churn window (days)').value).toBe('');
  });
});
