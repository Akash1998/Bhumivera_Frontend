// @vitest-environment jsdom
import React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SupportAssistant from './SupportAssistant';
import { aiSupport } from '../services/api';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 7, name: 'Aarav Sharma', email: 'aarav@example.com', role: 'customer' },
  }),
}));

vi.mock('../context/CartContext', () => ({
  useCart: () => ({
    cart: [{ id: 1, name: 'Kumkumadi Night Elixir', quantity: 1 }],
    isCartOpen: false,
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
  },
}));

describe('SupportAssistant floating AI widget', () => {
  afterEach(cleanup);

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
    Element.prototype.scrollIntoView = vi.fn();

    aiSupport.initSession.mockResolvedValue({
      data: {
        sessionToken: 'sess_test_12345',
        greeting: 'Hi Aarav, how can I help you today?',
        quickActions: [
          { id: 'track_order', label: 'Where is my order?', prompt: 'Where is my order?' },
          { id: 'initiate_return', label: 'Initiate Return', prompt: 'Initiate return' },
        ],
        messages: [
          {
            id: 1,
            sender: 'assistant',
            content: 'Hi Aarav, how can I help you today?',
            orderCards: [],
            quickActions: [],
            createdAt: new Date().toISOString(),
          },
        ],
      },
    });

    aiSupport.sendMessage.mockResolvedValue({
      data: {
        sessionToken: 'sess_test_12345',
        reply: 'Here is the real-time status for **Order #918273646**.',
        orderCards: [
          {
            id: 102,
            orderNumber: '918273646',
            status: 'delivered',
            currentStep: 4,
            total: 1299,
            trackingNumber: 'DLV99881122',
            courier: 'Delhivery',
            deliveryEstimate: 'Delivered on 13 Oct 2026',
            cancellable: false,
            canReturn: true,
            items: [{ id: 2, name: 'Gotu Kola Barrier Repair Cream', quantity: 1, price: 1299 }],
          },
        ],
        quickActions: [
          { id: 'return_102', label: 'Return #918273646', prompt: 'Initiate return for order #918273646' },
        ],
        sentiment: { score: 0, frustrationScore: 0, priority: 'Low', label: 'neutral' },
      },
    });

    aiSupport.updateContext.mockResolvedValue({
      data: {
        proactiveMessage: 'Need a hand with checkout? Free standard shipping on orders ₹500+.',
        quickActions: [],
      },
    });
  });

  it('opens the widget, initializes session, and renders order cards when querying an order', async () => {
    render(
      <MemoryRouter initialEntries={['/order-tracking']}>
        <SupportAssistant />
      </MemoryRouter>
    );

    const launcher = screen.getByRole('button', { name: /Open Bhumivera Support/i });
    fireEvent.click(launcher);

    await waitFor(() => {
      expect(aiSupport.initSession).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByText(/Hi Aarav, how can I help you today/i)).toBeTruthy();

    const quickChip = screen.getByRole('button', { name: /Where is my order\?/i });
    fireEvent.click(quickChip);

    await waitFor(() => {
      expect(aiSupport.sendMessage).toHaveBeenCalled();
    });

    expect((await screen.findAllByText(/#918273646/i)).length).toBeGreaterThan(0);
    expect(screen.getByText(/DLV99881122/i)).toBeTruthy();
    expect(screen.queryByText(/How was your support experience/i)).toBeNull();
    expect(screen.getByRole('button', { name: 'End chat' })).toBeTruthy();
  });

  it('shows the rating form only after the customer ends the chat', async () => {
    aiSupport.endSatisfied.mockResolvedValue({
      data: {
        status: 'resolved',
        systemMessage: {
          id: 2,
          sender: 'system',
          content: 'This chat has ended.',
        },
      },
    });
    aiSupport.submitRating.mockResolvedValue({ data: { success: true } });

    render(
      <MemoryRouter initialEntries={['/']}>
        <SupportAssistant />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Open Bhumivera Support/i }));
    await screen.findByText(/Hi Aarav, how can I help you today/i);
    fireEvent.click(screen.getByRole('button', { name: /Where is my order\?/i }));
    await waitFor(() => expect(aiSupport.sendMessage).toHaveBeenCalled());

    expect(screen.queryByText(/How was your support experience/i)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'End chat' }));

    expect(await screen.findByText(/How was your support experience/i)).toBeTruthy();
    expect(aiSupport.endSatisfied).toHaveBeenCalledWith('sess_test_12345', {});

    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    await waitFor(() => expect(aiSupport.submitRating).toHaveBeenCalledWith(
      'sess_test_12345',
      { rating: 5, feedback: '' }
    ));
    expect(await screen.findByText(/Thank you for your feedback/i)).toBeTruthy();
  });

  it('triggers proactive assistance bubble when lingering on checkout page', async () => {
    render(
      <MemoryRouter initialEntries={['/checkout']}>
        <SupportAssistant lingerThresholdMs={50} />
      </MemoryRouter>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 120));
    });

    expect(await screen.findByText(/Need a hand with checkout/i)).toBeTruthy();
  });

  it('offers order and general-query paths and lets customers move or close the mobile widget', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <SupportAssistant />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Open Bhumivera Support/i }));
    await screen.findByText(/Hi Aarav, how can I help you today/i);
    expect(screen.getByRole('button', { name: /Order-related issue/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /General question/i })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Move Concierge to left/i }));
    expect(screen.getByTestId('bhumivera-support-assistant').className).toContain('left-4');
    expect(screen.getByRole('button', { name: /Move Concierge to right/i })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Close Concierge' }));
    fireEvent.click(screen.getByRole('button', { name: /Open Bhumivera Support/i }));
    expect(await screen.findByRole('button', { name: /Move Concierge to right/i })).toBeTruthy();
  });

  it('sends the selected issue category and shows server cooldown errors instead of a fallback answer', async () => {
    aiSupport.sendMessage.mockRejectedValueOnce({
      response: {
        status: 429,
        data: { message: 'You already sent this message recently. Please wait 10 minutes.' },
      },
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <SupportAssistant />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Open Bhumivera Support/i }));
    await screen.findByText(/Hi Aarav, how can I help you today/i);
    fireEvent.click(screen.getByRole('button', { name: /Order-related issue/i }));

    await waitFor(() => {
      expect(aiSupport.sendMessage).toHaveBeenCalledWith(expect.objectContaining({
        pageContext: expect.objectContaining({ supportCategory: 'order' }),
      }));
    });

    fireEvent.click(screen.getByRole('button', { name: /Where is my order\?/i }));
    expect(await screen.findByText(/wait 10 minutes/i)).toBeTruthy();
    expect(screen.queryByText(/I can help you fix/i)).toBeNull();
  });

  it('updates quickActions dynamically for Product -> Ingredient -> 2+1 Suggestions (Sea Buckthorn Face Wash -> Niacinamide)', async () => {
    aiSupport.sendMessage.mockResolvedValueOnce({
      data: {
        sessionToken: 'sess_test_12345',
        reply: '**Bhumivera Sea Buckthorn Face Wash** checks all listed ingredients in memory including Sea Buckthorn and Niacinamide.',
        orderCards: [],
        quickActions: [
          { id: 'ing_niacinamide', label: 'Ingredient: Niacinamide', prompt: 'Tell me about Niacinamide in Sea Buckthorn Face Wash', category: 'ingredient_discovery' },
          { id: 'ing_hyaluronic', label: 'Ingredient: Hyaluronic Acid', prompt: 'Tell me about Hyaluronic Acid in Sea Buckthorn Face Wash', category: 'ingredient_discovery' },
          { id: 'usage_time', label: 'How & What Time to Use Sea Buckthorn Face Wash', prompt: 'How do I really use Sea Buckthorn Face Wash?', category: 'usage_and_timing' },
        ],
      },
    }).mockResolvedValueOnce({
      data: {
        sessionToken: 'sess_test_12345',
        reply: '**Niacinamide (Vitamin B3)** supports barrier ceramides and refines pores.',
        orderCards: [],
        quickActions: [
          { id: 'nia_1', label: 'Niacinamide: Pores, Oil Control & Barrier Science', prompt: 'How does Niacinamide control oil?', category: 'ingredient_deep_dive' },
          { id: 'nia_2', label: 'Niacinamide: Daily Layering & Active Pairing Guide', prompt: 'Can I pair Niacinamide with Vitamin C?', category: 'ingredient_deep_dive' },
          { id: 'rel_ha', label: 'Related Ingredient: Hyaluronic Acid', prompt: 'Tell me about Hyaluronic Acid', category: 'closely_related_ingredient' },
          { id: 'use_fw', label: 'How & What Time to Use Sea Buckthorn Face Wash', prompt: 'How do I really use Sea Buckthorn Face Wash?', category: 'usage_and_timing' },
        ],
      },
    });

    render(
      <MemoryRouter initialEntries={['/science']}>
        <SupportAssistant />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Open Bhumivera Support/i }));
    await screen.findByText(/Hi Aarav, how can I help you today/i);

    fireEvent.click(screen.getByRole('button', { name: /Where is my order\?/i }));
    expect(await screen.findByRole('button', { name: /Ingredient: Niacinamide/i })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Ingredient: Niacinamide/i }));
    expect(await screen.findByRole('button', { name: /Niacinamide: Pores, Oil Control & Barrier Science/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Niacinamide: Daily Layering & Active Pairing Guide/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Related Ingredient: Hyaluronic Acid/i })).toBeTruthy();
  });
});
