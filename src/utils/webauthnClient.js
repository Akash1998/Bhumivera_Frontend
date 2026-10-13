import { auth } from '../services/api';

const toBase64Url = value => {
  const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
  let binary = '';
  bytes.forEach(byte => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
};

const fromBase64Url = value => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  const binary = atob(normalized + padding);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

export const isPasskeySupported = () => {
  const hasCredentials = typeof window !== 'undefined' && 'PublicKeyCredential' in window;
  return Boolean(hasCredentials && window.isSecureContext !== false);
};

export const storeBrowserPassword = (email, password, name) => {
  if (typeof window === 'undefined') return false;
  try {
    const store = JSON.parse(localStorage.getItem('savedPasswords') || '{}');
    store[email?.trim().toLowerCase()] = {
      email: email?.trim().toLowerCase(),
      password,
      name,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('savedPasswords', JSON.stringify(store));
    return true;
  } catch (error) {
    console.warn('[STORE_BROWSER_PASSWORD_ERROR]', error);
    return false;
  }
};

export const loginWithPasskey = async email => {
  if (!isPasskeySupported()) {
    throw new Error('This browser does not support passkeys. Please use your password or enable WebAuthn support.');
  }

  const response = await auth.getPasskeyLoginChallenge(email || '');
  const challenge = response?.data?.challenge;
  const allowCredentials = Array.isArray(response?.data?.allowCredentials)
    ? response.data.allowCredentials.map(item => ({
        ...item,
        id: typeof item.id === 'string' ? fromBase64Url(item.id) : item.id,
      }))
    : [];

  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: fromBase64Url(challenge),
      timeout: 60000,
      userVerification: 'preferred',
      allowCredentials,
    },
  });

  const payload = {
    id: assertion.id,
    rawId: toBase64Url(new Uint8Array(assertion.rawId)),
    response: {
      clientDataJSON: toBase64Url(new Uint8Array(assertion.response.clientDataJSON)),
      authenticatorData: toBase64Url(new Uint8Array(assertion.response.authenticatorData)),
      signature: toBase64Url(new Uint8Array(assertion.response.signature)),
      userHandle: assertion.response.userHandle ? toBase64Url(new Uint8Array(assertion.response.userHandle)) : null,
    },
    type: assertion.type,
    authenticatorAttachment: assertion.authenticatorAttachment,
  };

  const verified = await auth.verifyPasskeyLogin(payload);
  return verified.data;
};

export const registerPasskey = async ({ name } = {}) => {
  if (!isPasskeySupported()) {
    throw new Error('This browser does not support passkeys.');
  }

  const challengeReq = await auth.getPasskeyRegisterChallenge();
  const challenge = challengeReq?.data?.challenge;

  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: fromBase64Url(challenge),
      rp: { id: window.location.hostname, name: 'Bhumivera' },
      user: {
        id: fromBase64Url(String(challengeReq.data.userId || 'user')), 
        name: name || 'customer@bhumivera.com',
        displayName: name || 'Bhumivera Customer',
      },
      pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
      authenticatorSelection: { userVerification: 'preferred' },
      timeout: 60000,
      attestation: 'none',
    },
  });

  const payload = {
    id: credential.id,
    rawId: toBase64Url(new Uint8Array(credential.rawId)),
    response: {
      clientDataJSON: toBase64Url(new Uint8Array(credential.response.clientDataJSON)),
      attestationObject: toBase64Url(new Uint8Array(credential.response.attestationObject)),
      transports: credential.response.getTransports ? credential.response.getTransports() : [],
    },
    type: credential.type,
    authenticatorAttachment: credential.authenticatorAttachment,
  };

  const result = await auth.verifyPasskeyRegister(payload);
  return result.data;
};

export default {
  isPasskeySupported,
  loginWithPasskey,
  registerPasskey,
  storeBrowserPassword,
};
