import React, { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { users as usersApi } from '../services/api';

const cleanPhone = value => String(value || '').replace(/[\s-]/g, '');
const isValidPhone = value => /^\+?[0-9]{10,15}$/.test(cleanPhone(value));

export default function PhoneRequiredGate({ children }) {
  const { user, isAuthenticated, updateUser } = useAuth();
  const [checking, setChecking] = useState(false);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const isCustomer = isAuthenticated && user?.role === 'customer';
  const missingPhone = isCustomer && !String(user?.phone || '').trim();

  useEffect(() => {
    if (!missingPhone) return undefined;
    let active = true;
    setChecking(true);
    usersApi
      .getProfile()
      .then(({ data }) => {
        const stored = data?.phone || data?.data?.phone;
        if (active && stored) updateUser({ phone: stored });
      })
      .catch(() => {})
      .finally(() => active && setChecking(false));
    return () => {
      active = false;
    };
    // Only re-check when the signed-in account changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missingPhone, user?.id]);

  if (!missingPhone) return children;
  if (checking) return null;

  const submit = async event => {
    event.preventDefault();
    if (!isValidPhone(phone)) {
      setError('Enter a valid mobile number (10 to 15 digits).');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const value = cleanPhone(phone);
      await usersApi.updateProfile({ name: user?.name || user?.email?.split('@')[0] || 'Customer', phone: value });
      updateUser({ phone: value });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save your mobile number. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-[#0b1a12] p-5 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-[#D4AF37]/40 bg-[#14291F] p-6 text-[#FAF7F2] shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#102219] text-[#D4AF37]">
          <Phone size={24} />
        </div>
        <h1 className="mt-4 text-center font-serif text-2xl font-bold text-[#D4AF37]">Add your mobile number</h1>
        <p className="mt-2 text-center text-xs text-[#DFD7C4]">
          A mobile number is required for order updates and delivery. You can continue once it is saved.
        </p>
        <label htmlFor="required-phone" className="mt-5 block text-[11px] font-semibold uppercase tracking-wider text-[#FCE096]">
          Mobile number
        </label>
        <input
          id="required-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          autoFocus
          required
          value={phone}
          onChange={event => setPhone(event.target.value)}
          placeholder="+91 98765 43210"
          className="mt-1.5 w-full rounded-xl border border-[#244A38] bg-[#102219] px-3.5 py-3 text-sm text-white outline-none focus:border-[#D4AF37]"
        />
        {error && <p role="alert" className="mt-2 text-xs text-rose-300">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="btn-gold-luxury mt-5 min-h-12 w-full rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-wider disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save & continue'}
        </button>
      </form>
    </div>
  );
}
