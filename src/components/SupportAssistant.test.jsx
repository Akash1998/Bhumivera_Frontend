// @vitest-environment jsdom
import React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SupportAssistant from './SupportAssistant';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 7, name: 'Aarav Sharma', email: 'aarav@example.com', role: 'customer' },
  }),
}));

const mockAddToCart = vi.fn().mockResolvedValue(true);

vi.mock('../context/CartContext', () => ({
  useCart: () => ({
    cart: [{ id: 1, name: 'Kumkumadi Night Elixir', quantity: 1 }],
    isCartOpen: false,
    addToCart: mockAddToCart,
  }),
}));

vi.mock('../services/api', () => ({
  BASE_URL: 'https://service.bhumivera.com',
  aiSupport: {
    _forceJsonMode: true,
    initSession: vi.fn(),
    sendMessage: vi.fn(),
    updateContext: vi.fn(),
    getHistory: vi.fn(),
    escalate: vi.fn(),
    endSatisfied: vi.fn(),
    submitRating: vi.fn(),
    passwordRescue: vi.fn(),
  },
}));

describe('SupportAssistant — 100% Deterministic Knowledge Tree & Instant Finder', () => {
  afterEach(cleanup);

  const openSupportChat = () => {
    act(() => window.dispatchEvent(new CustomEvent('bhumivera:open-support-chat')));
  };

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('opens from navbar event as responsive luxury panel with 8 Master Pillars', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <SupportAssistant />
      </MemoryRouter>
    );

    openSupportChat();

    expect(await screen.findByText(/Bhumivera Guided Knowledge Concierge/i)).toBeTruthy();
    expect(screen.getByText(/Shop & Routine Concierge/i)).toBeTruthy();
    expect(screen.getByText(/Account & Security/i)).toBeTruthy();
    expect(screen.getByText(/Orders & Live Tracking/i)).toBeTruthy();
    expect(screen.getByText(/Non-Returnable Policy & Cancellation/i)).toBeTruthy();
    expect(screen.getByText(/Payments, Wallet & GST/i)).toBeTruthy();
    expect(screen.getByText(/Botanical Science & Lab/i)).toBeTruthy();
    expect(screen.getByText(/Offers & Ambassador/i)).toBeTruthy();
    expect(screen.getByText(/Specialist Escalation/i)).toBeTruthy();

    const assistant = screen.getByTestId('bhumivera-support-assistant');
    expect(assistant.className).toContain('inset-0');
    expect(assistant.className).toContain('md:w-1/2');
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.click(screen.getByRole('button', { name: 'Close Concierge' }));
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('renders Instant Spotlight Live Finder with NO submit/send button', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <SupportAssistant />
      </MemoryRouter>
    );

    openSupportChat();
    await screen.findByText(/Bhumivera Guided Knowledge Concierge/i);

    const finderInput = screen.getByLabelText(/Instant Concierge Search/i);
    expect(finderInput).toBeTruthy();

    // Verify there is NO submit or send button
    expect(screen.queryByRole('button', { name: /Send/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /Send message/i })).toBeNull();
  });

  it('instant live filtering: typing "for" or "forgot password" portrays the visual Forgot Password resolution card', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <SupportAssistant />
      </MemoryRouter>
    );

    openSupportChat();
    await screen.findByText(/Bhumivera Guided Knowledge Concierge/i);

    const finderInput = screen.getByLabelText(/Instant Concierge Search/i);

    // Type "for"
    fireEvent.change(finderInput, { target: { value: 'for' } });

    // Instant suggestion appears
    expect(await screen.findByText(/Forgot Password — Step-by-Step Reset Guide/i)).toBeTruthy();

    // Click the card
    fireEvent.click(screen.getByText(/Forgot Password — Step-by-Step Reset Guide/i));

    // Displays the 4-step visual workflow
    expect(await screen.findByText(/Step-by-Step Resolution Guide/i)).toBeTruthy();
    expect(screen.getByText(/Navigate to Sign In/i)).toBeTruthy();
    expect(screen.getByText(/Select "Forgot Password\?"/i)).toBeTruthy();
    expect(screen.getByText(/Enter Registered Email/i)).toBeTruthy();
    expect(screen.getByText(/Verify OTP & Set New Password/i)).toBeTruthy();

    // Displays direct action button
    expect(screen.getByRole('button', { name: /Open Password Reset Page Now/i })).toBeTruthy();
  });

  it('sales concierge: product card portrays pricing, botanical actives, and 1-click Add to Bag', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <SupportAssistant />
      </MemoryRouter>
    );

    openSupportChat();
    await screen.findByText(/Bhumivera Guided Knowledge Concierge/i);

    // Tap quick shortcut for Sea Buckthorn Face Wash
    fireEvent.click(screen.getByRole('button', { name: /Sea Buckthorn Wash/i }));

    // Product card details
    expect(await screen.findByText(/Seabuckthorn Face wash by Bhumivera/i)).toBeTruthy();
    expect(screen.getAllByText(/₹399/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/21% OFF/i)).toBeTruthy();
    expect(screen.getByText(/In Stock \(92 units\)/i)).toBeTruthy();
    expect(screen.getByText(/1.0% Active Strength/i)).toBeTruthy();

    // Test 1-click Add to Bag
    const addBtns = screen.getAllByRole('button', { name: /Add to Bag/i });
    expect(addBtns.length).toBeGreaterThan(0);
    const addBtn = addBtns[0];

    fireEvent.click(addBtn);
    expect(mockAddToCart).toHaveBeenCalledWith(expect.objectContaining({
      id: 8,
      name: 'Seabuckthorn Face wash by Bhumivera',
      price: 499,
      discount_price: 399,
    }), 1);
  });

  it('decision tree navigation: browse into pillar and back with breadcrumbs', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <SupportAssistant />
      </MemoryRouter>
    );

    openSupportChat();
    await screen.findByText(/Bhumivera Guided Knowledge Concierge/i);

    // Click on "Orders & Live Tracking" pillar
    fireEvent.click(screen.getByText(/Orders & Live Tracking/i));

    // Shows cards inside this pillar
    expect(await screen.findByText(/Track My Order in Real-Time/i)).toBeTruthy();
    expect(screen.getByText(/Shipping Timelines & 2:00 PM Dispatch Cutoff/i)).toBeTruthy();

    // Click back to categories
    fireEvent.click(screen.getByRole('button', { name: /Back to All Categories/i }));
    expect(await screen.findByText(/Bhumivera Guided Knowledge Concierge/i)).toBeTruthy();
  });
});
