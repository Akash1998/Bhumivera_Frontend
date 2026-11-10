import React, { useState } from 'react';
import { requestGoogleIdToken } from '../utils/googleSignIn';

export default function GoogleSignInButton({ onSignIn, onError, disabled = false }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onSignIn(await requestGoogleIdToken());
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className="flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl border border-[#0B2419]/15 bg-white px-4 py-3 text-sm font-semibold text-[#14251c] shadow-sm transition hover:bg-[#FDFBF7] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span aria-hidden="true" className="font-bold text-lg text-[#4285F4]">G</span>
      {loading ? 'Connecting to Google…' : 'Continue with Google'}
    </button>
  );
}
