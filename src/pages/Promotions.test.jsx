// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import Promotions from './Promotions';
import { useAuth } from '../context/AuthContext';
import { affiliate } from '../services/api';

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../services/api', () => ({
  affiliate: {
    getPartnerDashboard: vi.fn(),
    applyForPartner: vi.fn(),
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

  it('carries the entered email and promotions return path into account registration', async () => {
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

    fireEvent.change(screen.getByLabelText(/Email address for your Bhumivera account/), {
      target: { value: 'creator@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Create and verify account/i }));

    await waitFor(() => expect(screen.getByTestId('location').textContent).toContain('"pathname":"/register"'));
    expect(screen.getByTestId('location').textContent).toContain('creator%40example.com');
    expect(screen.getByTestId('location').textContent).toContain('"from":"/promotions"');
  });

  it('shows pending applicants the verification wait notice and an inactive reserved code', async () => {
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

    expect(await screen.findByText(/Thank you for your interest in collaborating with Bhumivera/i)).toBeTruthy();
    expect(screen.getByText(/within 12–24 hours/i)).toBeTruthy();
    expect(screen.getByText('BV1234567890')).toBeTruthy();
    expect(screen.getByText(/Reserved promoter code · inactive/i)).toBeTruthy();
    expect(screen.queryByText('Share your offer')).toBeNull();
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

    fireEvent.click(await screen.findByRole('radio', { name: 'Instagram' }));
    fireEvent.change(screen.getByLabelText(/Profile name or handle/), {
      target: { value: '@creator' },
    });
    fireEvent.change(screen.getByLabelText(/Public profile link/), {
      target: { value: 'https://www.instagram.com/creator/' },
    });
    expect(screen.getByRole('radio', { name: 'Instagram' }).checked).toBe(true);
    expect(screen.getByLabelText(/Profile name or handle/).value).toBe('@creator');
    fireEvent.change(screen.getByLabelText(/Approximate followers/), {
      target: { value: '5000' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Send application for review/i }));

    expect((await screen.findByRole('alert')).textContent).toMatch(/confirm that you own or manage this profile/i);
    expect(affiliate.applyForPartner).not.toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText(/I confirm that I own or manage this profile/i));
    fireEvent.click(screen.getByRole('button', { name: /Send application for review/i }));

    expect(await screen.findByText('Application received!')).toBeTruthy();
    expect(affiliate.applyForPartner).toHaveBeenCalledWith({
      socialPlatform: 'Instagram',
      socialHandle: '@creator',
      profileUrl: 'https://www.instagram.com/creator/',
      followerCount: 5000,
    });
    fireEvent.click(screen.getByRole('button', { name: /Explore Bhumivera’s impact/i }));
    expect(await screen.findByText('Impact page reached')).toBeTruthy();
  });
});
