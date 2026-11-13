import React, { useRef, useState } from 'react';
import { ArrowRight, Clock3, Leaf, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import PromoterPortal from './affiliate/PromoterPortal';

export default function Promotions() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const emailInput = useRef(null);
  const [email, setEmail] = useState('');

  if (loading) {
    return <main className="min-h-screen bg-[#07140e] px-4 py-20 text-center text-[#9BB0A5]">Loading your account…</main>;
  }

  if (user) return <PromoterPortal />;

  const registrationPath = email.trim()
    ? `/register?email=${encodeURIComponent(email.trim())}`
    : '/register';
  const accountState = { from: '/promotions' };

  return (
    <main className="min-h-screen bg-[#07140e] px-4 py-12 text-[#DFD7C4] sm:py-20">
      <SEO
        title="Apply to Become a Bhumivera Promoter"
        description="Register your interest in the Bhumivera promoter program. Applications are reviewed before promoter accounts and codes are activated."
        route="/promotions"
      />
      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#102219] text-[#D4AF37]">
            <Leaf size={22} />
          </span>
          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">Bhumivera creator &amp; promoter program</p>
          <h1 className="mt-3 font-serif text-3xl font-bold text-white sm:text-5xl">Start your promoter application</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#9BB0A5]">
            Begin with the email for your Bhumivera account. After signing in or creating and verifying an account, you can submit your profile for review.
          </p>
        </header>

        <section className="mt-9 rounded-2xl border border-[#315541] bg-[#102219] p-5 shadow-2xl sm:p-8">
          <div className="flex items-start gap-3 rounded-xl border border-[#D4AF37]/20 bg-[#0b1c14] p-4">
            <Clock3 size={18} className="mt-0.5 shrink-0 text-[#D4AF37]" />
            <p className="text-xs leading-5 text-[#C8D5CC]">
              Applications are reviewed by our team. We aim to send an activation update within <strong className="text-white">12–24 hours</strong>. Submitting an application does not activate a promoter account or make its code usable.
            </p>
          </div>

          <form
            className="mt-6 space-y-4"
            onSubmit={event => {
              event.preventDefault();
              navigate(registrationPath, { state: accountState });
            }}
          >
            <label htmlFor="promotions-email" className="block space-y-2 text-xs font-semibold text-[#C8D5CC]">
              Email address for your Bhumivera account
              <input
                id="promotions-email"
                ref={emailInput}
                required
                type="email"
                autoComplete="email"
                maxLength={254}
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#315541] bg-[#07140e] px-4 py-3 text-sm text-white outline-none transition focus:border-[#D4AF37]"
              />
              <span className="block font-normal leading-5 text-[#82998D]">We associate the application with the verified email on your customer account.</span>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-3 text-xs font-bold text-[#102219] transition hover:bg-[#FCE096]"
              >
                Create and verify account <ArrowRight size={15} />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!emailInput.current?.reportValidity()) return;
                  navigate('/login', { state: { ...accountState, email: email.trim() } });
                }}
                className="inline-flex items-center justify-center rounded-xl border border-[#315541] px-4 py-3 text-xs font-bold text-white transition hover:border-[#D4AF37]"
              >
                I already have an account
              </button>
            </div>
          </form>

          <div className="mt-6 grid gap-3 border-t border-[#315541] pt-5 text-xs leading-5 text-[#9BB0A5] sm:grid-cols-3">
            <p className="flex gap-2"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#D4AF37]" />Verify your account email first.</p>
            <p className="flex gap-2"><ArrowRight size={15} className="mt-0.5 shrink-0 text-[#D4AF37]" />Submit your social profile after sign-in.</p>
            <p className="flex gap-2"><Clock3 size={15} className="mt-0.5 shrink-0 text-[#D4AF37]" />Wait for the team’s activation decision.</p>
          </div>
        </section>

        <p className="mt-5 text-center text-[11px] leading-5 text-[#82998D]">
          By applying, you agree to follow the <Link to="/legal/warranty-affiliate-b2b" className="text-[#FCE096] underline underline-offset-2">Bhumivera partner terms</Link>. An application is not a promise of acceptance or earnings.
        </p>
      </div>
    </main>
  );
}
