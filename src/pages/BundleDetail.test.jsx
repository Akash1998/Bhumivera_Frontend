// @vitest-environment jsdom
import React from 'react';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BundleDetail from './BundleDetail';
import { products, reviews } from '../services/api';

const mockAddToCart = vi.fn();

vi.mock('../services/api', () => ({
  products: { getBySlug: vi.fn() },
  reviews: { getByCombo: vi.fn() },
}));

vi.mock('../context/CartContext', () => ({
  useCart: () => ({ addToCart: mockAddToCart }),
}));

function renderBundlePage() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/combo/bundle-daily-regimen']}>
        <Routes>
          <Route path="/combo/:slug" element={<BundleDetail />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('regimen bundle catalog resolution', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    reviews.getByCombo.mockResolvedValue({ data: { reviews: [], summary: { total: 0, average: 0 } } });
  });

  afterEach(cleanup);

  it('adds the real catalog combo product after resolving the bundle identifier', async () => {
    products.getBySlug.mockResolvedValue({
      data: {
        data: {
          id: 19,
          name: 'The Grand Maison 4-Piece Daily Apothecary',
          sku: 'BV-BND-DAILY-01',
          quantity: 182,
          status: 'active',
          discount_price: 1499,
        },
      },
    });

    renderBundlePage();
    const addButton = await screen.findByRole('button', { name: 'Add complete regimen to bag' });
    await act(async () => addButton.click());

    expect(products.getBySlug).toHaveBeenCalledWith('bundle-daily-regimen');
    expect(mockAddToCart).toHaveBeenCalledWith(
      expect.objectContaining({ id: 19, sku: 'BV-BND-DAILY-01', quantity: 182 }),
      1
    );
  });

  it('does not invent a purchasable product or stock when catalog resolution fails', async () => {
    products.getBySlug.mockRejectedValue({ response: { status: 404 } });

    renderBundlePage();

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain(
      'This regimen is currently unavailable. Please refresh and try again.'
    );
    await waitFor(() => expect(
      screen.getByRole('button', { name: 'Currently unavailable' }).disabled
    ).toBe(true));
    expect(mockAddToCart).not.toHaveBeenCalled();
  });
});
