import React, { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Bell, Check, MapPin, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { enablePushNotifications, nativePushConfigured } from '../utils/pushNotifications';

const SETUP_KEY = 'bhumivera-native-permissions-v1';

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
  const [requesting, setRequesting] = useState(false);
  const [permissionResults, setPermissionResults] = useState(null);

  if (!Capacitor.isNativePlatform() || completed) return children;

  const finishSetup = () => {
    try {
      localStorage.setItem(SETUP_KEY, 'complete');
    } catch (error) {
      console.error('[NATIVE_PERMISSION_SETUP_STORAGE]', error);
    }
    setCompleted(true);
  };

  const requestPermissions = async () => {
    setRequesting(true);
    const results = {};
    try {
      const { Geolocation } = await import('@capacitor/geolocation');
      const current = await Geolocation.checkPermissions();
      const location = current.location === 'granted'
        ? current
        : await Geolocation.requestPermissions({ permissions: ['location'] });
      results.location = location.location === 'granted' ? 'Allowed' : 'Not allowed';
    } catch (error) {
      console.error('[NATIVE_LOCATION_PERMISSION_REQUEST]', error);
      results.location = 'Could not be requested. Check Android Settings and device location services.';
    }

    if (nativePushConfigured) {
      try {
        results.notifications = await enablePushNotifications(token) ? 'Allowed' : 'Not allowed';
      } catch (error) {
        console.error('[NATIVE_NOTIFICATION_PERMISSION_REQUEST]', error);
        results.notifications = 'Could not be requested. Check Android Settings.';
      }
    } else {
      console.warn('[NATIVE_NOTIFICATIONS_UNAVAILABLE] Firebase configuration is missing from this Android build.');
      results.notifications = 'Unavailable in this build (Firebase is not configured).';
    }

    setRequesting(false);
    setPermissionResults(results);
  };

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#11120F] px-4 py-8 text-[#F4EFE6]">
      <section className="w-full max-w-lg rounded-3xl border border-[#D4AF37]/30 bg-[#1B1C18] p-6 shadow-2xl sm:p-9">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4AF37]/35 bg-[#D4AF37]/10 text-[#FCE096]">
          <ShieldCheck size={28} />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D4AF37]">A few choices before you begin</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-white">Your app, your permissions</h1>
        <p className="mt-3 text-sm leading-6 text-[#D4D0C5]">
          Choose whether to allow location and notifications. You can continue without either permission and change your choices later in Android Settings.
        </p>

        <div className="mt-6 space-y-3">
          <div className="flex gap-3 rounded-2xl border border-white/10 bg-black/15 p-4">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#D4AF37]" />
            <div>
              <h2 className="text-sm font-semibold text-white">Precise location</h2>
              <p className="mt-1 text-xs leading-5 text-[#B8B5AA]">
                Used when you choose address or delivery-location features. Select “Precise” in Android’s prompt for accurate coordinates; Android may also offer Approximate.
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-2xl border border-white/10 bg-black/15 p-4">
            <Bell className="mt-0.5 h-5 w-5 shrink-0 text-[#D4AF37]" />
            <div>
              <h2 className="text-sm font-semibold text-white">Notifications</h2>
              <p className="mt-1 text-xs leading-5 text-[#B8B5AA]">
                {nativePushConfigured
                  ? 'Allow notifications for relevant order updates, or deny the Android permission prompt.'
                  : 'Push delivery is not configured in this build, so no notification permission will be requested.'}
              </p>
            </div>
          </div>
        </div>

        {permissionResults && (
          <div className="mt-4 space-y-1 text-xs leading-5 text-[#B8B5AA]" role="status" aria-live="polite">
            {Object.entries(permissionResults).map(([permission, result]) => (
              <p key={permission}>{permission === 'location' ? 'Location' : 'Notifications'}: {result}</p>
            ))}
          </div>
        )}

        <div className="mt-7 grid gap-3">
          <button
            type="button"
            onClick={permissionResults ? finishSetup : requestPermissions}
            disabled={requesting}
            className="btn-gold-luxury inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#14291F] disabled:cursor-wait disabled:opacity-60"
          >
            {requesting
              ? 'Waiting for your choices…'
              : permissionResults
                ? <><Check size={16} /> Continue to the app</>
                : <><Check size={16} /> Continue &amp; choose permissions</>}
          </button>
          <button
            type="button"
            onClick={finishSetup}
            disabled={requesting}
            className="min-h-11 rounded-xl border border-white/15 px-4 py-2.5 text-xs font-semibold text-[#D4D0C5] transition hover:border-[#D4AF37]/50 hover:text-white disabled:opacity-60"
          >
            Not now — continue without permissions
          </button>
        </div>
      </section>
    </main>
  );
}
