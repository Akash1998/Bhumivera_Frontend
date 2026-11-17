// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Register from './Register';
import { useAuth } from '../context/AuthContext';
import { affiliate } from '../services/api';

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../services/api', () => ({
  affiliate: { previewReferral: vi.fn() },
}));
vi.mock('../components/GoogleSignInButton', () => ({
  default: ({ onSignIn, disabled, label }) => (
    <button type="button" disabled={disabled} onClick={() => onSignIn('google-id-token')}>{label}</button>
  ),
}));

describe('Google account registration', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('submits consent and referral with registration intent without mandating a recovery question', async () => {
    const googleLogin = vi.fn().mockResolvedValue({ status: 200, data: {} });
    useAuth.mockReturnValue({ register: vi.fn(), verifyEmail: vi.fn(), googleLogin });
    affiliate.previewReferral.mockResolvedValue({
      data: { valid: true, referrerName: 'A friend' },
    });

    render(
      <MemoryRouter initialEntries={['/register?ref=valid-referral-token']}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<p>New account profile</p>} />
        </Routes>
      </MemoryRouter>,
    );

    const createAccountButton = screen.getByRole('button', { name: 'Create account with Google' });
    expect(createAccountButton.disabled).toBe(true);

    // Verify recovery question input is not present
    expect(screen.queryByPlaceholderText('Your answer')).toBeNull();

    fireEvent.click(screen.getByRole('checkbox', { name: /I agree to the/i }));
    await waitFor(() => expect(createAccountButton.disabled).toBe(false));
    fireEvent.click(createAccountButton);

    await waitFor(() => expect(screen.getByText('New account profile')).toBeTruthy());
    expect(googleLogin).toHaveBeenCalledWith('google-id-token', {
      mode: 'register',
      termsAccepted: true,
      referralToken: 'valid-referral-token',
      referralCode: undefined,
      marketingEmailOptIn: false,
      adPersonalizationOptIn: false,
    });
  });

  it('selects all terms and preferences when Tick All is checked', async () => {
    useAuth.mockReturnValue({ register: vi.fn(), verifyEmail: vi.fn(), googleLogin: vi.fn() });
    affiliate.previewReferral.mockResolvedValue({ data: { valid: false } });

    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      </MemoryRouter>,
    );

    const tickAllCheckbox = screen.getByRole('checkbox', { name: /Tick All/i });
    expect(tickAllCheckbox.checked).toBe(false);

    fireEvent.click(tickAllCheckbox);
    expect(tickAllCheckbox.checked).toBe(true);

    const termsCheckbox = screen.getByRole('checkbox', { name: /I agree to the/i });
    const marketingCheckbox = screen.getByRole('checkbox', { name: /Send me promotional emails/i });
    const personalizationCheckbox = screen.getByRole('checkbox', { name: /Personalized product recommendations/i });

    expect(termsCheckbox.checked).toBe(true);
    expect(marketingCheckbox.checked).toBe(true);
    expect(personalizationCheckbox.checked).toBe(true);

    // Unchecking Tick All deselects all
    fireEvent.click(tickAllCheckbox);
    expect(termsCheckbox.checked).toBe(false);
    expect(marketingCheckbox.checked).toBe(false);
    expect(personalizationCheckbox.checked).toBe(false);
  });

  it('hides the referral blank space by default and toggles on Yes/No click', () => {
    useAuth.mockReturnValue({ register: vi.fn(), verifyEmail: vi.fn(), googleLogin: vi.fn() });
    affiliate.previewReferral.mockResolvedValue({ data: { valid: false } });

    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      </MemoryRouter>,
    );

    // Default: referral blank space is not shown
    expect(screen.queryByPlaceholderText(/Enter code/i)).toBeNull();

    // Click "Yes" to reveal referral input
    const yesButton = screen.getByRole('button', { name: 'Yes' });
    fireEvent.click(yesButton);
    expect(screen.getByPlaceholderText(/Enter code/i)).toBeTruthy();

    // Click "No" to hide referral input
    const noButton = screen.getByRole('button', { name: 'No' });
    fireEvent.click(noButton);
    expect(screen.queryByPlaceholderText(/Enter code/i)).toBeNull();
  });

  it('uses the verified Google email without asking for another email, and reveals email fields only for email registration', () => {
    useAuth.mockReturnValue({ register: vi.fn(), verifyEmail: vi.fn(), googleLogin: vi.fn() });
    affiliate.previewReferral.mockResolvedValue({ data: { valid: false } });

    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByPlaceholderText('Email address')).toBeNull();
    expect(screen.queryByPlaceholderText('Full name')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Email' }));
    expect(screen.getByPlaceholderText('Email address')).toBeTruthy();
    expect(screen.getByPlaceholderText('Full name')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Create account with Google' })).toBeNull();
  });
});
