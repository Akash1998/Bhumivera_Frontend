// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Login from './Login';
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../services/api', () => ({
  default: { post: vi.fn() },
  auth: { login: vi.fn() },
}));
vi.mock('../utils/webauthnClient', () => ({
  isPasskeySupported: vi.fn(() => true),
  loginWithPasskey: vi.fn(),
  storeBrowserPassword: vi.fn(),
}));
vi.mock('../utils/googleSignIn', () => ({
  requestGoogleIdToken: vi.fn().mockResolvedValue('google-id-token'),
}));

describe('Login route for an existing session', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('password login navigation', () => {
    afterEach(() => {
      cleanup();
      vi.clearAllMocks();
    });

    it('requires the Google terms acknowledgement and completes customer login', async () => {
      const session = {
        token: 'google-session-token',
        user: { id: 12, email: 'customer@example.com', role: 'customer' },
      };
      const googleLogin = vi.fn().mockResolvedValue({ status: 200, data: session });
      useAuth.mockReturnValue({ isAuthenticated: false, user: null, googleLogin });

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<p>Signed-in profile</p>} />
          </Routes>
        </MemoryRouter>,
      );

      const googleButton = screen.getByRole('button', { name: 'Continue with Google' });
      expect(googleButton.disabled).toBe(true);
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(googleButton);

      await waitFor(() => expect(screen.getByText('Signed-in profile')).toBeTruthy());
      expect(googleLogin).toHaveBeenCalledWith('google-id-token', true);
    });

    it('routes Google users with 2FA enabled to the authenticator challenge', async () => {
      const googleLogin = vi.fn().mockResolvedValue({
        status: 202,
        data: { requires2FA: true, email: 'customer@example.com', factor: 'authenticator' },
      });
      useAuth.mockReturnValue({ isAuthenticated: false, user: null, googleLogin });

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </MemoryRouter>,
      );

      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByRole('button', { name: 'Continue with Google' }));

      await waitFor(() => expect(screen.getByRole('heading', { name: '2-Factor Authentication' })).toBeTruthy());
      expect(screen.getByPlaceholderText('000000')).toBeTruthy();
    });

    it('stores a verified session and navigates without reloading the app view', async () => {
      const session = {
        token: 'verified-token',
        user: { id: 12, email: 'customer@example.com', role: 'customer' },
      };
      const login = vi.fn().mockResolvedValue({ status: 200, data: session });
      const completeLogin = vi.fn();
      useAuth.mockReturnValue({ isAuthenticated: false, user: null, login, completeLogin });

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<p>Signed-in profile</p>} />
          </Routes>
        </MemoryRouter>,
      );

      fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
        target: { value: session.user.email },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
        target: { value: 'correct-password' },
      });
      fireEvent.submit(screen.getByPlaceholderText('Enter your password').closest('form'));

      await waitFor(() => expect(screen.getByText('Signed-in profile')).toBeTruthy());
      expect(login).toHaveBeenCalledWith({ email: session.user.email, password: 'correct-password' });
      expect(completeLogin).not.toHaveBeenCalled();
    });
  });

  it.each([
    [{ role: 'customer' }, '/profile'],
    [{ role: 'admin' }, '/admin'],
    [{ role: 'warehouse_admin' }, '/warehouse'],
  ])('replaces the login page with the account destination for %s', (user, destination) => {
    useAuth.mockReturnValue({ isAuthenticated: true, user });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path={destination} element={<p>Account page: {destination}</p>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(`Account page: ${destination}`)).toBeTruthy();
  });
});
