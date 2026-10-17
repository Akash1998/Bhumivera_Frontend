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
    <main className="min-h-screen bg-[#f4f1e9] text-[#1b2921] pb-20 font-sans">
      <SEO
        title="Botanical Provenance & Batch Origin Guide | Bhumivera"
        description="Explore the 6 Indian botanical harvesting corridors, batch prefix decoding guide, and quality verification standards behind Bhumivera formulations."
        route="/provenance-engine"
      />
      <section className="relative isolate overflow-hidden bg-[#142019] px-5 py-20 text-white sm:px-8 sm:py-28">
        <div className="absolute inset-0 -z-20 opacity-35">
          <img
            src={PROVENANCE_PAGE_DATA.heroImage}
            alt="Himalayan botanical provenance landscape"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#101a14]/95 via-[#101a14]/80 to-[#101a14]/50" />
        <div className="mx-auto max-w-6xl grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 border border-white/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#dce7c5]">
              <PackageSearch size={15} aria-hidden="true" /> Botanical Provenance &amp; Batch Prefix Decoder
            </p>
            <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">
              Trace Every Botanical to Its Harvest Corridor.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
              From high-altitude Sea Buckthorn in Ladakh (3,400m) and Mongra Saffron in Pampore to our GMP formulation cleanroom in West Bengal, inspect the origin and batch code structure printed on your Bhumivera vessel.
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-black/45 p-6 backdrop-blur-md">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
              Interactive Batch Prefix Decoder
            </span>
            <p className="mt-1 text-xs text-white/70">
              Select or enter a Bhumivera batch prefix to inspect its botanical origin corridor:
            </p>
            <input
              type="text"
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              placeholder="e.g. BV-SB26-084"
              className="mt-3 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-mono text-sm text-white outline-none focus:border-[#d4af37]"
            />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {PROVENANCE_PAGE_DATA.regions.map((reg) => (
                <button
                  key={reg.code}
                  type="button"
                  onClick={() => setBatchInput(`${reg.batchPrefix}-084`)}
                  className={`rounded-lg px-2.5 py-1 font-mono text-[10px] font-bold transition ${
                    matchedRegion.code === reg.code
                      ? 'bg-[#d4af37] text-[#101a14]'
                      : 'bg-white/10 text-white/75 hover:bg-white/20'
                  }`}
                >
                  {reg.batchPrefix}
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-[#d4af37]/40 bg-black/60 p-4 text-xs">
              <p className="font-bold text-[#dce7c5]">{matchedRegion.region}</p>
              <p className="mt-1 text-white/80">{matchedRegion.botanical}</p>
              <p className="mt-1 text-[#d4af37] font-mono text-[11px]">QC: {matchedRegion.verificationMethod}</p>
              <div className="mt-3 pt-3 border-t border-white/10 flex justify-end">
                <Link
                  to={`/verify?serial=${matchedRegion.batchPrefix === 'BV-CH26' ? 'BV-CH26-8841' : matchedRegion.batchPrefix === 'BV-SH26' ? 'BV-SH26-4409' : matchedRegion.batchPrefix === 'BV-KM26' ? 'BV-KK26-3019' : 'BV-SB26-1042'}`}
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#d4af37] hover:underline"
                >
                  <ShieldCheck size={12} /> Inspect Lab Genuinity Report <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Regional Provenance Cards with Distinct Authentic Photos & Gold/Silver Plate Styling */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#1b2921]/15 pb-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#536b4d] flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#8b5a2b]" /> 6 Verified Origin Corridors
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-5xl text-[#142019]">
              Real-Life Harvesting &amp; Analytical Provenance Map
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-2xl">
              Authentic Indian botanical origins: high-altitude wild Ladakh sea buckthorn, Pampore Kashmir saffron, and Assam bamboo steam-activated carbon.
            </p>
          </div>
          <Link
            to="/verify"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#0e1914] px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#1a2d21] shadow-lg transition"
          >
            <ShieldCheck size={16} /> Verify Bottle Serial on Genuinity Test <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PROVENANCE_PAGE_DATA.regions.map((region, idx) => (
            <article
              key={region.code}
              className={`flex flex-col overflow-hidden rounded-3xl border ${
                idx % 2 === 0
                  ? 'border-[#d4af37]/35 shadow-[0_10px_30px_rgba(212,175,55,0.08)] bg-white'
                  : 'border-stone-300 shadow-md bg-[#faf9f5]'
              } transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#142019] relative">
                <img
                  src={region.image}
                  alt={region.region}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-black/75 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-[#d4af37] border border-[#d4af37]/30 backdrop-blur-md">
                  {region.code} · {region.batchPrefix}
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-stone-200 pb-3">
                    <span className="font-mono text-[10px] font-bold text-[#26392c]">
                      Corridor Active
                    </span>
                    <span className="text-[11px] font-semibold text-[#8b5a2b]">{region.harvestWindow}</span>
                  </div>
                  <h3 className="mt-3 font-serif text-2xl font-bold text-[#142019]">{region.region}</h3>
                  <p className="mt-1 text-xs font-semibold text-[#536b4d]">{region.botanical}</p>
                  <p className="mt-3 text-xs leading-6 text-stone-600">{region.verificationMethod}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-stone-500 uppercase tracking-widest">Small-Batch Run</span>
                  <Link
                    to={`/verify?serial=${region.batchPrefix === 'BV-CH26' ? 'BV-CH26-8841' : region.batchPrefix === 'BV-SH26' ? 'BV-SH26-4409' : region.batchPrefix === 'BV-KM26' ? 'BV-KK26-3019' : 'BV-SB26-1042'}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#8b5a2b] hover:text-[#142019] transition"
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
