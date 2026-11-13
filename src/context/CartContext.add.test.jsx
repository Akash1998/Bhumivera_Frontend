// @vitest-environment jsdom
import React from 'react';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CartProvider, useCart } from './CartContext';
import { affiliate, cart, products } from '../services/api';
import { AI_COPILOT_EVENT } from '../utils/aiCopilotBus';

const mockToast = { success: vi.fn(), error: vi.fn(), info: vi.fn(), warning: vi.fn() };
const authState = vi.hoisted(() => ({ isAuthenticated: false, user: null }));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => authState,
}));

vi.mock('../context/SettingsContext', () => ({
  useSettings: () => ({ settings: {} }),
}));

vi.mock('../context/ToastContext', () => ({
  useToast: () => mockToast,
}));

vi.mock('../services/api', () => ({
  affiliate: {
    getProgramConfig: vi.fn().mockResolvedValue({ data: { minimumOrderAmount: 599 } }),
    getOffer: vi.fn().mockResolvedValue({ data: { offer: { code: 'BV1234', discountPercent: 15, minimumOrderAmount: 599 } } }),
  },
  products: { getById: vi.fn() },
  cart: {
    get: vi.fn().mockResolvedValue({ data: { items: [] } }),
    add: vi.fn(),
    updateQuantity: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
  },
}));

function CartHarness({ productId = 17 }) {
  const { cartItems, addToCart, isCartOpen } = useCart();
  return (
    <>
      <output data-testid="cart-items">{JSON.stringify(cartItems)}</output>
      <output data-testid="cart-open">{String(isCartOpen)}</output>
      <button type="button" onClick={() => addToCart({ id: productId, name: 'Sea Buckthorn Oil', quantity: 0 })}>
        Add product
      </button>
    </>
  );
}

function AffiliateHarness() {
  const { affiliateCode, affiliateOffer } = useCart();
  return <output data-testid="promoter-offer">{JSON.stringify({ affiliateCode, affiliateOffer })}</output>;
}

describe('cart additions with live inventory', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    authState.isAuthenticated = false;
    authState.user = null;
    window.history.replaceState({}, '', '/');
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
    expect(screen.getByTestId('cart-open').textContent).toBe('false');
    expect(rescueEvent).not.toHaveBeenCalled();
    expect(mockToast.success).toHaveBeenCalledWith('Added to bag successfully.');
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

  it('rejects stale catalog IDs for signed-in customers before calling the cart API', async () => {
    authState.isAuthenticated = true;
    authState.user = { id: 21, role: 'customer' };
    products.getById.mockRejectedValue({
      response: { status: 404, data: { message: 'Product not found' } },
    });

    render(<CartProvider><CartHarness productId={101} /></CartProvider>);
    await waitFor(() => expect(screen.getByTestId('cart-items').textContent).toBe('[]'));
    await act(async () => screen.getByRole('button', { name: 'Add product' }).click());

    expect(products.getById).toHaveBeenCalledWith(101);
    expect(JSON.parse(screen.getByTestId('cart-items').textContent)).toEqual([]);
    expect(mockToast.error).toHaveBeenCalledWith(
      'This product is no longer available in the current catalog. Refresh the catalog and try again.'
    );
    expect(cart.add).not.toHaveBeenCalled();
  });

  it('adds a signed-in customer product using verified live catalog data', async () => {
    authState.isAuthenticated = true;
    authState.user = { id: 21, role: 'customer' };
    products.getById.mockResolvedValue({
      data: { success: true, data: { id: 17, name: 'Sea Buckthorn Oil', quantity: 8, status: 'active' } },
    });
    cart.add.mockResolvedValue({ data: { items: [] } });
    cart.get
      .mockResolvedValueOnce({ data: { items: [] } })
      .mockResolvedValue({
        data: {
          items: [{
            product_id: 17,
            quantity: 1,
            product: { id: 17, name: 'Sea Buckthorn Oil', quantity: 8, status: 'active' },
          }],
        },
      });

    render(<CartProvider><CartHarness /></CartProvider>);
    await waitFor(() => expect(screen.getByTestId('cart-items').textContent).toBe('[]'));
    await act(async () => screen.getByRole('button', { name: 'Add product' }).click());

    expect(products.getById).toHaveBeenCalledWith(17);
    expect(JSON.parse(screen.getByTestId('cart-items').textContent)).toMatchObject([
      { product_id: 17, quantity: 1, product: { quantity: 8, status: 'active' } },
    ]);
    expect(cart.add).toHaveBeenCalledWith({ productId: 17, quantity: 1 });
  });

  it('uses the canonical live ID when a legacy product ID redirects to the live product', async () => {
    authState.isAuthenticated = true;
    authState.user = { id: 21, role: 'customer' };
    products.getById.mockResolvedValue({
      data: { success: true, data: { id: 17, name: 'Sea Buckthorn Oil', quantity: 8, status: 'active' } },
    });
    cart.add.mockResolvedValue({ data: { items: [] } });
    cart.get
      .mockResolvedValueOnce({ data: { items: [] } })
      .mockResolvedValue({ data: { items: [] } });

    render(<CartProvider><CartHarness productId={106} /></CartProvider>);
    await waitFor(() => expect(screen.getByTestId('cart-items').textContent).toBe('[]'));
    await act(async () => screen.getByRole('button', { name: 'Add product' }).click());

    expect(products.getById).toHaveBeenCalledWith(106);
    expect(cart.add).toHaveBeenCalledWith({ productId: 17, quantity: 1 });
  });

  it('enforces verified stock limits for signed-in customers', async () => {
    authState.isAuthenticated = true;
    authState.user = { id: 21, role: 'customer' };
    products.getById.mockResolvedValue({
      data: { success: true, data: { id: 17, name: 'Sea Buckthorn Oil', quantity: 0, status: 'active' } },
    });

    render(<CartProvider><CartHarness /></CartProvider>);
    await waitFor(() => expect(screen.getByTestId('cart-items').textContent).toBe('[]'));
    await act(async () => screen.getByRole('button', { name: 'Add product' }).click());

    expect(cart.add).not.toHaveBeenCalled();
    expect(mockToast.error).toHaveBeenCalledWith('Sea Buckthorn Oil is currently out of stock.');
  });

  it('stores and verifies a promoter code from the shared offer link', async () => {
    window.history.replaceState({}, '', '/?aff=BV1234');
    render(<CartProvider><AffiliateHarness /></CartProvider>);

    await waitFor(() => expect(affiliate.getOffer).toHaveBeenCalledWith('BV1234'));
    await waitFor(() => expect(JSON.parse(screen.getByTestId('promoter-offer').textContent)).toMatchObject({
      affiliateCode: 'BV1234',
      affiliateOffer: { discountPercent: 15 },
    }));
    expect(JSON.parse(localStorage.getItem('Bhumivera_affiliate_attribution'))).toMatchObject({ code: 'BV1234' });
  });
});
