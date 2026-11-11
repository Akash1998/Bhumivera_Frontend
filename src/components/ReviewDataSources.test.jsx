// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ReviewSection from './ReviewSection';
import BundleDetail from '../pages/BundleDetail';
import { products, reviews } from '../services/api';

vi.mock('../services/api', () => ({
  products: { getBySlug: vi.fn(), getAllActive: vi.fn() },
  reviews: { getByProduct: vi.fn(), getByCombo: vi.fn(), submit: vi.fn() },
}));
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: null }) }));
vi.mock('../context/CartContext', () => ({ useCart: () => ({ addToCart: vi.fn() }) }));
vi.mock('./SEO', () => ({ default: () => null }));

describe('storefront review data sources', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    products.getBySlug.mockResolvedValue({
      data: {
        id: 1,
        slug: 'test-combo',
        quantity: 1,
        specifications: { is_combo: true, combo_items: [{ product_id: 2, slug: 'test-item' }] },
      },
    });
    products.getAllActive.mockResolvedValue({ data: { data: [{ id: 2, slug: 'test-item', name: 'Test item' }] } });
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('shows no product reviews when the database returns an empty list', async () => {
    reviews.getByProduct.mockResolvedValue({ data: { reviews: [] } });
    render(<MemoryRouter><ReviewSection productId={1} /></MemoryRouter>);
    expect(await screen.findByText('No reviews yet')).toBeTruthy();
    expect(screen.getByText('Based on 0 verified patron reviews')).toBeTruthy();
  });

  it('reports product review failures instead of showing bundled reviews', async () => {
    reviews.getByProduct.mockRejectedValue(new Error('Unavailable'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<MemoryRouter><ReviewSection productId={1} /></MemoryRouter>);
    expect(await screen.findByText('Customer reviews could not be loaded. Please try again shortly.')).toBeTruthy();
    expect(screen.getByText('Based on 0 verified patron reviews')).toBeTruthy();
  });

  it.each([
    ['empty result', () => reviews.getByCombo.mockResolvedValue({ data: { reviews: [], summary: { total: 0, average: 0 } } }), 'No approved reviews are currently recorded for this combo.'],
    ['API error', () => reviews.getByCombo.mockRejectedValue(new Error('Unavailable')), 'Combo reviews could not be loaded right now.'],
  ])('does not use bundled regimen reviews on %s', async (_label, setup, message) => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    setup();
    render(
      <MemoryRouter initialEntries={['/combo/test-combo']}>
        <Routes><Route path="/combo/:slug" element={<BundleDetail />} /></Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText(message)).toBeTruthy();
    expect(screen.getByText('Combo reviews (0)')).toBeTruthy();
  });
});
