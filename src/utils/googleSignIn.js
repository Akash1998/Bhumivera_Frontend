import { Capacitor } from '@capacitor/core';
import { SocialLogin } from '@capgo/capacitor-social-login';

const GOOGLE_WEB_CLIENT_ID = import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID ||
  '445526551634-kr5t8oq6p1stodd8hf2mdmcpep201j9l.apps.googleusercontent.com';

let initializationPromise;

const initializeGoogleSignIn = async SocialLogin => {
  if (!initializationPromise) {
    const redirectUrl = Capacitor.isNativePlatform()
      ? undefined
      : `${window.location.origin}/`;
    initializationPromise = SocialLogin.initialize({
      google: {
        webClientId: GOOGLE_WEB_CLIENT_ID,
        mode: 'online',
        ...(redirectUrl ? { redirectUrl } : {}),
      },
    }).catch(error => {
      initializationPromise = undefined;
      throw error;
    });
  }
  await initializationPromise;
};

export const requestGoogleIdToken = async () => {
  await initializeGoogleSignIn(SocialLogin);
  const result = await SocialLogin.login({
    provider: 'google',
    options: {
      scopes: ['profile', 'email'],
      filterByAuthorizedAccounts: false,
    },
  });
  const idToken = result.provider === 'google' ? result.result?.idToken : null;
  if (!idToken) {
    throw new Error(Capacitor.isNativePlatform()
      ? 'Google sign-in did not return an identity token. Check the app OAuth client and signing fingerprint.'
      : 'Google sign-in did not return an identity token. Check the Web OAuth client and authorized domain.');
  }
  return idToken;
};
