// @vitest-environment jsdom
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Affiliate from './Affiliate';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock('../components/SEO', () => ({
  default: () => null,
}));

describe('affiliate order economics disclosure', () => {
  afterEach(cleanup);

  it('explains the relationship, the order-level earnings calculation, and impact reporting honestly', () => {
    window.scrollTo = vi.fn();
    render(<MemoryRouter><Affiliate /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /Not one post and goodbye/ })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Know what each order does—and does not—earn' })).toBeTruthy();
    expect(screen.getByText(/supplier identities and invoices remain private/)).toBeTruthy();
    expect(screen.getByText(/reported as funded only when actually collected/)).toBeTruthy();
    expect(screen.getByText(/no follower minimum/i)).toBeTruthy();
  });
});
