// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import Promotions from './Promotions';
import { useAuth } from '../context/AuthContext';
import { affiliate, products } from '../services/api';

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../services/api', () => ({
  affiliate: {
    getPartnerDashboard: vi.fn(),
    applyForPartner: vi.fn(),
  },
  products: {
    getAllActive: vi.fn(),
  },
}));

function LocationSnapshot() {
  const location = useLocation();
  return <output data-testid="location">{JSON.stringify({ pathname: location.pathname, search: location.search, state: location.state })}</output>;
}

describe('promoter registration page', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  beforeEach(() => {
    products.getAllActive.mockResolvedValue({ data: { data: [] } });
  });

  it('offers a simple registration link without asking for an email on promotions', async () => {
    useAuth.mockReturnValue({ user: null, loading: false });

    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/promotions']}>
          <Routes>
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/register" element={<LocationSnapshot />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>,
    );

    expect(await screen.findByRole('heading', { name: 'See what each order contributes' })).toBeTruthy();
    expect(products.getAllActive).not.toHaveBeenCalled();
    expect(screen.queryByLabelText(/Email for your Bhumivera account/)).toBeNull();
    fireEvent.click(screen.getByRole('link', { name: 'Register' }));

    await waitFor(() => expect(screen.getByTestId('location').textContent).toContain('"pathname":"/register"'));
    expect(screen.getByTestId('location').textContent).not.toContain('email');
    expect(screen.getByTestId('location').textContent).toContain('"from":"/promotions"');
  });

  it('provides an existing-account link with the promotions return path', async () => {
    useAuth.mockReturnValue({ user: null, loading: false });

    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/promotions']}>
          <Routes>
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/login" element={<LocationSnapshot />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>,
    );

    fireEvent.click(await screen.findByRole('link', { name: 'Already have an account' }));

    await waitFor(() => expect(screen.getByTestId('location').textContent).toContain('"pathname":"/login"'));
    expect(screen.getByTestId('location').textContent).toContain('"from":"/promotions"');
  });

  it('loads pending applicants and shows their inactive reserved code', async () => {
    useAuth.mockReturnValue({ user: { email: 'creator@example.com' }, loading: false });
    affiliate.getPartnerDashboard.mockResolvedValue({
      data: {
        dashboard: {
          partner: {
            status: 'pending',
            referral_code: 'BV1234567890',
            social_platform: 'Instagram',
            social_handle: '@creator',
            follower_count: 1000,
          },
          summary: {},
        },
      },
    });

    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/promotions']}>
          <Routes><Route path="/promotions" element={<Promotions />} /></Routes>
        </MemoryRouter>
      </HelmetProvider>,
    );

    expect(await screen.findByText('Your Creator Code Is Reserved')).toBeTruthy();
    expect(screen.getByText(/within 12–24 hours/i)).toBeTruthy();
    expect(screen.getByText('BV1234567890')).toBeTruthy();
    expect(screen.getByText(/Reserved promoter code · inactive/i)).toBeTruthy();
    expect(screen.queryByText('Share your offer')).toBeNull();
    expect(affiliate.getPartnerDashboard).toHaveBeenCalledTimes(1);
  });

  it('uses bundled product photos without requesting the database-backed catalog', async () => {
    useAuth.mockReturnValue({ user: null, loading: false });

    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/promotions']}>
          <Routes><Route path="/promotions" element={<Promotions />} /></Routes>
        </MemoryRouter>
      </HelmetProvider>,
    );

    const shampoo = screen.getByAltText('Bhumivera botanical shampoo and conditioner product');
    expect(shampoo.getAttribute('src')).toContain('/images/products/bhumivera-royal-shampoo-front.webp');
    const soap = screen.getByAltText('Bhumivera handmade charcoal cleansing bar');
    expect(soap.getAttribute('src')).toContain('/images/products/bhumivera-charcoal-cleansing-bar-front.webp');
    expect(products.getAllActive).not.toHaveBeenCalled();
  });

  it('submits manually entered profile details only after ownership confirmation', async () => {
    useAuth.mockReturnValue({ user: { email: 'creator@example.com' }, loading: false });
    affiliate.getPartnerDashboard
      .mockResolvedValueOnce({ data: { dashboard: null } })
      .mockResolvedValueOnce({
        data: {
          dashboard: {
            partner: {
              status: 'pending',
              referral_code: 'BV1234567890',
              social_platform: 'Instagram',
              social_handle: '@creator',
              profile_url: 'https://www.instagram.com/creator/',
              follower_count: 5000,
            },
            summary: {},
          },
        },
      });
    affiliate.applyForPartner.mockResolvedValue({ data: { success: true } });

    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/promotions']}>
          <Routes>
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/impact" element={<p>Impact page reached</p>} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>,
    );

    expect(screen.queryByText('creator@example.com')).toBeNull();
    fireEvent.click(await screen.findByRole('radio', { name: 'Instagram' }));
    fireEvent.change(screen.getByLabelText(/Profile name or handle/), {
      target: { value: '@creator' },
    });
    fireEvent.change(screen.getByLabelText(/Public profile link/), {
      target: { value: 'https://www.instagram.com/creator/' },
    });
    expect(screen.getByRole('radio', { name: 'Instagram' }).checked).toBe(true);
    expect(screen.getByLabelText(/Profile name or handle/).value).toBe('@creator');
    fireEvent.change(screen.getByLabelText(/Follower \/ subscriber tier/), {
      target: { value: '1k_10k' },
    });
    fireEvent.change(screen.getByLabelText(/Primary content niche/), {
      target: { value: 'Skincare' },
    });
    fireEvent.change(screen.getByLabelText(/Preferred collaboration/), {
      target: { value: 'both' },
    });
    fireEvent.change(screen.getByLabelText(/What would a meaningful, long-term partnership look like to you/), {
      target: { value: 'I want to create honest, useful skincare education with my community over time.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Send creator application/i }));

    expect((await screen.findByRole('alert')).textContent).toMatch(/confirm that you own or manage this profile/i);
    expect(affiliate.applyForPartner).not.toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText(/I confirm that I own or manage this profile/i));
    fireEvent.click(screen.getByRole('button', { name: /Send creator application/i }));

    expect((await screen.findByRole('status')).textContent).toMatch(/Application received/);
    expect(affiliate.getPartnerDashboard).toHaveBeenCalledTimes(2);
    expect(affiliate.applyForPartner).toHaveBeenCalledWith({
      socialPlatform: 'Instagram',
      socialHandle: '@creator',
      profileUrl: 'https://www.instagram.com/creator/',
      followerCount: 0,
      followerTier: '1k_10k',
      contentNiche: 'Skincare',
      collaborationType: 'both',
      partnershipIntent: 'I want to create honest, useful skincare education with my community over time.',
    });
    expect(await screen.findByText('Your Creator Code Is Reserved')).toBeTruthy();
    expect(screen.getByText('BV1234567890')).toBeTruthy();
  });
});
