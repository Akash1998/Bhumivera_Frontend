// @vitest-environment jsdom
import React from 'react';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import { auth } from '../services/api';

vi.mock('../services/api', () => ({
  auth: {
    login: vi.fn(),
    googleLogin: vi.fn(),
    getAdminProfile: vi.fn(),
    logout: vi.fn(),
    adminLogout: vi.fn(),
  },
  users: {
    getProfile: vi.fn(),
  },
}));

const createToken = role => {
  const claims = btoa(JSON.stringify({
    id: 17,
    email: 'admin@example.com',
    role,
    exp: Math.floor(Date.now() / 1000) + 3600,
  }));
  return `header.${claims}.signature`;
};

function AuthState() {
  const { user, token, loading, completeLogin, googleLogin } = useAuth();
  return (
    <>
      <output data-testid="auth-state">{JSON.stringify({ user, token, loading })}</output>
      <button type="button" onClick={() => completeLogin({
        token: createToken('customer'),
        user: { id: 28, email: 'customer@example.com', role: 'customer' },
      })}>Complete customer login</button>
      <button type="button" onClick={() => googleLogin('google-id-token', true)}>Google sign-in</button>
    </>
  );
}

const readState = () => JSON.parse(screen.getByTestId('auth-state').textContent);

describe('AuthProvider session restoration', () => {
  afterEach(cleanup);

  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/admin/dashboard');
    vi.clearAllMocks();
    auth.getAdminProfile.mockResolvedValue({
      data: { id: 17, email: 'admin@example.com', name: 'Store Admin', role: 'admin' },
    });
    auth.googleLogin.mockResolvedValue({
      status: 200,
      data: {
        token: createToken('customer'),
        user: { id: 28, email: 'customer@example.com', role: 'customer' },
      },
    });
    auth.logout.mockResolvedValue({ data: {} });
    auth.adminLogout.mockResolvedValue({ data: {} });
  });

  it('restores the admin session and profile after an admin-page reload', async () => {
    const adminToken = createToken('admin');
    localStorage.setItem('adminToken', adminToken);
    localStorage.setItem('adminUser', JSON.stringify({ id: 17, email: 'admin@example.com', role: 'admin' }));

    render(<AuthProvider><AuthState /></AuthProvider>);

    await waitFor(() => expect(readState().loading).toBe(false));
    expect(readState().token).toBe(adminToken);
    expect(readState().user).toMatchObject({ role: 'admin', name: 'Store Admin' });
    expect(localStorage.getItem('adminToken')).toBe(adminToken);
  });

  it('keeps the admin session active when a customer request expires', async () => {
    const adminToken = createToken('admin');
    localStorage.setItem('adminToken', adminToken);
    localStorage.setItem('token', createToken('customer'));
    localStorage.setItem('adminUser', JSON.stringify({
      id: 17,
      email: 'admin@example.com',
      name: 'Store Admin',
      role: 'admin',
    }));
    localStorage.setItem('user', JSON.stringify({ id: 23, role: 'customer' }));

    render(<AuthProvider><AuthState /></AuthProvider>);
    await waitFor(() => expect(readState().loading).toBe(false));

    act(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('ms_token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-expired'));
    });

    await waitFor(() => expect(readState().token).toBe(adminToken));
    expect(readState().user).toMatchObject({ id: 17, role: 'admin' });
    expect(localStorage.getItem('adminToken')).toBe(adminToken);
    expect(JSON.parse(localStorage.getItem('user'))).toMatchObject({ id: 17, role: 'admin' });
    expect(window.location.pathname).toBe('/admin/dashboard');
    expect(auth.logout).toHaveBeenCalledOnce();
  });

  it('completes a verified login in memory without requiring a page reload', async () => {
    window.history.replaceState({}, '', '/login');
    render(<AuthProvider><AuthState /></AuthProvider>);
    await waitFor(() => expect(readState().loading).toBe(false));

    act(() => screen.getByRole('button', { name: 'Complete customer login' }).click());

    expect(readState().token).toBeTruthy();
    expect(readState().user).toMatchObject({ id: 28, role: 'customer' });
    expect(JSON.parse(localStorage.getItem('user'))).toMatchObject({ id: 28, role: 'customer' });
  });

  it('completes Google login in the shared authenticated session', async () => {
    window.history.replaceState({}, '', '/login');
    render(<AuthProvider><AuthState /></AuthProvider>);
    await waitFor(() => expect(readState().loading).toBe(false));

    await act(async () => screen.getByRole('button', { name: 'Google sign-in' }).click());

    expect(auth.googleLogin).toHaveBeenCalledWith({ idToken: 'google-id-token', termsAccepted: true });
    expect(readState().user).toMatchObject({ id: 28, role: 'customer' });
    expect(localStorage.getItem('token')).toBeTruthy();
  });

  it('leaves the session incomplete while Google login requires 2FA', async () => {
    window.history.replaceState({}, '', '/login');
    auth.googleLogin.mockResolvedValue({
      status: 202,
      data: { requires2FA: true, email: 'customer@example.com' },
    });
    render(<AuthProvider><AuthState /></AuthProvider>);
    await waitFor(() => expect(readState().loading).toBe(false));

    await act(async () => screen.getByRole('button', { name: 'Google sign-in' }).click());

    expect(readState().token).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
