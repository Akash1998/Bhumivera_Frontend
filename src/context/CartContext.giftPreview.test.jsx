// @vitest-environment jsdom
import React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CartProvider, useCart } from './CartContext';

const contextMocks = vi.hoisted(() => ({
  preview: vi.fn(),
  getProduct: vi.fn(),
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('./AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: false, user: null }),
}));
vi.mock('./SettingsContext', () => ({
  useSettings: () => ({ settings: {} }),
}));
vi.mock('./ToastContext', () => ({
  useToast: () => contextMocks.toast,
}));
vi.mock('../services/api', () => ({
  affiliate: {
    getProgramConfig: vi.fn().mockResolvedValue({ data: { minimumOrderAmount: 599 } }),
    getOffer: vi.fn(),
  },
  cart: { get: vi.fn(), add: vi.fn(), updateQuantity: vi.fn(), remove: vi.fn(), clear: vi.fn() },
  cartRules: { preview: contextMocks.preview },
  products: { getBySlug: vi.fn(), getById: contextMocks.getProduct },
}));

function CartPreview() {
  const { rulePreview, addToCart } = useCart();
  return <>
    <p>{rulePreview?.tiers?.[0]?.giftProductName || 'Waiting for gift preview'}</p>
    <button type="button" onClick={() => { void addToCart({ id: 4, name: 'Face Serum', price: 300 }); }}>Add to bag</button>
  </>;
}

describe('guest cart gift preview', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('loads the configured gift milestone for a guest cart subtotal', async () => {
    localStorage.setItem('Bhumivera_guest_cart', JSON.stringify([
      { product_id: 3, product: { id: 3, name: 'Face Wash', price: 750 }, quantity: 1 },
    ]));
    contextMocks.preview.mockResolvedValue({
      data: {
        tiers: [{
          id: 8,
          minCartValue: 1000,
          giftProductId: 12,
          giftProductName: 'Travel Cleanser',
          giftQuantity: 1,
          unlocked: false,
        }],
      },
    });

    render(<CartProvider><CartPreview /></CartProvider>);

    await waitFor(() => expect(contextMocks.preview).toHaveBeenCalledWith(750));
    expect(await screen.findByText('Travel Cleanser')).toBeTruthy();
  });

  it('celebrates a free gift when an initially non-empty guest cart reaches its rule', async () => {
    localStorage.setItem('Bhumivera_guest_cart', JSON.stringify([
      { product_id: 3, product: { id: 3, name: 'Face Wash', price: 750 }, quantity: 1 },
    ]));
    contextMocks.preview.mockImplementation(async subtotal => ({
      data: subtotal >= 1000
        ? {
          matchedRuleIds: [8],
          matchedRules: [{ id: 8, name: 'Gift reward', gift_product_id: 12, gift_product_name: 'Travel Cleanser' }],
          gifts: [{ ruleId: 8, productId: 12, productName: 'Travel Cleanser', quantity: 1 }],
          tiers: [{ id: 8, minCartValue: 1000, giftProductId: 12, giftProductName: 'Travel Cleanser', giftQuantity: 1, unlocked: true }],
        }
        : {
          matchedRuleIds: [],
          matchedRules: [],
          gifts: [],
          tiers: [{ id: 8, minCartValue: 1000, giftProductId: 12, giftProductName: 'Travel Cleanser', giftQuantity: 1, unlocked: false }],
        },
    }));
    contextMocks.getProduct.mockResolvedValue({
      data: { id: 4, name: 'Face Serum', price: 300, quantity: 10, status: 'active' },
    });

    render(<CartProvider><CartPreview /></CartProvider>);
    await waitFor(() => expect(contextMocks.preview).toHaveBeenCalledWith(750));

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Add to bag' }));
    });

    expect(await screen.findByText(/Free gift unlocked!/)).toBeTruthy();
    expect(screen.getAllByText('Travel Cleanser')).toHaveLength(2);
  });
});
