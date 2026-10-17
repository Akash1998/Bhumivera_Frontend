import React from 'react';
import { ArrowRight, CreditCard, PackageCheck, RotateCcw, Truck, ShieldCheck, Scale, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { PURCHASE_PROTECTION_DATA } from '../data/bhumiveraUniqueData';

const protectionPillars = [
  {
    icon: CreditCard,
    title: 'Cryptographic Payment & Webhook Lock',
    copy: 'All online payments are processed via PCI-DSS compliant Razorpay/UPI gateways. Checkout totals are locked server-side, and atomic ledger reconciliation prevents double-debit loss.',
    image: PURCHASE_PROTECTION_DATA.paymentShieldImage,
    example: 'Real-Life Protection: Pending UPI debits are automatically reconciled via server-to-server webhook checks.',
  },
  {
    icon: Truck,
    title: 'Digital Weight-Scan & Honeycomb Dispatch',
    copy: 'Every parcel is cushioned in biodegradable honeycomb kraft wrap, weighed on a calibrated digital scale (±0.5g), and barcode-scanned prior to courier pickup.',
    image: PURCHASE_PROTECTION_DATA.scaleShieldImage,
    example: 'Real-Life Protection: Pre-dispatch weight certificates protect buyers against transit pilferage.',
  },
  {
    icon: Lock,
    title: 'Tamper-Evident Neck Seal & Serial Check',
    copy: 'Every Bhumivera bottle carries a matte-black and gold tamper-evident security strip over the cap collar plus a verifiable batch/serial code.',
    image: PURCHASE_PROTECTION_DATA.sealShieldImage,
    example: 'Real-Life Protection: Verify your bottle serial anytime on /ewarranty before breaking the neck seal.',
  },
];

export default function PurchaseProtection() {
  return (
    <main className="min-h-screen bg-[#f4f1e9] text-[#1b2921] pb-20">
      <SEO
        title="Purchase & Order Protection Shield | Bhumivera"
        description="Explore Bhumivera's 3-pillar Purchase Protection Shield: PCI-DSS payment reconciliation, digital scale dispatch weight logs, and tamper-evident bottle seals."
        route="/purchase-protection"
      />
      <section className="relative isolate overflow-hidden bg-[#142019] px-5 py-24 text-white sm:px-8 sm:py-32">
        <div className="absolute inset-0 -z-20 opacity-35">
          <img
            src={PURCHASE_PROTECTION_DATA.heroImage}
            alt="Bhumivera purchase and order protection"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101a14]/95 via-[#101a14]/80 to-[#101a14]/45" />
        <div className="mx-auto max-w-5xl">
          <p className="inline-flex items-center gap-2 border border-white/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#dce7c5]">
            <PackageCheck size={15} aria-hidden="true" /> 3-Pillar Buyer &amp; Order Protection Shield
          </p>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">
            Clear protection and verified records for every order.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
            From cryptographic payment ledgers and warehouse digital weight-scans to tamper-evident neck seals and our 48-hour Courtesy Replacement Guarantee, every Bhumivera order is backed by verifiable operational safeguards.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-7 px-5 py-16 sm:px-8 md:grid-cols-3 lg:px-10">
        {protectionPillars.map(({ icon: Icon, title, copy, image, example }) => (
          <article key={title} className="overflow-hidden rounded-2xl border border-[#26392c]/15 bg-white shadow-sm flex flex-col">
            <div className="aspect-[16/10] w-full overflow-hidden bg-[#142019]">
              <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <Icon size={22} className="text-[#536b4d]" aria-hidden="true" />
                <h2 className="mt-4 font-serif text-2xl">{title}</h2>
                <p className="mt-3 text-xs sm:text-sm leading-6 text-stone-600">{copy}</p>
              </div>
              <div className="mt-5 rounded-xl bg-[#f4f6ef] border border-[#26392c]/15 p-3.5 text-xs text-[#1b2921]">
                {example}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="rounded-2xl border border-[#26392c]/15 bg-white p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl">Explore Related Protection &amp; Verification Tools</h2>
            <p className="mt-2 text-xs sm:text-sm text-stone-600">
              Track a live parcel, verify your bottle’s E-Warranty serial number, or review our Damaged Arrival Courtesy Policy.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/order-tracking" className="inline-flex items-center gap-2 rounded-xl bg-[#142019] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">
              Track an Order <ArrowRight size={14} />
            </Link>
            <Link to="/ewarranty" className="inline-flex items-center gap-2 rounded-xl border border-[#142019]/25 px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#142019]">
              Verify Serial
            </Link>
            <Link to="/returns" className="inline-flex items-center gap-2 rounded-xl border border-[#142019]/25 px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#142019]">
              Courtesy Replacement Policy
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
