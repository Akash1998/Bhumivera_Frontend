// @vitest-environment jsdom
import React from 'react';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ActiveComboShowcase from './ActiveComboShowcase';
import { products } from '../services/api';

vi.mock('../services/api', () => ({
  products: { getAllActive: vi.fn() },
}));

describe('active combo showcase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders only active combos with their current catalog products and prices', async () => {
    products.getAllActive.mockResolvedValue({
      data: {
        data: [
          {
            id: 21,
            slug: 'admin-combo',
            sku: 'CUSTOM-COMBO-21',
            name: 'Admin-created combo',
            description: 'Current description from Admin',
            price: 500,
            discount_price: 400,
            status: 'active',
            specifications: {
              is_combo: true,
              combo_items: [{ product_id: 7, slug: 'new-product', name: 'Old name', quantity: 2 }],
            },
          },
          {
            id: 7,
            slug: 'new-product',
            name: 'Current product name',
            price: 150,
            discount_price: 125,
            status: 'active',
          },
          {
            id: 22,
            slug: 'inactive-combo',
            name: 'Inactive combo',
            status: 'inactive',
            specifications: { is_combo: true, combo_items: [{ product_id: 7, slug: 'new-product' }] },
          },
        ],
      },
    });

    render(<MemoryRouter><ActiveComboShowcase /></MemoryRouter>);

    expect(await screen.findByText('Admin-created combo')).toBeTruthy();
    expect(screen.getByText('Current description from Admin')).toBeTruthy();
    expect(screen.getByText((_, element) =>
      element.tagName === 'SPAN' && element.textContent.includes('Current product name')
    )).toBeTruthy();
    expect(screen.getByText('₹400')).toBeTruthy();
    expect(screen.getByText('₹125')).toBeTruthy();
    expect(screen.queryByText('Inactive combo')).toBeNull();
    expect(screen.queryByText('Old name')).toBeNull();
  });

  it('defers homepage catalog loading until the showcase approaches the viewport', async () => {
    let intersectionCallback;
    class MockIntersectionObserver {
      constructor(callback) {
        intersectionCallback = callback;
      }

      observe = vi.fn();
      disconnect = vi.fn();
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    products.getAllActive.mockResolvedValue({ data: { data: [] } });
    render(<MemoryRouter><ActiveComboShowcase variant="home" /></MemoryRouter>);

    expect(products.getAllActive).not.toHaveBeenCalled();

    act(() => {
      intersectionCallback([{ isIntersecting: true }]);
    });

    await waitFor(() => expect(products.getAllActive).toHaveBeenCalledTimes(1));
  });
});
