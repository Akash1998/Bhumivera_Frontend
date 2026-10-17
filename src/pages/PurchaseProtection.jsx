import React from 'react';
import { ArrowRight, CreditCard, PackageCheck, Truck, ShieldCheck, Scale, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
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
    plateStyle: 'gold-plate-card',
  },
  {
    icon: Truck,
    title: 'Digital Weight-Scan & Honeycomb Dispatch',
    copy: 'Every parcel is cushioned in biodegradable honeycomb kraft wrap, weighed on a calibrated digital scale (±0.5g), and barcode-scanned prior to courier pickup.',
    image: PURCHASE_PROTECTION_DATA.scaleShieldImage,
    example: 'Real-Life Protection: Pre-dispatch weight certificates protect patrons against transit pilferage.',
    plateStyle: 'silver-plate-card',
  },
  {
    icon: Lock,
    title: 'Tamper-Evident Neck Seal & Serial Genuinity',
    copy: 'Every Bhumivera bottle carries a matte-black and gold tamper-evident security strip over the cap collar plus an artisanal bottle serial number verifying small-batch compounding.',
    image: PURCHASE_PROTECTION_DATA.sealShieldImage,
    example: 'Real-Life Protection: Scan your bottle QR or enter the serial on /verify to inspect the lab pH calibration and purity assay.',
    plateStyle: 'gold-plate-card',
  },
];

export default function PurchaseProtection() {
  return (
    <main className="min-h-screen bg-[#f4f1e9] text-[#1b2921] pb-20">
      <SEO
        title="Sanitary Custody & Purchase Protection Shield | Bhumivera"
        description="Explore Bhumivera's 3-pillar Purchase Protection Shield: PCI-DSS payment reconciliation, digital scale dispatch weight logs, and tamper-evident bottle seals."
        route="/purchase-protection"
      />
      <section className="relative isolate overflow-hidden bg-[#0a1711] px-5 py-24 text-white sm:px-8 sm:py-32">
        <div className="absolute inset-0 -z-20 opacity-30">
          <img
            src={PURCHASE_PROTECTION_DATA.heroImage}
            alt="Bhumivera purchase and order protection"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#05110a]/95 via-[#091810]/85 to-[#05110a]/60" />
        <div className="mx-auto max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] shadow-sm">
            <Sparkles size={14} className="text-[#D4AF37]" aria-hidden="true" /> 3-Pillar Buyer Protection &amp; Artisanal Custody
          </div>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-tight text-white sm:text-6xl">
            Uncompromising sanitary purity and verified records for every order.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            From cryptographic payment ledgers and warehouse digital weight-scans to tamper-evident neck seals and individualized artisanal bottle serial verification, every Bhumivera order is backed by verifiable operational safeguards.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/verify"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-[#0A1711] shadow-lg hover:brightness-105 transition-all"
            >
              <Sparkles size={14} /> Scan / Verify Bottle Serial
            </Link>
            <Link
              to="/order-tracking"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all"
            >
              Live Order Tracking <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-7 px-5 py-16 sm:px-8 md:grid-cols-3 lg:px-10">
        {protectionPillars.map(({ icon: Icon, title, copy, image, example, plateStyle }) => (
          <article key={title} className={`overflow-hidden rounded-2xl ${plateStyle} shadow-md flex flex-col transition-all hover:scale-[1.01]`}>
            <div className="aspect-[16/10] w-full overflow-hidden bg-[#0A1711] relative">
              <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 text-[9px] font-bold uppercase tracking-wider text-[#F3E5AB]">
                Verified Safeguard
              </div>
            </div>
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#0B2419] text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h2 className="mt-4 font-serif text-2xl text-[#0B2419]">{title}</h2>
                <p className="mt-3 text-xs sm:text-sm leading-6 text-stone-600">{copy}</p>
              </div>
              <div className="mt-5 rounded-xl bg-[#f4f6ef] border border-[#26392c]/15 p-3.5 text-xs text-[#1b2921] flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#35533c] shrink-0 mt-0.5" />
                <span>{example}</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* 100% Sealed Sanitary Custody Banner */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 mb-12">
        <div className="rounded-2xl border border-[#D4AF37]/50 bg-gradient-to-br from-[#071911] via-[#0B2419] to-[#143725] p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
              <Lock size={12} /> Personal Care Sanitary Purity Standard
            </span>
            <h2 className="mt-4 font-serif text-2xl sm:text-3xl text-white">
              Strict Virgin Seal &amp; Non-Circulated Purity
            </h2>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-stone-300">
              In accordance with intimate personal-care cosmetic hygiene standards, every Bhumivera unit is sealed at our apothecary cleanroom. To guarantee zero prior contact or biological contamination for every customer, delivered personal care bottles are never recirculated. Each bottle carries an individualized serial number verifiable on our public lab portal.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="rounded-2xl border border-[#26392c]/15 bg-white p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#0B2419]">Explore Verification &amp; Authenticity Portals</h2>
            <p className="mt-2 text-xs sm:text-sm text-stone-600">
              Track a live parcel, verify your bottle’s artisanal batch serial number, or explore the botanical origin map.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/order-tracking" className="inline-flex items-center gap-2 rounded-xl bg-[#0B2419] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#163c2a] transition-all">
              Track an Order <ArrowRight size={14} />
            </Link>
            <Link to="/verify" className="inline-flex items-center gap-2 rounded-xl border border-[#D4AF37] bg-[#D4AF37]/15 px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#0B2419] hover:bg-[#D4AF37]/25 transition-all">
              <Sparkles size={14} className="text-[#8B5A2B]" /> Verify Bottle Serial
            </Link>
            <Link to="/provenance" className="inline-flex items-center gap-2 rounded-xl border border-[#142019]/25 px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#142019] hover:bg-black/5 transition-all">
              Provenance Map
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
