// @vitest-environment jsdom
import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CartProvider, useCart } from './CartContext';

const contextMocks = vi.hoisted(() => ({
  preview: vi.fn(),
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
  cart: { get: vi.fn(), add: vi.fn(), updateQuantity: vi.fn(), remove: vi.fn(), clear: vi.fn() },
  cartRules: { preview: contextMocks.preview },
  products: { getBySlug: vi.fn(), getById: vi.fn() },
}));

function CartPreview() {
  const { rulePreview } = useCart();
  return <p>{rulePreview?.tiers?.[0]?.giftProductName || 'Waiting for gift preview'}</p>;
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
});
