import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { auth } from '../services/api';

export const isPasskeySupported = () => (
  typeof window !== 'undefined' &&
  'PublicKeyCredential' in window &&
  window.isSecureContext !== false
);

export const loginWithPasskey = async (email, accountType = 'customer') => {
  if (!isPasskeySupported()) {
    throw new Error('Passkeys require a supported browser and a secure website connection.');
  }

  const challenge = await auth.getPasskeyLoginChallenge(email, accountType);
  const response = await startAuthentication({ optionsJSON: challenge.data.options });
  const verification = await auth.verifyPasskeyLogin({
    challengeId: challenge.data.challengeId,
    response,
  });
  return verification.data;
};

export const registerPasskey = async ({ accountType = 'customer', name = 'Passkey device' } = {}) => {
  if (!isPasskeySupported()) {
    throw new Error('Passkeys require a supported browser and a secure website connection.');
  }

  const challenge = await auth.getPasskeyRegisterChallenge(accountType);
  const response = await startRegistration({ optionsJSON: challenge.data.options });
  const verification = await auth.verifyPasskeyRegister({
    challengeId: challenge.data.challengeId,
    response,
    deviceName: name,
  }, accountType);
  return verification.data;
};
