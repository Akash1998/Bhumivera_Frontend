// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock('../context/CartContext', () => ({
  useCart: () => ({ cartItems: [], setIsCartOpen: vi.fn() }),
}));

vi.mock('../hooks/useVoiceSearch', () => ({
  useVoiceSearch: () => ({ isListening: false, startListening: vi.fn() }),
}));

describe('Navbar', () => {
  afterEach(cleanup);

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(() => ({ matches: false, addListener: vi.fn(), removeListener: vi.fn() })),
    });
  });

  it('opens the mobile navigation drawer without a render error', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.getByRole('dialog', { name: 'Main navigation' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Verify Bottle Serial/i })).toBeTruthy();
    expect(screen.queryByText(/select language/i)).toBeNull();
  });

  it('opens the AI concierge from the search controls', () => {
    const openHandler = vi.fn();
    window.addEventListener('bhumivera:open-support-chat', openHandler);

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByRole('button', { name: 'Open AI concierge' })[0]);

    expect(openHandler).toHaveBeenCalledTimes(1);
    window.removeEventListener('bhumivera:open-support-chat', openHandler);
  });
});
