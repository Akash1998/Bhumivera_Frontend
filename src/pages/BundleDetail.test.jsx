// @vitest-environment jsdom
import React from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BundleDetail from './BundleDetail';
import { products, reviews } from '../services/api';

const mockAddToCart = vi.fn();

vi.mock('../services/api', () => ({
  products: { getBySlug: vi.fn(), getAllActive: vi.fn() },
  reviews: { getByCombo: vi.fn() },
}));

vi.mock('../context/CartContext', () => ({
  useCart: () => ({ addToCart: mockAddToCart }),
}));

function renderBundlePage(slug = 'admin-created-combo') {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[`/combo/${slug}`]}>
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
    products.getAllActive.mockResolvedValue({
      data: {
        data: [
          {
            id: 8,
            slug: 'admin-selected-product',
            name: 'Current Product Name',
            price: 100,
            discount_price: 80,
            status: 'active',
          },
        ],
      },
    });
  });

  afterEach(cleanup);

  it('renders the current admin combo and adds its real catalog product', async () => {
    products.getBySlug.mockResolvedValue({
      data: {
        data: {
          id: 19,
          name: 'Admin-created combo',
          slug: 'admin-created-combo',
          sku: 'CUSTOM-COMBO-01',
          description: 'Current combo description',
          quantity: 12,
          status: 'active',
          price: 300,
          discount_price: 250,
          specifications: {
            is_combo: true,
            product_type: 'combo',
            combo_items: [
              { product_id: 8, slug: 'admin-selected-product', name: 'Old name', quantity: 2 },
            ],
          },
        },
      },
    });

    renderBundlePage();
    const addButton = await screen.findByRole('button', { name: 'Add combo to bag' });
    await act(async () => addButton.click());

    expect(products.getBySlug).toHaveBeenCalledWith('admin-created-combo');
    expect(screen.getByRole('heading', { name: 'Admin-created combo' })).toBeTruthy();
    expect(screen.getByText('Current Product Name')).toBeTruthy();
    expect(screen.getByText('₹250')).toBeTruthy();
    expect(screen.getByText('₹80')).toBeTruthy();
    expect(mockAddToCart).toHaveBeenCalledWith(
      expect.objectContaining({ id: 19, sku: 'CUSTOM-COMBO-01', quantity: 12 }),
      1
    );
  });

  it('does not invent a purchasable product or stock when catalog resolution fails', async () => {
    products.getBySlug.mockRejectedValue({ response: { status: 404 } });
    vi.spyOn(console, 'error').mockImplementation(() => {});

    renderBundlePage();

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain(
      'This combo is currently unavailable. Please refresh and try again.'
    );
    expect(screen.getByRole('heading', { name: 'Combo unavailable' })).toBeTruthy();
    expect(mockAddToCart).not.toHaveBeenCalled();
  });

  it('does not allow purchasing if an admin-selected component is no longer active', async () => {
    products.getBySlug.mockResolvedValue({
      data: {
        data: {
          id: 25,
          name: 'New combo',
          slug: 'new-combo',
          price: 500,
          quantity: 5,
          specifications: {
            is_combo: true,
            combo_items: [{ product_id: 98, slug: 'inactive-product', name: 'Inactive product' }],
          },
        },
      },
    });
    products.getAllActive.mockResolvedValue({ data: { data: [] } });

    renderBundlePage('new-combo');

    expect(await screen.findByText('This product is no longer active.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Currently unavailable' }).disabled).toBe(true);
    expect(mockAddToCart).not.toHaveBeenCalled();
  });
});
