// @vitest-environment jsdom
import React from 'react';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import { auth, users } from '../services/api';

vi.mock('../services/api', () => ({
  auth: {
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
  const { user, token, loading } = useAuth();
  return <output data-testid="auth-state">{JSON.stringify({ user, token, loading })}</output>;
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
    users.getProfile.mockResolvedValue({
      data: { user: { id: 23, email: 'customer@example.com', name: 'Store Customer', role: 'customer' } },
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

  it('does not expose an admin session as a customer account on the profile route', async () => {
    window.history.replaceState({}, '', '/profile');
    localStorage.setItem('adminToken', createToken('admin'));
    localStorage.setItem('adminUser', JSON.stringify({ id: 17, role: 'admin' }));
    localStorage.setItem('user', JSON.stringify({ id: 17, role: 'admin' }));

    render(<AuthProvider><AuthState /></AuthProvider>);

    await waitFor(() => expect(readState().loading).toBe(false));
    expect(readState().user).toBeNull();
    expect(readState().token).toBeNull();
    expect(auth.getAdminProfile).not.toHaveBeenCalled();
    expect(users.getProfile).not.toHaveBeenCalled();
  });

  it('restores the customer profile when an admin profile is cached in shared storage', async () => {
    window.history.replaceState({}, '', '/profile');
    localStorage.setItem('token', createToken('customer'));
    localStorage.setItem('adminToken', createToken('admin'));
    localStorage.setItem('user', JSON.stringify({ id: 17, role: 'admin' }));
    localStorage.setItem('adminUser', JSON.stringify({ id: 17, role: 'admin' }));

    render(<AuthProvider><AuthState /></AuthProvider>);

    await waitFor(() => expect(readState().loading).toBe(false));
    expect(readState().user).toMatchObject({ id: 23, role: 'customer', name: 'Store Customer' });
    expect(readState().token).toBe(localStorage.getItem('token'));
    expect(users.getProfile).toHaveBeenCalledOnce();
    expect(auth.getAdminProfile).not.toHaveBeenCalled();
  });
});
