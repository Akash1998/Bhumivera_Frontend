import React from 'react';
import { ArrowRight, CreditCard, Truck, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { PURCHASE_PROTECTION_DATA } from '../data/bhumiveraUniqueData';

const protectionPillars = [
  {
    icon: Lock,
    title: 'Artisanal Wax-Sealed & Gold-Foil Tamper Custody',
    copy: 'Every Bhumivera bottle is compounded in 250-unit micro-batches and sealed at our cleanroom apothecary with a matte-black and metallic-gold security collar plus an individualized bottle serial.',
    image: PURCHASE_PROTECTION_DATA.sealShieldImage,
    example: 'White-Glove Assurance: Scan your bottle QR or enter your serial on /verify to inspect the digital electrode pH assay and microbiological COA.',
  },
  {
    icon: Truck,
    title: 'Atelier Gravimetric Calibration & Protective Cushioning',
    copy: 'Each parcel is hand-packed with honeycomb cushioning, gravimetrically calibrated to ±0.5g at our dispatch desk, and accompanied by a signed weight certificate.',
    image: PURCHASE_PROTECTION_DATA.scaleShieldImage,
    example: '48-Hour Concierge Promise: If transit compromise ever occurs, our executive concierge coordinates an immediate courtesy replacement.',
  },
  {
    icon: CreditCard,
    title: 'Cryptographic Payment & Atomic Ledger Stewardship',
    copy: 'All transactions are processed via PCI-DSS Level 1 compliant Razorpay/UPI gateways with server-side price locks and instant webhook reconciliation.',
    image: PURCHASE_PROTECTION_DATA.paymentShieldImage,
    example: 'Patron Protection: Pending UPI sessions are automatically reconciled server-to-server so no patron ever experiences an uncredited debit.',
  },
];

export default function PurchaseProtection() {
  return (
    <main className="min-h-screen bg-[#070a0e] text-[#e2e8f0] pb-24 font-sans selection:bg-[#d4af37]/30 selection:text-white">
      <SEO
        title="Artisanal Wax-Sealed Tamper Custody & Patron Stewardship | Bhumivera"
        description="Explore Bhumivera's White-Glove Patron Custody: artisanal wax-sealed tamper collars, ±0.5g cleanroom gravimetric certificates, and 250-bottle serial verification."
        route="/purchase-protection"
      />
      
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-[#070a0e] px-5 py-24 text-white sm:px-8 sm:py-32 border-b border-[#d4af37]/20">
        <div className="absolute inset-0 -z-20 opacity-25">
          <img
            src={PURCHASE_PROTECTION_DATA.heroImage}
            alt="Bhumivera artisanal wax-sealed custody and patron protection"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#070a0e]/95 via-[#070a0e]/85 to-[#070a0e]/60" />
        
        <div className="mx-auto max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#0d1520] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fce096] shadow-sm">
            <Sparkles size={14} className="text-[#d4af37]" aria-hidden="true" /> White-Glove Apothecary Custody &amp; Patron Charter
          </div>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl sm:text-6xl uppercase tracking-wider font-normal leading-tight">
            <span className="font-headline-gold">Artisanal Wax-Sealed</span>{' '}
            <span className="font-headline-silver">Tamper Custody</span>
          </h1>
          <div className="gold-hairline my-5 max-w-xs" />
          <p className="mt-4 max-w-2xl text-xs sm:text-sm leading-7 text-[#cbd5e1] sm:text-base">
            Every Bhumivera micro-batch bottle leaves our cleanroom as a virgin, uncirculated botanical creation—sealed with a gold-foil security collar, gravimetrically verified to ±0.5g, and paired with an online Laboratory Certificate of Analysis.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/verify"
              className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl"
            >
              <Sparkles size={14} /> Verify Bottle Serial &amp; COA
            </Link>
            <Link
              to="/order-tracking"
              className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#cbd5e1]"
            >
              Live Order Tracking <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Pillars Section */}
      <section className="mx-auto grid max-w-7xl gap-7 px-5 py-16 sm:px-8 md:grid-cols-3 lg:px-10">
        {protectionPillars.map(({ icon: Icon, title, copy, image, example }) => (
          <article key={title} className="two-tone-card overflow-hidden rounded-2xl border border-[#d4af37]/25 bg-[#0d1520] shadow-lg flex flex-col transition-all duration-300 hover:border-[#d4af37]/60 hover:-translate-y-1">
            <div className="aspect-[16/10] w-full overflow-hidden bg-[#070a0e] relative">
              <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#d4af37]/35 text-[9px] font-mono font-bold uppercase tracking-wider text-[#fce096]">
                White-Glove Standard
              </div>
            </div>
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#070a0e] text-[#fce096] border border-[#d4af37]/40 flex items-center justify-center shadow-md">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h2 className="mt-4 font-serif text-xl sm:text-2xl text-white font-bold">{title}</h2>
                <p className="mt-3 text-xs sm:text-sm leading-6 text-[#94a3b8]">{copy}</p>
              </div>
              <div className="mt-6 rounded-xl bg-[#070a0e]/90 border border-[#d4af37]/25 p-3.5 text-xs text-[#cbd5e1] flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#fce096] shrink-0 mt-0.5" />
                <span>{example}</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* 100% Sealed Sanitary Custody Banner */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 mb-14">
        <div className="two-tone-panel-gold rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="font-sub-gold inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#070a0e] border border-[#d4af37]/40 text-[10px] tracking-widest">
              <Lock size={12} className="text-[#d4af37]" /> Virgin Apothecary Purity Guarantee
            </span>
            <h2 className="mt-4 font-serif text-2xl sm:text-4xl uppercase tracking-wider font-normal">
              <span className="font-headline-gold">100% Virgin Cleanroom Seal</span>{' '}
              <span className="font-headline-silver">&amp; Non-Circulated Botanicals</span>
            </h2>
            <div className="gold-hairline my-4 max-w-xs" />
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#cbd5e1]">
              Because cold-pressed botanical actives (<strong className="text-white">4% Sea Buckthorn, 3% Charcoal, 90% Seven-Tulsi Extract</strong>) are formulated without harsh synthetic preservatives, every bottle is sealed inside our cleanroom and never recirculated once dispatched—guaranteeing untouched apothecary freshness for every patron.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Footer Strip */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="two-tone-card rounded-2xl border border-white/10 bg-[#0d1520] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold">Explore Verification &amp; Authenticity Portals</h2>
            <p className="mt-2 text-xs sm:text-sm text-[#94a3b8]">
              Track a live parcel, verify your bottle’s artisanal batch serial number, or explore the botanical origin map.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/order-tracking" className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#cbd5e1]">
              Track an Order <ArrowRight size={14} />
            </Link>
            <Link to="/verify" className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">
              <Sparkles size={14} /> Verify Bottle Serial
            </Link>
            <Link to="/provenance" className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#cbd5e1]">
              Provenance Map
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
