import React, { useEffect } from 'react';
import { ShieldCheck, Sparkles, AlertCircle, Camera, CheckCircle2, Wallet, Scale, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { RETURNS_COURTESY_DATA } from '../data/bhumiveraUniqueData';

export default function Returns() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans pb-20">
      <SEO
        title="Damaged Items & Instant Courtesy Credit Policy | Bhumivera"
        description="Learn how Bhumivera replaces transit-damaged or leaking bottles or issues 100% spendable Courtesy Wallet Credit with zero reverse shipping."
        route="/returns"
      />
      {/* Hero Section with Unique Real-Life Photograph */}
      <div className="bg-gradient-to-br from-[#0B2419] via-[#1a3828] to-[#0d281c] text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src={RETURNS_COURTESY_DATA.heroImage}
            alt="Bhumivera protective honeycomb packaging and courtesy guarantee"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B2419]/90 via-[#0B2419]/80 to-[#0B2419]/95" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-6">
            <ShieldCheck className="w-4 h-4" /> Hygiene &amp; Courtesy Guarantee · Photographic Proof
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-6 tracking-tight">
            Damaged Items &amp; Courtesy Credit Policy
          </h1>
          <p className="text-base sm:text-lg text-[#FDFBF7]/85 max-w-2xl mx-auto leading-relaxed">
            Because our botanicals (Face Washes, Shampoos &amp; Night Elixirs) are intimate personal-care cosmetics, delivered bottles are not physically returned for hygiene safety. Instead, we provide a <strong className="text-[#D4AF37]">100% Zero-Return Courtesy Replacement or Wallet Credit Guarantee</strong> for any transit damage reported within 48 hours.
          </p>
        </div>
      </div>

      {/* Hygiene Policy Banner */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#0B2419]/10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-600">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 text-center md:text-left flex-1">
            <h2 className="text-lg font-bold text-[#0B2419]">Cosmetics Hygiene &amp; 48-Hour Unboxing Inspection Standard</h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Under the Drugs and Cosmetics Act, 1940 and Consumer Protection (E-Commerce) Rules, 2020, opened or delivered personal-care items cannot be restocked. If your bottle arrives damaged, leaking, or incorrect, you <strong className="text-emerald-700">never have to ship it back</strong>—submit your unboxing proof within <strong>48 hours of delivery</strong> for an immediate replacement or 100% Bhumivera Wallet credit.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('bhumivera:open-support-chat', { detail: { prompt: 'My item arrived damaged, how do I get a replacement or courtesy credit?' } }))}
            className="px-5 py-3 rounded-2xl bg-[#0B2419] text-[#D4AF37] font-bold text-xs hover:bg-[#153e2b] transition-all shrink-0 flex items-center gap-2 shadow-md"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Ask Concierge Guide
          </button>
        </div>
      </div>

      {/* 3-Step Real-Life Photographic Inspection Guide */}
      <section className="max-w-6xl mx-auto px-4 mt-14">
        <div className="mb-8">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b4226]">
            Step-by-Step Visual Protocol
          </span>
          <h2 className="mt-1 font-serif text-3xl text-[#0B2419]">
            How to Document Your Parcel for Instant Courtesy Resolution
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {RETURNS_COURTESY_DATA.guideStepImages.map((g) => (
            <article key={g.step} className="overflow-hidden rounded-2xl border border-[#0B2419]/15 bg-white shadow-sm">
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#0B2419]">
                <img src={g.image} alt={g.title} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-800">{g.step}</span>
                <h3 className="mt-2 font-serif text-xl font-bold text-[#0B2419]">{g.title}</h3>
                <p className="mt-2 text-xs leading-6 text-stone-600">{g.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Real-Life Resolved Courtesy Examples */}
      <section className="max-w-6xl mx-auto px-4 mt-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-800">
              Real-Life Courtesy Precedents
            </span>
            <h2 className="mt-1 font-serif text-3xl text-[#0B2419]">
              Verified Damaged-Arrival Resolutions
            </h2>
          </div>
          <Link
            to="/returns-centre"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B2419] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#D4AF37]"
          >
            Open RMA Resolution Centre <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {RETURNS_COURTESY_DATA.realLifeDamageCases.map((c) => (
            <article key={c.caseId} className="grid sm:grid-cols-[0.45fr_0.55fr] overflow-hidden rounded-2xl border border-[#0B2419]/15 bg-white shadow-sm">
              <img src={c.image} alt={c.scenario} loading="lazy" className="h-full w-full object-cover min-h-[200px]" />
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <span className="rounded bg-[#eef0e6] px-2.5 py-1 font-mono text-[10px] font-bold text-[#0B2419]">
                    {c.caseId}
                  </span>
                  <h3 className="mt-3 font-serif text-xl font-bold text-[#0B2419]">{c.scenario}</h3>
                  <p className="mt-2 text-xs leading-5 text-stone-600">{c.evidenceUsed}</p>
                </div>
                <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-900">
                  {c.resolution}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
