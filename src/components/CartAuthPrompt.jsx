import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, ShoppingBag, X } from 'lucide-react';
import { auth as authApi } from '../services/api';
import { useCart } from '../context/CartContext';

export default function CartAuthPrompt() {
  const { isCartAuthPromptOpen, closeCartAuthPrompt } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isCartAuthPromptOpen) return null;

  const continueToAuthentication = async event => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authApi.checkAccountExists(email.trim());
      const returnParams = new URLSearchParams(location.search);
      returnParams.set('openCart', '1');
      const returnTo = `${location.pathname}?${returnParams.toString()}`;
      closeCartAuthPrompt({ keepPending: true });
      if (response.data?.accountExists) {
        navigate('/login', { state: { email: email.trim(), from: returnTo } });
      } else {
        navigate(`/register?email=${encodeURIComponent(email.trim())}`, { state: { from: returnTo } });
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.normalized?.message || 'Could not check this email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={event => {
        if (event.target === event.currentTarget) closeCartAuthPrompt();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-auth-title"
        className="relative w-full max-w-md rounded-3xl border border-[#D4AF37]/35 bg-[#102219] p-7 text-[#FDFBF7] shadow-2xl sm:p-9"
      >
        <button
          type="button"
          onClick={() => closeCartAuthPrompt()}
          className="absolute right-4 top-4 rounded-full p-2 text-[#DFD7C4] transition hover:bg-white/10 hover:text-white"
          aria-label="Close sign-in prompt"
        >
          <X size={18} />
        </button>
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/35 bg-[#D4AF37]/10 text-[#FCE096]">
          <ShoppingBag size={22} />
        </div>
        <h2 id="cart-auth-title" className="font-serif text-2xl font-semibold">Sign in to add to your bag</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#DFD7C4]">
          Enter your email and we’ll help you sign in or join Bhumivera. Your saved bag will be kept.
        </p>
        <form onSubmit={continueToAuthentication} className="mt-6 space-y-4">
          <label htmlFor="cart-auth-email" className="sr-only">Email address</label>
          <div className="relative">
            <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
            <input
              id="cart-auth-email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/15 bg-black/20 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-[#D4AF37]"
            />
          </div>
          {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-gold-luxury flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-[#14291F] disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? 'Checking email...' : <>Continue <ArrowRight size={15} /></>}
          </button>
        </form>
      </section>
    </div>
  );
}
