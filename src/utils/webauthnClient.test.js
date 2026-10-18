// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Capacitor } from '@capacitor/core';
import { isPasskeySupported } from './webauthnClient';

vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: vi.fn() },
}));
vi.mock('../services/api', () => ({ auth: {} }));

describe('passkey platform support', () => {
  const originalPublicKeyCredential = window.PublicKeyCredential;
  const originalSecureContext = window.isSecureContext;

  afterEach(() => {
    Object.defineProperty(window, 'PublicKeyCredential', {
      configurable: true,
      value: originalPublicKeyCredential,
    });
    Object.defineProperty(window, 'isSecureContext', {
      configurable: true,
      value: originalSecureContext,
    });
    vi.clearAllMocks();
  });

  it('hides passkeys in the Capacitor app WebView', () => {
    Capacitor.isNativePlatform.mockReturnValue(true);
    Object.defineProperty(window, 'PublicKeyCredential', { configurable: true, value: function PublicKeyCredential() {} });
    Object.defineProperty(window, 'isSecureContext', { configurable: true, value: true });

    expect(isPasskeySupported()).toBe(false);
  });

  it('keeps passkeys enabled in secure supported browsers', () => {
    Capacitor.isNativePlatform.mockReturnValue(false);
    Object.defineProperty(window, 'PublicKeyCredential', { configurable: true, value: function PublicKeyCredential() {} });
    Object.defineProperty(window, 'isSecureContext', { configurable: true, value: true });

    expect(isPasskeySupported()).toBe(true);
  });
});
