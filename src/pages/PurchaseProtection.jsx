import React from 'react';
import { ArrowRight, CreditCard, Truck, ShieldCheck, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { PURCHASE_PROTECTION_DATA } from '../data/bhumiveraUniqueData';

const protectionPillars = [
  {
    icon: CreditCard,
    title: 'Cryptographic Payment & Webhook Lock',
    copy: 'All online transactions are processed via PCI-DSS Level 1 compliant Razorpay/UPI gateways. Checkout totals are locked server-side, and atomic ledger reconciliation prevents double-debit loss.',
    image: PURCHASE_PROTECTION_DATA.paymentShieldImage,
    example: 'Real-Life Protection: Pending UPI transactions are automatically reconciled via server-to-server webhook checks.',
  },
  {
    icon: Truck,
    title: 'Digital Weight-Scan & Bubble-Wrap Dispatch',
    copy: 'Every parcel is cushioned with bubble wrap and weighed before the courier label is prepared.',
    image: PURCHASE_PROTECTION_DATA.scaleShieldImage,
    example: 'Real-Life Protection: Pre-dispatch weight certificates protect patrons against transit pilferage.',
  },
  {
    icon: Lock,
    title: 'Tamper-Evident Neck Seal & Serial Genuinity',
    copy: 'Every Bhumivera bottle carries a matte-black and gold tamper-evident security strip over the cap collar plus an artisanal bottle serial number verifying small-batch compounding.',
    image: PURCHASE_PROTECTION_DATA.sealShieldImage,
    example: 'Real-Life Protection: Scan your bottle QR or enter the serial on /verify to inspect the lab pH calibration and purity assay.',
  },
];

export default function PurchaseProtection() {
  return (
    <main className="min-h-screen bg-[#070a0e] text-[#e2e8f0] pb-24 font-sans selection:bg-[#d4af37]/30 selection:text-white">
      <SEO
        title="Sanitary Custody & Purchase Protection Shield | Bhumivera"
        description="Explore Bhumivera's 3-pillar Purchase Protection Shield: PCI-DSS payment reconciliation, digital scale dispatch weight logs, and tamper-evident bottle seals."
        route="/purchase-protection"
      />
      
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-[#070a0e] px-5 py-24 text-white sm:px-8 sm:py-32 border-b border-[#d4af37]/20">
        <div className="absolute inset-0 -z-20 opacity-25">
          <img
            src={PURCHASE_PROTECTION_DATA.heroImage}
            alt="Bhumivera purchase and order protection"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#070a0e]/95 via-[#070a0e]/85 to-[#070a0e]/60" />
        
        <div className="mx-auto max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#0d1520] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fce096] shadow-sm">
            <Sparkles size={14} className="text-[#d4af37]" aria-hidden="true" /> 3-Pillar Buyer Protection &amp; Artisanal Custody
          </div>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl sm:text-6xl uppercase tracking-wider font-normal leading-tight">
            <span className="font-headline-gold">Sanitary Custody</span>{' '}
            <span className="font-headline-silver">Buyer Protection</span>
          </h1>
          <div className="gold-hairline my-5 max-w-xs" />
          <p className="mt-4 max-w-2xl text-xs sm:text-sm leading-7 text-[#cbd5e1] sm:text-base">
            From cryptographic payment ledgers and warehouse digital weight-scans to tamper-evident neck seals and individualized artisanal bottle serial verification, every Bhumivera order is backed by verifiable operational safeguards.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/verify"
              className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl"
            >
              <Sparkles size={14} /> Scan / Verify Bottle Serial
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
                Verified Safeguard
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
              <Lock size={12} className="text-[#d4af37]" /> Personal Care Sanitary Purity Standard
            </span>
            <h2 className="mt-4 font-serif text-2xl sm:text-4xl uppercase tracking-wider font-normal">
              <span className="font-headline-gold">Strict Virgin Seal</span>{' '}
              <span className="font-headline-silver">&amp; Non-Circulated Purity</span>
            </h2>
            <div className="gold-hairline my-4 max-w-xs" />
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#cbd5e1]">
              In accordance with intimate personal-care cosmetic hygiene standards, every Bhumivera unit is sealed at our apothecary cleanroom. To guarantee zero prior contact or biological contamination for every customer, delivered personal care bottles are never recirculated. Each bottle carries an individualized serial number verifiable on our public lab portal.
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
