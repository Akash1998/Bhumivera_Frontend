import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { Capacitor } from '@capacitor/core';
import { auth } from '../services/api';

export const isPasskeySupported = () => {
  return typeof window !== 'undefined' &&
    !Capacitor.isNativePlatform() &&
    'PublicKeyCredential' in window &&
    window.isSecureContext !== false;
};

export const storeBrowserPassword = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem('savedPasswords');
    } catch {
      // LocalStorage access restricted
    }
  }
  return false;
};

export const loginWithPasskey = async (email = '', accountType = 'customer') => {
  if (!isPasskeySupported()) {
    throw new Error('Passkeys require a supported browser and a secure website connection.');
  }

  const challenge = await auth.getPasskeyLoginChallenge(email.trim(), accountType);
  const response = await startAuthentication({
    optionsJSON: challenge.data.options,
  });
  const verified = await auth.verifyPasskeyLogin({
    challengeId: challenge.data.challengeId,
    response,
  });
  return verified.data;
};

export const registerPasskey = async options => {
  if (!isPasskeySupported()) {
    throw new Error('Passkeys require a supported browser and a secure website connection.');
  }

  const { accountType = 'customer', name = 'Passkey device' } = typeof options === 'string'
    ? { name: options }
    : options || {};
  const challenge = await auth.getPasskeyRegisterChallenge(accountType);
  const response = await startRegistration({
    optionsJSON: challenge.data.options,
  });
  const result = await auth.verifyPasskeyRegister({
    challengeId: challenge.data.challengeId,
    response,
    deviceName: name,
  }, accountType);
  return result.data;
};

export default {
  isPasskeySupported,
  loginWithPasskey,
  registerPasskey,
  storeBrowserPassword,
};
