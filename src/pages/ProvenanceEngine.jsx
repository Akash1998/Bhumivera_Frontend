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
            <div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-950/50 p-4 text-xs">
              <p className="font-bold text-[#dce7c5]">{matchedRegion.region}</p>
              <p className="mt-1 text-white/80">{matchedRegion.botanical}</p>
              <p className="mt-1 text-emerald-300 font-mono text-[11px]">QC: {matchedRegion.verificationMethod}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Regional Provenance Cards with Unique Real-Life Photos */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#1b2921]/15 pb-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#536b4d]">
              6 Verified Origin Corridors
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
              Real-Life Harvesting &amp; Analytical Provenance Map
            </h2>
          </div>
          <Link
            to="/ewarranty"
            className="inline-flex items-center gap-2 rounded-xl bg-[#142019] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#26392c]"
          >
            Verify Bottle Serial on E-Warranty <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PROVENANCE_PAGE_DATA.regions.map((region) => (
            <article
              key={region.code}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#1b2921]/15 bg-white shadow-sm"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#142019]">
                <img
                  src={region.image}
                  alt={region.region}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded bg-[#eef0e6] px-2.5 py-1 font-mono text-[10px] font-bold text-[#26392c]">
                      {region.code} · {region.batchPrefix}
                    </span>
                    <span className="text-[11px] font-semibold text-[#6b4226]">{region.harvestWindow}</span>
                  </div>
                  <h3 className="mt-3 font-serif text-xl font-bold text-[#142019]">{region.region}</h3>
                  <p className="mt-1 text-xs font-semibold text-[#536b4d]">{region.botanical}</p>
                  <p className="mt-3 text-xs leading-6 text-stone-600">{region.verificationMethod}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
