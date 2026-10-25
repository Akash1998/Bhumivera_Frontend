import React, { useState } from 'react';
import { ArrowRight, FileText, PackageSearch, MapPin, ShieldCheck, Search, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { PROVENANCE_PAGE_DATA } from '../data/bhumiveraUniqueData';

export default function ProvenanceEngine() {
  const [batchInput, setBatchInput] = useState('BV-SB26-084');
  const matchedRegion =
    PROVENANCE_PAGE_DATA.regions.find((r) =>
      batchInput.trim().toUpperCase().startsWith(r.batchPrefix)
    ) || PROVENANCE_PAGE_DATA.regions[0];

  return (
    <main className="min-h-screen bg-[#070a0e] text-[#e2e8f0] pb-24 font-sans selection:bg-[#d4af37]/30 selection:text-white">
      <SEO
        title="Botanical Provenance & Batch Origin Guide | Bhumivera"
        description="Explore the 6 Indian botanical harvesting corridors, batch prefix decoding guide, and quality verification standards behind Bhumivera formulations."
        route="/provenance-engine"
      />
      
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-[#070a0e] px-5 py-20 text-white sm:px-8 sm:py-28 border-b border-[#d4af37]/20">
        <div className="absolute inset-0 -z-20 opacity-30">
          <img
            src={PROVENANCE_PAGE_DATA.heroImage}
            alt="Himalayan botanical provenance landscape"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#070a0e]/95 via-[#070a0e]/85 to-[#070a0e]/60" />
        
        <div className="mx-auto max-w-6xl grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <div>
            <p className="font-sub-gold inline-flex items-center gap-2 border border-[#d4af37]/40 bg-[#0d1520] px-3.5 py-1.5 text-[10px] tracking-[0.22em]">
              <PackageSearch size={14} className="text-[#d4af37]" aria-hidden="true" /> Botanical Provenance &amp; Batch Prefix Decoder
            </p>
            <h1 className="mt-5 max-w-3xl font-serif text-3xl sm:text-5xl lg:text-6xl uppercase tracking-wider font-normal leading-tight">
              <span className="font-headline-gold">Trace Every Botanical</span>{' '}
              <span className="font-headline-silver">To Harvest Corridors</span>
            </h1>
            <div className="gold-hairline my-5 max-w-xs" />
            <p className="mt-4 max-w-2xl text-xs sm:text-sm leading-7 text-[#cbd5e1]">
              From high-altitude Sea Buckthorn in Ladakh (3,400m) and Mongra Saffron in Pampore to our GMP formulation cleanroom in West Bengal, inspect the origin and batch code structure printed on your Bhumivera vessel.
            </p>
          </div>
          
          {/* Interactive Batch Decoder */}
          <div className="two-tone-panel-gold rounded-2xl p-6 sm:p-7 backdrop-blur-md">
            <span className="font-sub-gold text-[10px] tracking-widest block">
              Interactive Batch Prefix Decoder
            </span>
            <p className="mt-2 text-xs text-[#94a3b8]">
              Select or enter a Bhumivera batch prefix to inspect its botanical origin corridor:
            </p>
            <input
              type="text"
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              placeholder="e.g. BV-SB26-084"
              className="mt-3.5 w-full rounded-xl border border-[#d4af37]/40 bg-[#070a0e] px-4 py-3 font-mono text-sm text-white placeholder-white/30 outline-none focus:border-[#d4af37] transition-colors"
            />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {PROVENANCE_PAGE_DATA.regions.map((reg) => (
                <button
                  key={reg.code}
                  type="button"
                  onClick={() => setBatchInput(`${reg.batchPrefix}-084`)}
                  className={`rounded-lg px-2.5 py-1 font-mono text-[10px] font-bold transition ${
                    matchedRegion.code === reg.code
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#fce096] text-black shadow-md'
                      : 'bg-white/5 border border-white/10 text-[#cbd5e1] hover:border-[#d4af37]/40 hover:text-white'
                  }`}
                >
                  {reg.batchPrefix}
                </button>
              ))}
            </div>
            
            <div className="mt-5 rounded-xl border border-[#d4af37]/35 bg-[#070a0e]/90 p-4 text-xs">
              <p className="font-serif text-lg font-bold text-[#fce096]">{matchedRegion.region}</p>
              <p className="mt-1 text-white font-medium">{matchedRegion.botanical}</p>
              <p className="mt-1 text-[#cbd5e1] font-mono text-[11px]">QC Protocol: {matchedRegion.verificationMethod}</p>
              <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                <Link
                  to="/verify"
                  className="btn-gold-luxury inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white"
                >
                  <ShieldCheck size={13} /> Inspect Lab Genuinity Report <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Regional Provenance Cards */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-12 flex flex-col justify-between gap-4 border-b border-[#d4af37]/20 pb-6 md:flex-row md:items-end">
          <div>
            <p className="font-sub-gold text-[10px] tracking-[0.25em] flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#d4af37]" /> 6 Verified Origin Corridors
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-5xl uppercase tracking-wider font-normal leading-tight">
              <span className="font-headline-gold">Analytical</span>{' '}
              <span className="font-headline-silver">Provenance Map</span>
            </h2>
            <div className="gold-hairline my-4 max-w-xs" />
            <p className="mt-2 text-xs sm:text-sm text-[#94a3b8] max-w-2xl leading-relaxed">
              Authentic Indian botanical origins: high-altitude wild Ladakh sea buckthorn, Pampore Kashmir saffron, and Assam bamboo steam-activated carbon.
            </p>
          </div>
          <Link
            to="/verify"
            className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl transition shrink-0"
          >
            <ShieldCheck size={16} /> Verify Bottle Serial on Genuinity Test <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PROVENANCE_PAGE_DATA.regions.map((region) => (
            <article
              key={region.code}
              className="two-tone-card flex flex-col overflow-hidden rounded-2xl border border-[#d4af37]/25 bg-[#0d1520] transition-all duration-300 hover:border-[#d4af37]/60 hover:-translate-y-1 shadow-lg"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#070a0e] relative">
                <img
                  src={region.image}
                  alt={region.region}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-black/80 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-[#fce096] border border-[#d4af37]/40 backdrop-blur-md">
                  {region.code} · {region.batchPrefix}
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <span className="font-sub-gold text-[10px] tracking-widest">
                      Corridor Active
                    </span>
                    <span className="text-[11px] font-semibold text-white">{region.harvestWindow}</span>
                  </div>
                  <h3 className="mt-3 font-serif text-2xl font-bold text-white">{region.region}</h3>
                  <p className="mt-1 text-xs font-semibold text-[#fce096]">{region.botanical}</p>
                  <p className="mt-3 text-xs leading-6 text-[#94a3b8]">{region.verificationMethod}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#94a3b8] uppercase tracking-widest">Small-Batch Run</span>
                  <Link
                    to="/verify"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#fce096] hover:text-white transition"
                  >
                    View Batch Certificate <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
