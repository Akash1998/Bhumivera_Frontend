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
    <main className="min-h-[80svh] bg-[#f4f1e9] px-4 py-8 text-[#14251c] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link to="/shop" className="inline-flex items-center gap-2 rounded-full border border-[#d9dfd2] bg-[#fbfaf5] px-3 py-2 text-xs font-semibold text-[#526b4d] transition hover:border-[#526b4d]">
          <ArrowLeft size={15}/> Back to shopping
        </Link>
        <header className="relative mt-6 overflow-hidden rounded-[2rem] border border-[#dce3d5] bg-[#14251c] px-6 py-9 text-white shadow-lg sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10"/>
          <div className="pointer-events-none absolute -right-5 -top-12 h-52 w-52 rounded-full border border-white/10"/>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#d9e5c8]"><Gift size={14}/> Thoughtful extras, picked for you</p>
          <h1 className="mt-3 max-w-2xl font-serif text-3xl leading-tight sm:text-5xl">Offers worth opening.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">Current coupon offers published by Bhumivera. Choose an offer to take its code straight to checkout.</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-semibold text-[#e8efdf]"><BadgePercent size={15}/> Live offers from our store</div>
        </header>

        <section className="mt-8" aria-labelledby="available-offers-title">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#75836b]">For your next ritual</p><h2 id="available-offers-title" className="mt-1 font-serif text-2xl">Available offers</h2></div>
            {!loading && <span className="rounded-full bg-[#e8eadd] px-3 py-1.5 text-xs font-semibold text-[#526b4d]">{offers.length} {offers.length === 1 ? 'offer' : 'offers'}</span>}
          </div>
          {copyError && <p role="status" className="mb-3 text-xs text-amber-800">{copyError}</p>}

          {loading ? <div className="flex min-h-52 items-center justify-center gap-3 text-sm text-[#526b4d]"><LoaderCircle size={18} className="animate-spin"/>Finding current offers…</div>
            : loadError ? <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">{loadError}</div>
              : offers.length === 0 ? <div className="rounded-2xl border border-[#dfe3d8] bg-[#fbfaf5] px-6 py-12 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e8eadd] text-[#526b4d]"><Tag size={20}/></span>
                <h3 className="mt-4 font-serif text-xl">No public offers right now</h3>
                <p className="mt-2 text-sm text-stone-600">New offers added by our team will appear here. Your personal rewards remain in your account.</p>
                <Link to="/shop" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#14251c] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">Explore the shop <ArrowRight size={15}/></Link>
              </div>
                : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {offers.map(offer => {
                    const code = String(offer.code || '');
                    const minimum = Number(offer.min_order_amount ?? offer.min_order_value) || 0;
                    const maxDiscount = Number(offer.max_discount) || 0;
                    return <article key={code} className="group relative flex min-h-64 flex-col overflow-hidden rounded-2xl border border-[#dfe3d8] bg-[#fbfaf5] shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#9aa98b] hover:shadow-md">
                      <div className="absolute inset-y-0 left-0 w-1.5 bg-[#758b5b]"/>
                      <div className="flex flex-1 flex-col p-5 pl-6">
                        <div className="flex items-start justify-between gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8eadd] text-[#526b4d]"><Tag size={18}/></span>
                          <span className="rounded-full bg-[#f0e8d7] px-3 py-1.5 text-xs font-extrabold text-[#765d17]">{describeOffer(offer)}</span>
                        </div>
                        <h3 className="mt-4 font-serif text-xl text-[#14251c]">{offer.description || 'A little something for your order'}</h3>
                        <p className="mt-2 text-xs leading-5 text-stone-600">Use this offer at checkout{minimum > 0 ? ` on orders of ${formatPrice(minimum)} or more` : ''}{maxDiscount > 0 && (offer.discount_type || offer.type) === 'percentage' ? ` · maximum saving ${formatPrice(maxDiscount)}` : ''}.</p>
                        {offer.valid_until && <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-[#687466]"><Clock3 size={13}/>Valid through {new Date(offer.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
                        <div className="mt-auto pt-5">
                          <div className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-[#c9d1bf] bg-white px-3 py-2">
                            <code className="truncate font-mono text-sm font-extrabold tracking-wider text-[#263d31]">{code}</code>
                            <button type="button" onClick={() => void copyCode(code)} aria-label={`Copy offer code ${code}`} className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-bold text-[#526b4d] hover:bg-[#f1f4eb]">{copiedCode === code ? <Check size={14}/> : <Copy size={13}/>} {copiedCode === code ? 'Copied' : 'Copy'}</button>
                          </div>
                          <button type="button" onClick={() => applyOffer(code)} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#14251c] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#294434]"><ShoppingBag size={15}/> Apply offer <ArrowRight size={15}/></button>
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
