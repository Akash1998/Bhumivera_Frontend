import React from 'react';
import { ArrowRight, Mail, RotateCcw, ShieldCheck, Scale, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { RETURNS_CENTRE_DATA } from '../data/bhumiveraUniqueData';

export default function ReturnsCentre() {
  return (
    <div className="bg-[#08120e] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden pb-20">
      <SEO
        title="Returns & RMA Resolution Operations Centre | Bhumivera"
        description="Inspect warehouse digital weight-scan forensics, RMA resolution timelines, and real-life resolved order support logs."
        route="/returns-centre"
      />
      {/* HERO */}
      <section className="relative min-h-[54vh] flex items-center justify-center pt-28 pb-16 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-30">
          <img
            src={RETURNS_CENTRE_DATA.heroImage}
            alt="Bhumivera RMA and forensic weight-scan resolution centre"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#08120e]/90 via-[#08120e]/75 to-[#08120e]" />
        </div>
        <div className="container mx-auto px-6 text-center z-10 max-w-4xl">
          <RotateCcw className="mx-auto text-emerald-400 mb-5" size={42} strokeWidth={1.5} />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#d4af37]">
            Forensic Fulfilment &amp; RMA Operations Desk
          </span>
          <h1 className="mt-3 text-4xl md:text-6xl font-serif tracking-tight mb-5">
            Returns &amp; Resolution Centre
          </h1>
          <p className="max-w-2xl mx-auto text-gray-300 text-sm md:text-base leading-relaxed">
            Every order inquiry is cross-referenced against our pre-dispatch digital scale weight logs, batch QC records, and carrier AWB scans to deliver fast, fair resolutions.
          </p>
        </div>
      </section>

      {/* FORENSIC WEIGHT-SCAN COMPARISON SECTION */}
      <section className="py-16 bg-white text-[#142019]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-800">
                Warehouse Scale + Carrier AWB Audit
              </span>
              <h2 className="mt-2 text-3xl font-serif font-bold mb-4">
                How Our Resolution Desk Verifies Every Claim in Under 4 Hours
              </h2>
              <p className="text-sm leading-7 text-stone-600 mb-4">
                When you submit an order issue via our Concierge or Support Desk, our system retrieves the exact gram weight recorded on our stainless-steel packing scale before the AWB barcode was applied.
              </p>
              <p className="text-sm leading-7 text-stone-600">
                Eligibility and statutory rights are governed by our{' '}
                <Link to="/legal/shipping-hygiene" className="text-emerald-800 font-bold underline">
                  Part II: Shipping, Hygiene &amp; Courtesy Credit Terms
                </Link>{' '}
                and{' '}
                <Link to="/legal/unboxing-antiscam" className="text-emerald-800 font-bold underline">
                  Part III: 360° Unboxing &amp; Anti-Scam Rules
                </Link>.
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-stone-200 shadow-lg">
              <img
                src={RETURNS_CENTRE_DATA.forensicImage}
                alt="Warehouse packing scale and barcode verification"
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
          </div>

          {/* REAL-LIFE RESOLVED RMA LOGS */}
          <div className="mt-16">
            <h3 className="font-serif text-2xl font-bold mb-6">Real-Life Resolved RMA Case Logs</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {RETURNS_CENTRE_DATA.resolvedLogs.map((log) => (
                <article key={log.rmaId} className="overflow-hidden rounded-2xl border border-stone-200 bg-[#faf8f4] shadow-sm">
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    <img src={log.image} alt={log.issueType} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-800">
                      <span>{log.rmaId} · Order {log.orderNo}</span>
                      <span>SLA: {log.resolutionTime}</span>
                    </div>
                    <h4 className="mt-2 font-serif text-xl font-bold text-[#142019]">{log.issueType}</h4>
                    <p className="mt-1 text-xs text-stone-600"> Scale Audit: {log.warehouseWeight}</p>
                    <p className="mt-3 rounded-xl bg-emerald-900/10 p-3 text-xs font-semibold text-emerald-950">
                      {log.outcome}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM LAB QUALITY CARD */}
      <section className="mx-auto max-w-6xl px-6 pt-14">
        <div className="grid gap-8 rounded-3xl border border-white/15 bg-[#101f18] p-8 lg:grid-cols-2 items-center">
          <img
            src={RETURNS_CENTRE_DATA.labVerifyImage}
            alt="Bhumivera quality control laboratory"
            className="aspect-[16/9] w-full rounded-2xl object-cover"
          />
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
              Direct Resolution Channels
            </span>
            <h2 className="mt-2 font-serif text-3xl">Need to Open an Order Resolution Ticket?</h2>
            <p className="mt-3 text-xs sm:text-sm leading-6 text-white/75">
              Include your 9-digit Order ID and photos of the outer AWB label and inner bottle seal within 48 hours of delivery.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#08120e]"
              >
                Open Support Ticket <ArrowRight size={14} />
              </Link>
              <Link
                to="/order-tracking"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10"
              >
                Track Order Status
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
