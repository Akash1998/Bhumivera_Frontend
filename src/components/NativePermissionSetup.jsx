import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { useAuth } from '../context/AuthContext';

const SETUP_KEY = 'bhumivera-native-permissions-v2';

const hasCompletedSetup = () => {
  try {
    return localStorage.getItem(SETUP_KEY) === 'complete';
  } catch (error) {
    console.error('[NATIVE_PERMISSION_SETUP_STORAGE]', error);
    return false;
  }
};

export default function NativePermissionSetup({ children }) {
  const { token } = useAuth();
  const [completed, setCompleted] = useState(hasCompletedSetup);

  const finishSetup = () => {
    try {
      localStorage.setItem(SETUP_KEY, 'complete');
    } catch (error) {
      console.error('[NATIVE_PERMISSION_SETUP_STORAGE]', error);
    }
    setCompleted(true);
  };

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || completed) return;

    let isMounted = true;

    const requestAllNativePermissions = async () => {
      // 1. Notification Permission (Push Notifications)
      try {
        const { PushNotifications } = await import('@capacitor/push-notifications');
        const notifState = await PushNotifications.checkPermissions();
        if (notifState.receive !== 'granted') {
          await PushNotifications.requestPermissions();
        }
      } catch (err) {
        console.warn('[NATIVE_PUSH_PERMISSION_ERROR]', err);
      }

      // Small pause between system dialogs for smooth OS transition
      await new Promise((resolve) => setTimeout(resolve, 250));

      // 2. Camera Permission (Verification QR Scan & Review Media)
      try {
        const { Camera } = await import('@capacitor/camera');
        const cameraState = await Camera.checkPermissions();
        if (cameraState.camera !== 'granted') {
          await Camera.requestPermissions({ permissions: ['camera'] });
        }
      } catch (err) {
        console.warn('[NATIVE_CAMERA_PERMISSION_ERROR]', err);
      }

      // Small pause between system dialogs
      await new Promise((resolve) => setTimeout(resolve, 250));

      // 3. Precise Location Permission (Delivery & Checkout Coordinates)
      try {
        const { Geolocation } = await import('@capacitor/geolocation');
        const geoState = await Geolocation.checkPermissions();
        if (geoState.location !== 'granted') {
          await Geolocation.requestPermissions({ permissions: ['location'] });
        }
      } catch (err) {
        console.warn('[NATIVE_LOCATION_PERMISSION_ERROR]', err);
      }

      // Automatically open the app without requiring any extra user button clicks
      if (isMounted) {
        finishSetup();
      }
    };

    requestAllNativePermissions();

    return () => {
      isMounted = false;
    };
  }, [completed, token]);

  if (!Capacitor.isNativePlatform() || completed) return children;

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#10120F] px-6 text-[#F4EFE6] select-none">
      <div className="relative flex flex-col items-center text-center">
        {/* Luxury Gold Orbit & Brand Crest */}
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37] border-r-[#FCE096] animate-spin" style={{ animationDuration: '1.4s' }} />
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-gradient-to-br from-[#1C382B] to-[#102219] shadow-[0_0_25px_rgba(212,175,55,0.25)]">
            <span className="font-serif text-2xl font-bold text-[#FCE096]">BV</span>
          </div>
        </div>

        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-[#D4AF37]">
          The Transparent Maison
        </p>
        <h1 className="mt-2 font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] text-white">
          BHUMIVERA
        </h1>
        <div className="gold-hairline my-4 w-16" />
        <p className="max-w-xs text-xs font-light text-[#B8B5AA] leading-relaxed">
          Calibrating device permissions for botanical verification, secure orders, and updates…
        </p>
      </div>
    </main>
  );
}
