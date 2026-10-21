import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Capacitor } from '@capacitor/core';

vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: vi.fn() },
}));

vi.mock('@capgo/capacitor-social-login', () => ({
  SocialLogin: {
    initialize: vi.fn(),
    login: vi.fn(),
  },
}));

describe('requestGoogleIdToken', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    Capacitor.isNativePlatform.mockReturnValue(false);
    vi.stubGlobal('window', { location: { origin: 'https://www.bhumivera.com' } });
  });

  it('initializes Google and returns the identity token from the plugin response', async () => {
    const { SocialLogin } = await import('@capgo/capacitor-social-login');
    SocialLogin.initialize.mockResolvedValue(undefined);
    SocialLogin.login.mockResolvedValue({
      provider: 'google',
      result: { idToken: 'verified-id-token' },
    });
    const { requestGoogleIdToken } = await import('./googleSignIn');

    await expect(requestGoogleIdToken()).resolves.toBe('verified-id-token');
    expect(SocialLogin.initialize).toHaveBeenCalledWith(expect.objectContaining({
      google: expect.objectContaining({
        webClientId: expect.stringMatching(/\.apps\.googleusercontent\.com$/),
        mode: 'online',
        redirectUrl: `${window.location.origin}/`,
      }),
    }));
    expect(SocialLogin.login).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        scopes: ['profile', 'email'],
        filterByAuthorizedAccounts: false,
      },
    });
  });

  it('reports a missing native identity token with actionable guidance', async () => {
    const { Capacitor } = await import('@capacitor/core');
    const { SocialLogin } = await import('@capgo/capacitor-social-login');
    Capacitor.isNativePlatform.mockReturnValue(true);
    SocialLogin.initialize.mockResolvedValue(undefined);
    SocialLogin.login.mockResolvedValue({ provider: 'google', result: {} });
    const { requestGoogleIdToken } = await import('./googleSignIn');

    await expect(requestGoogleIdToken()).rejects.toThrow(/app OAuth client and signing fingerprint/i);
  });

  it('retries plugin initialization after an initialization error', async () => {
    const { SocialLogin } = await import('@capgo/capacitor-social-login');
    SocialLogin.initialize
      .mockRejectedValueOnce(new Error('plugin init failed'))
      .mockResolvedValueOnce(undefined);
    SocialLogin.login.mockResolvedValue({
      provider: 'google',
      result: { idToken: 'verified-id-token' },
    });
    const { requestGoogleIdToken } = await import('./googleSignIn');

    await expect(requestGoogleIdToken()).rejects.toThrow('plugin init failed');
    await expect(requestGoogleIdToken()).resolves.toBe('verified-id-token');
    expect(SocialLogin.initialize).toHaveBeenCalledTimes(2);
  });
});
