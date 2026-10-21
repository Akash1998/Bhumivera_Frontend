import axios from 'axios';
import { BASE_URL } from '../services/api';

export const nativePushConfigured = import.meta.env.VITE_FCM_ENABLED === 'true';

let activeUserToken = null;
let listenersPromise = null;
let registrationPromise = null;

const addPushListeners = PushNotifications => {
  if (!listenersPromise) {
    listenersPromise = Promise.all([
      PushNotifications.addListener('registration', async token => {
        if (!token?.value || !activeUserToken) return;
        try {
          await axios.post(
            `${BASE_URL}/api/notifications/register-device`,
            {
              token: token.value,
              platform: window.Capacitor.getPlatform(),
            },
            {
              headers: { Authorization: `Bearer ${activeUserToken}` },
            }
          );
        } catch (error) {
          console.error('[PUSH_TOKEN_REGISTRATION_FAILED]', error);
        }
      }),
      PushNotifications.addListener('registrationError', error => {
        console.error('[PUSH_REGISTRATION_ERROR]', error);
      }),
      PushNotifications.addListener('pushNotificationReceived', notification => {
        console.info('[PUSH_NOTIFICATION_RECEIVED]', notification);
      }),
      PushNotifications.addListener('pushNotificationActionPerformed', action => {
        const route = action?.notification?.data?.route;
        if (typeof route === 'string' && route.startsWith('/') && !route.startsWith('//')) {
          window.dispatchEvent(new CustomEvent('bhumivera:deep-link', {
            detail: { target: route },
          }));
        }
      }),
    ]).catch(error => {
      listenersPromise = null;
      throw error;
    });
  }
  return listenersPromise;
};

export const registerPushNotifications = async ({
  PushNotifications,
  userToken,
  requestPermission = false,
}) => {
  activeUserToken = userToken || null;
  if (registrationPromise) return registrationPromise;
  registrationPromise = (async () => {
    await addPushListeners(PushNotifications);
    let permission = await PushNotifications.checkPermissions();
    if (permission.receive === 'prompt' && requestPermission) {
      permission = await PushNotifications.requestPermissions();
    }
    if (permission.receive !== 'granted') return false;

    await PushNotifications.register();
    return true;
  })();
  try {
    return await registrationPromise;
  } finally {
    registrationPromise = null;
  }
};

const runNativePushSetup = async (userToken, requestPermission) => {
  if (typeof window === 'undefined' || !window.Capacitor?.isNativePlatform?.()) {
    return false;
  }
  if (!nativePushConfigured) {
    console.info('[PUSH_NOTIFICATIONS] Skipped: Firebase Cloud Messaging is not configured for this build.');
    return false;
  }

  const { PushNotifications } = await import('@capacitor/push-notifications');
  return registerPushNotifications({ PushNotifications, userToken, requestPermission });
};

export const initPushNotifications = userToken => runNativePushSetup(userToken, false);

export const enablePushNotifications = userToken => runNativePushSetup(userToken, true);
