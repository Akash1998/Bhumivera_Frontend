import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';

export const useNativeBackButton = (onModalClose = null) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return undefined;

    let backHandler = null;
    let disposed = false;

    const setupListener = async () => {
      try {
        const { App } = await import('@capacitor/app');
        const handler = await App.addListener('backButton', ({ canGoBack }) => {
          const modalBack = new CustomEvent('bhumivera:native-back', { detail: { handled: false } });
          window.dispatchEvent(modalBack);
          if (modalBack.detail.handled) return;

          if (onModalClose && typeof onModalClose === 'function' && onModalClose()) {
            return;
          }

          if (location.pathname === '/' || location.pathname === '/home') {
            App.minimizeApp();
            return;
          }

          if (canGoBack || window.history.length > 1) {
            navigate(-1);
          } else {
            navigate('/', { replace: true });
          }
        });
        if (disposed) {
          await handler.remove();
          return;
        }
        backHandler = handler;
      } catch (err) {
        console.error('[NATIVE_BACK_BUTTON_INIT_ERROR]', err);
      }
    };

    setupListener();

    return () => {
      disposed = true;
      if (backHandler && typeof backHandler.remove === 'function') {
        void backHandler.remove().catch(error => {
          console.error('[NATIVE_BACK_BUTTON_REMOVE_ERROR]', error);
        });
      }
    };
  }, [navigate, location, onModalClose]);
};
