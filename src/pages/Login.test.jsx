// @vitest-environment jsdom
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
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
  loginWithPasskey: vi.fn(),
  storeBrowserPassword: vi.fn(),
}));

describe('Login route for an existing session', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
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
