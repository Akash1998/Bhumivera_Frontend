import React, { useEffect, useState } from 'react';
import { prepareGoogleSignIn, requestGoogleIdToken } from '../utils/googleSignIn';

export default function GoogleSignInButton({ onSignIn, onError, disabled = false }) {
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [initializationError, setInitializationError] = useState('');

  useEffect(() => {
    let active = true;
    prepareGoogleSignIn()
      .catch(error => {
        if (active) {
          setInitializationError(error.message || 'Google sign-in could not be initialized. Try again.');
        }
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleClick = async () => {
    setLoading(true);
    setInitializationError('');
    try {
      await onSignIn(await requestGoogleIdToken());
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || loading || !ready}
        className="flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl border border-[#0B2419]/15 bg-white px-4 py-3 text-sm font-semibold text-[#14251c] shadow-sm transition hover:bg-[#FDFBF7] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span aria-hidden="true" className="font-bold text-lg text-[#4285F4]">G</span>
        {loading ? 'Connecting to Google…' : ready ? 'Continue with Google' : 'Preparing Google sign-in…'}
      </button>
      {initializationError && <p role="alert" className="mt-2 text-xs text-red-700">{initializationError}</p>}
    </>
  );
}
