// Native push notification device registration
import axios from 'axios';
import { BASE_URL } from '../services/api';

export const initPushNotifications = async (userToken) => {
  if (typeof window === 'undefined' || !window.Capacitor?.isNativePlatform?.()) {
    return;
  }

  try {
    const { PushNotifications } = await import('@capacitor/push-notifications');

    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      console.warn('[PUSH_NOTIFICATIONS] Permission not granted.');
      return;
    }

    await PushNotifications.register();

    PushNotifications.addListener('registration', async (token) => {
      if (!token?.value || !userToken) return;
      try {
        await axios.post(
          `${BASE_URL}/api/notifications/register-device`,
          {
            token: token.value,
            platform: window.Capacitor.getPlatform(),
          },
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );
      } catch (err) {
        console.error('[PUSH_TOKEN_REGISTRATION_FAILED]', err);
      }
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('[PUSH_REGISTRATION_ERROR]', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.info('[PUSH_NOTIFICATION_RECEIVED]', notification);
    });
  } catch (error) {
    console.warn('[PUSH_NOTIFICATIONS_INITIALIZATION_ERROR]', error);
  }
};
