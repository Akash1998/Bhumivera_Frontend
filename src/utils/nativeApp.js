import { Capacitor } from '@capacitor/core';

const INTERNAL_LINK_HOSTS = new Set(['bhumivera.com', 'www.bhumivera.com']);

const resolveInternalRoute = value => {
  try {
    const parsed = new URL(value);
    const target = parsed.protocol === 'bhumivera:'
      ? `/${parsed.hostname}${parsed.pathname}${parsed.search}${parsed.hash}`
      : INTERNAL_LINK_HOSTS.has(parsed.hostname)
        ? `${parsed.pathname}${parsed.search}${parsed.hash}`
        : null;
    return target?.startsWith('/') && !target.startsWith('//') ? target : null;
  } catch (error) {
    console.error('[NATIVE_DEEP_LINK_ERROR]', error);
    return null;
  }
};

const dispatchInternalRoute = value => {
  const target = resolveInternalRoute(value);
  if (!target) return;
  window.__bhumiveraPendingDeepLink = target;
  window.dispatchEvent(new CustomEvent('bhumivera:deep-link', { detail: { target } }));
};

export const initializeNativeApp = async () => {
  if (!Capacitor.isNativePlatform()) return;

  document.documentElement.classList.add('native-app');

  try {
    const [{ App }, { Keyboard, KeyboardResize }, { SplashScreen }, { StatusBar, Style }] = await Promise.all([
      import('@capacitor/app'),
      import('@capacitor/keyboard'),
      import('@capacitor/splash-screen'),
      import('@capacitor/status-bar'),
    ]);

    const nativeOperations = [
      StatusBar.setOverlaysWebView({ overlay: false }),
      StatusBar.setStyle({ style: Style.Light }),
      Keyboard.setResizeMode({ mode: KeyboardResize.Body }),
    ];
    if (Capacitor.getPlatform() === 'android') {
      nativeOperations.push(StatusBar.setBackgroundColor({ color: '#14251c' }));
    }
    const results = await Promise.allSettled(nativeOperations);
    results.filter(result => result.status === 'rejected').forEach(result => {
      console.error('[NATIVE_APP_CONFIGURATION_ERROR]', result.reason);
    });

    await App.addListener('appUrlOpen', ({ url }) => dispatchInternalRoute(url));
    const launchUrl = await App.getLaunchUrl();
    if (launchUrl?.url) dispatchInternalRoute(launchUrl.url);

    try {
      await SplashScreen.hide();
    } catch (error) {
      console.error('[NATIVE_SPLASH_SCREEN_ERROR]', error);
    }
  } catch (error) {
    console.error('[NATIVE_APP_INITIALIZATION_ERROR]', error);
  }
};
