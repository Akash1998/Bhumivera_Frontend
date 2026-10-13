import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useNativeBackButton = (onModalClose = null) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined' || !window.Capacitor?.isNativePlatform?.()) {
      return;
    }

    let backHandler = null;

    const setupListener = async () => {
      try {
        const { App } = await import('@capacitor/app');
        backHandler = await App.addListener('backButton', ({ canGoBack }) => {
          if (onModalClose && typeof onModalClose === 'function' && onModalClose()) {
            return;
          }

          if (location.pathname === '/' || location.pathname === '/home') {
            App.minimizeApp();
            return;
          }

          if (canGoBack) {
            navigate(-1);
          } else {
            navigate('/', { replace: true });
          }
        });
      } catch (err) {
        console.warn('[NATIVE_BACK_BUTTON_INIT_ERROR]', err);
      }
    };

    setupListener();

    return () => {
      if (backHandler && typeof backHandler.remove === 'function') {
        backHandler.remove();
      }
    };
  }, [navigate, location, onModalClose]);
};
