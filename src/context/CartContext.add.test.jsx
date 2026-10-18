// @vitest-environment jsdom
import React from 'react';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CartProvider, useCart } from './CartContext';
import { products } from '../services/api';
import { AI_COPILOT_EVENT } from '../utils/aiCopilotBus';

const mockToast = { success: vi.fn(), error: vi.fn(), info: vi.fn(), warning: vi.fn() };

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: false, user: null }),
}));

vi.mock('../context/SettingsContext', () => ({
  useSettings: () => ({ settings: {} }),
}));

vi.mock('../context/ToastContext', () => ({
  useToast: () => mockToast,
}));

vi.mock('../services/api', () => ({
  products: { getById: vi.fn() },
  cart: {
    get: vi.fn(),
    add: vi.fn(),
    updateQuantity: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
  },
}));

function CartHarness() {
  const { cartItems, addToCart } = useCart();
  return (
    <>
      <output data-testid="cart-items">{JSON.stringify(cartItems)}</output>
      <button type="button" onClick={() => addToCart({ id: 17, name: 'Sea Buckthorn Oil', quantity: 0 })}>
        Add product
      </button>
    </>
  );
}

describe('guest cart additions with live inventory', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(cleanup);

  it('adds an in-stock item even when the product card has stale zero stock', async () => {
    products.getById.mockResolvedValue({
      data: { success: true, data: { id: 17, name: 'Sea Buckthorn Oil', quantity: 8, status: 'active' } },
    });
    const rescueEvent = vi.fn();
    window.addEventListener(AI_COPILOT_EVENT, rescueEvent);

    render(<CartProvider><CartHarness /></CartProvider>);
    await waitFor(() => expect(screen.getByTestId('cart-items').textContent).toBe('[]'));
    await act(async () => screen.getByRole('button', { name: 'Add product' }).click());

    expect(products.getById).toHaveBeenCalledWith(17);
    expect(JSON.parse(screen.getByTestId('cart-items').textContent)).toMatchObject([
      { product_id: 17, quantity: 1, product: { quantity: 8, status: 'active' } },
    ]);
    expect(rescueEvent).not.toHaveBeenCalled();
    expect(mockToast.success).toHaveBeenCalledWith('Added to cart successfully.');
    window.removeEventListener(AI_COPILOT_EVENT, rescueEvent);
  });

  it('rejects live zero stock without automatically opening the AI assistant', async () => {
    products.getById.mockResolvedValue({
      data: { success: true, data: { id: 17, name: 'Sea Buckthorn Oil', quantity: 0, status: 'active' } },
    });
    const rescueEvent = vi.fn();
    window.addEventListener(AI_COPILOT_EVENT, rescueEvent);

    render(<CartProvider><CartHarness /></CartProvider>);
    await waitFor(() => expect(screen.getByTestId('cart-items').textContent).toBe('[]'));
    await act(async () => screen.getByRole('button', { name: 'Add product' }).click());

    expect(JSON.parse(screen.getByTestId('cart-items').textContent)).toEqual([]);
    expect(mockToast.error).toHaveBeenCalledWith('Sea Buckthorn Oil is currently out of stock.');
    expect(rescueEvent).toHaveBeenCalledTimes(1);
    expect(rescueEvent.mock.calls[0][0].detail.autoOpen).toBe(false);
    window.removeEventListener(AI_COPILOT_EVENT, rescueEvent);
  });
});
