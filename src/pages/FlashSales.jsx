import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BadgePercent, Check, Clock3, Copy, Gift, LoaderCircle, ShoppingBag, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { coupons as couponsApi } from '../services/api';

const formatPrice = value => `₹${(Number(value) || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const describeOffer = offer => {
  const value = Number(offer.discount_value ?? offer.value) || 0;
  const type = offer.discount_type || offer.type;
  return type === 'percentage' ? `${value}% off` : `${formatPrice(value)} off`;
};

export default function FlashSales() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [copyError, setCopyError] = useState('');
  const [copiedCode, setCopiedCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    couponsApi.getPublicActive().then(({ data }) => {
      if (active) setOffers(Array.isArray(data) ? data : []);
    }).catch(error => {
      console.error('[PUBLIC_OFFERS_LOAD]', error);
      if (active) setLoadError(error.response?.data?.message || 'Offers could not be loaded. Please try again.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const applyOffer = code => {
    sessionStorage.setItem('mini-cart-coupon', code);
    sessionStorage.setItem('mini-cart-checkout', '1');
    navigate('/?cartCheckout=1');
  };

  const copyCode = async code => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setCopyError('');
      window.setTimeout(() => setCopiedCode(current => current === code ? '' : current), 1800);
    } catch (error) {
      console.error('[PUBLIC_OFFER_COPY]', error);
      setCopyError('Could not copy the code. You can still use the Apply offer button.');
    }
  };

  return (
    <main className="min-h-[80svh] bg-[#070a0e] px-4 py-8 text-[#e2e8f0] sm:px-6 sm:py-12 selection:bg-[#d4af37]/30 selection:text-white">
      <div className="mx-auto max-w-6xl">
        <Link to="/shop" className="btn-silver-luxury inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-[#cbd5e1] transition">
          <ArrowLeft size={15}/> Back to shopping
        </Link>
        <header className="relative mt-6 overflow-hidden rounded-[2rem] border border-[#d4af37]/40 two-tone-panel-gold px-6 py-9 text-white shadow-2xl sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-[#d4af37]/20"/>
          <div className="pointer-events-none absolute -right-5 -top-12 h-52 w-52 rounded-full border border-[#d4af37]/20"/>
          <p className="flex items-center gap-2 font-sub-gold text-[10px] tracking-[0.24em]"><Gift size={14} className="text-[#d4af37]"/> Thoughtful extras, curated for you</p>
          <h1 className="mt-3 max-w-2xl font-serif text-3xl leading-tight sm:text-5xl text-white">
            <span className="font-headline-gold">Offers</span> <span className="font-headline-silver">Worth Opening.</span>
          </h1>
          <div className="gold-hairline my-4 max-w-xs" />
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#cbd5e1]">Current privileged coupon offers published by Bhumivera. Choose an offer to take its code straight to checkout.</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#070a0e] px-3.5 py-1.5 text-[11px] font-semibold text-[#fce096]"><BadgePercent size={15} className="text-[#d4af37]"/> Live offers from our store</div>
        </header>

        <section className="mt-8" aria-labelledby="available-offers-title">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div><p className="font-sub-gold text-[10px] tracking-[0.2em]">For your next ritual</p><h2 id="available-offers-title" className="mt-1 font-serif text-2xl text-white">Available offers</h2></div>
            {!loading && <span className="rounded-full bg-[#0d1520] border border-[#d4af37]/30 px-3 py-1.5 text-xs font-semibold text-[#fce096]">{offers.length} {offers.length === 1 ? 'offer' : 'offers'}</span>}
          </div>
          {copyError && <p role="status" className="mb-3 text-xs text-amber-400">{copyError}</p>}

          {loading ? <div className="flex min-h-52 items-center justify-center gap-3 text-sm text-[#fce096]"><LoaderCircle size={18} className="animate-spin text-[#d4af37]"/>Finding current offers…</div>
            : loadError ? <div role="alert" className="rounded-2xl border border-rose-500/30 bg-rose-950/40 p-5 text-sm text-rose-300">{loadError}</div>
              : offers.length === 0 ? <div className="rounded-2xl two-tone-card border border-[#d4af37]/25 px-6 py-12 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#070a0e] border border-[#d4af37]/40 text-[#fce096]"><Tag size={20}/></span>
                <h3 className="mt-4 font-serif text-xl text-white">No public offers right now</h3>
                <p className="mt-2 text-sm text-[#cbd5e1]">New offers added by our team will appear here. Your personal rewards remain in your account.</p>
                <Link to="/shop" className="btn-gold-luxury mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg">Explore the shop <ArrowRight size={15}/></Link>
              </div>
                : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {offers.map(offer => {
                    const code = String(offer.code || '');
                    const minimum = Number(offer.min_order_amount ?? offer.min_order_value) || 0;
                    const maxDiscount = Number(offer.max_discount) || 0;
                    return <article key={code} className="group relative flex min-h-64 flex-col overflow-hidden rounded-2xl two-tone-card border border-[#d4af37]/25 shadow-lg transition duration-200 hover:-translate-y-1 hover:border-[#d4af37]/60 hover:shadow-2xl">
                      <div className="absolute inset-y-0 left-0 w-1.5 bg-[#d4af37]"/>
                      <div className="flex flex-1 flex-col p-5 pl-6">
                        <div className="flex items-start justify-between gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#070a0e] border border-[#d4af37]/30 text-[#fce096]"><Tag size={18}/></span>
                          <span className="rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 px-3 py-1.5 text-xs font-bold text-[#fce096]">{describeOffer(offer)}</span>
                        </div>
                        <h3 className="mt-4 font-serif text-xl text-white">{offer.description || 'A little something for your order'}</h3>
                        <p className="mt-2 text-xs leading-5 text-[#cbd5e1]">Use this offer at checkout{minimum > 0 ? ` on orders of ${formatPrice(minimum)} or more` : ''}{maxDiscount > 0 && (offer.discount_type || offer.type) === 'percentage' ? ` · maximum saving ${formatPrice(maxDiscount)}` : ''}.</p>
                        {offer.valid_until && <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-[#94a3b8]"><Clock3 size={13} className="text-[#d4af37]"/>Valid through {new Date(offer.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
                        <div className="mt-auto pt-5">
                          <div className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-[#d4af37]/40 bg-[#070a0e] px-3 py-2">
                            <code className="truncate font-mono text-sm font-extrabold tracking-wider text-[#fce096]">{code}</code>
                            <button type="button" onClick={() => void copyCode(code)} aria-label={`Copy offer code ${code}`} className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-bold text-[#fce096] hover:bg-[#0d1520]">{copiedCode === code ? <Check size={14}/> : <Copy size={13}/>} {copiedCode === code ? 'Copied' : 'Copy'}</button>
                          </div>
                          <button type="button" onClick={() => applyOffer(code)} className="btn-gold-luxury mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-lg"><ShoppingBag size={15}/> Apply offer <ArrowRight size={15}/></button>
                        </div>
                      </div>
                    </article>;
                  })}
                </div>}
        </section>
      </div>
    </main>
  );
}
