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
        hasPlacedOrder: true,
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

    const launcher = screen.getByRole('button', { name: /Open Bhumivera Client Concierge/i });
    fireEvent.click(launcher);

    await waitFor(() => {
      expect(aiSupport.initSession).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByText(/Hi Aarav, how can I help you today/i)).toBeTruthy();

    const quickChip = screen.getByRole('button', { name: /Track My Order/i });
    fireEvent.click(quickChip);

    await waitFor(() => {
      expect(aiSupport.sendMessage).toHaveBeenCalled();
    });

    expect((await screen.findAllByText(/#918273646/i)).length).toBeGreaterThan(0);
    expect(screen.getByText(/DLV99881122/i)).toBeTruthy();
    expect(screen.queryByText(/How was your concierge experience/i)).toBeNull();
    expect(screen.getByRole('button', { name: 'Mark Inquiry Resolved' })).toBeTruthy();
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

    fireEvent.click(screen.getByRole('button', { name: /Open Bhumivera Client Concierge/i }));
    await screen.findByText(/Hi Aarav, how can I help you today/i);
    fireEvent.click(screen.getByRole('button', { name: /Track My Order/i }));
    await waitFor(() => expect(aiSupport.sendMessage).toHaveBeenCalled());

    expect(screen.queryByText(/How was your support experience/i)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Mark Inquiry Resolved' }));

    expect(await screen.findByText(/How was your concierge experience/i)).toBeTruthy();
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

    expect(await screen.findByText(/Need assistance with shipping timelines/i)).toBeTruthy();
  });
});
