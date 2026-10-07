import React, { useEffect, useState } from 'react';
import { ArrowRight, Check, Copy, Gift, LoaderCircle, ShieldCheck } from 'lucide-react';
import { gamification } from '../services/api';

const SLICES = [
  { label: '5% OFF', reward: '5% off, up to ₹200' },
  { label: '10% OFF', reward: '10% off, up to ₹500' },
  { label: '₹250 OFF', reward: '₹250 off' },
  { label: '₹500 OFF', reward: '₹500 off' },
];

export default function SpinRegistration() {
  const [registrationId, setRegistrationId] = useState('');
  const [email, setEmail] = useState('');
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRegistrationId(params.get('id') || '');
    setEmail(sessionStorage.getItem('spin-registration-email') || '');
  }, []);

  const handleSpin = async event => {
    event.preventDefault();
    setError('');
    setResult(null);
    setSpinning(true);

    try {
      const response = await gamification.spin({ registrationId: registrationId.trim(), email: email.trim() });
      const reward = response.data;
      const sliceIndex = Math.max(0, SLICES.findIndex(slice => slice.reward === reward.reward));
      const targetAngle = 360 - (sliceIndex * 90 + 45);
      const currentAngle = ((rotation % 360) + 360) % 360;
      setRotation(rotation + 5 * 360 + ((targetAngle - currentAngle + 360) % 360));
      await new Promise(resolve => setTimeout(resolve, 2800));
      setResult(reward);
    } catch (requestError) {
      setError(requestError.normalized?.message || requestError.response?.data?.message || 'Could not verify this registration. Check the ID and email, then try again.');
    } finally {
      setSpinning(false);
    }
  };

  const copyCoupon = async () => {
    try {
      await navigator.clipboard.writeText(result.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setError('Copy is unavailable in this browser. Select the coupon code to copy it.');
    }
  };

  return (
    <main className="min-h-screen px-4 py-10 text-white" style={{ background: 'radial-gradient(circle at 50% 0%, #183c43 0%, #101b25 42%, #101419 100%)' }}>
      <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 border-b border-emerald-300/40 pb-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-200"><ShieldCheck size={15}/> Warranty reward</div>
          <div>
            <h1 className="max-w-xl text-4xl font-black leading-tight sm:text-5xl">Your purchase deserves a little luck.</h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-300">Verify the warranty registration and reveal a single-use reward for your next order.</p>
          </div>

          <form onSubmit={handleSpin} className="max-w-lg space-y-4 border-t border-white/10 pt-6">
            <label className="block text-sm font-semibold text-slate-200">Warranty registration ID
              <input required inputMode="numeric" value={registrationId} onChange={event => setRegistrationId(event.target.value)} placeholder="Enter registration ID" className="mt-2 w-full border border-white/15 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-300" />
            </label>
            <label className="block text-sm font-semibold text-slate-200">Registration email
              <input required type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="Email used for warranty registration" className="mt-2 w-full border border-white/15 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-300" />
            </label>
            <button type="submit" disabled={spinning || !registrationId.trim() || !email.trim()} className="inline-flex w-full items-center justify-center gap-2 bg-emerald-300 px-5 py-3.5 font-bold text-slate-950 transition-colors hover:bg-emerald-200 disabled:cursor-wait disabled:opacity-60 sm:w-auto">
              {spinning ? <><LoaderCircle size={18} className="animate-spin"/> Revealing reward…</> : <>Spin for your reward <ArrowRight size={18}/></>}
            </button>
          </form>
          {error && <p role="alert" className="max-w-lg border-l-2 border-rose-400 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
          {result && (
            <div aria-live="polite" className="max-w-lg border border-emerald-300/40 bg-emerald-300/10 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">Reward unlocked</p>
              <p className="mt-2 text-2xl font-black">{result.reward}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <code className="select-all border border-white/20 bg-black/25 px-3 py-2 font-mono text-lg tracking-wider">{result.couponCode}</code>
                <button type="button" onClick={copyCoupon} className="inline-flex items-center gap-2 border border-white/20 px-3 py-2 text-sm font-semibold hover:bg-white/10">
                  {copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? 'Copied' : 'Copy code'}
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-300">One use, valid for 30 days. Minimum order requirements apply.</p>
            </div>
          )}
        </section>

        <section className="flex flex-col items-center gap-6" aria-label="Reward wheel">
          <div className="relative aspect-square w-[min(78vw,380px)]">
            <div className="absolute -top-2 left-1/2 z-10 h-0 w-0 -translate-x-1/2 border-x-[13px] border-t-[24px] border-x-transparent border-t-white drop-shadow-lg" />
            <div className="absolute inset-0 rounded-full border-[10px] border-white/80 shadow-[0_24px_70px_rgba(0,0,0,0.45)] transition-transform duration-[2800ms] [transition-timing-function:cubic-bezier(0.12,0.78,0.12,1)]" style={{ transform: `rotate(${rotation}deg)`, background: 'conic-gradient(#e56b45 0deg 90deg, #147d71 90deg 180deg, #d7a63d 180deg 270deg, #355b8c 270deg 360deg)' }}>
              {SLICES.map((slice, index) => <span key={slice.label} className="absolute left-1/2 top-[13%] -translate-x-1/2 text-sm font-black drop-shadow" style={{ transform: `translateX(-50%) rotate(${index * 90 + 45}deg)`, transformOrigin: '50% 175px' }}>{slice.label}</span>)}
              <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-slate-950 text-emerald-200 shadow-xl"><Gift size={25}/></div>
            </div>
          </div>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">One verified registration · One reward</p>
        </section>
      </div>
    </main>
  );
}
