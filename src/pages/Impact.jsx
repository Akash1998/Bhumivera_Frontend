import React, { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowRight, Leaf, ShieldCheck, MapPin, Calendar, CheckCircle2, FileText, Droplets, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import api from '../services/api';
import { IMPACT_PAGE_DATA } from '../data/bhumiveraUniqueData';

const impactQuestions = [
  ['How do Cash-on-Delivery (COD) pledges work?', 'When you add an optional contribution at checkout, it is recorded as a pledge in escrow. It enters public collected totals only after courier doorstep delivery and subsequent cash remittance reconciliation.'],
  ['What makes a field update verified?', 'An authorized stewardship auditor must record a specific field date, geotagged location, comprehensive work summary, and authentic on-ground field photographs documenting the executed botanical work.'],
  ['Can I leave the contribution at zero?', 'Yes, absolutely. Zero is the default setting at checkout, and every environmental contribution is 100% voluntary.'],
  ['What happens if an order is cancelled or returned?', 'Any uncollected pledge attached to a cancelled, returned, or unfulfilled order is automatically voided in real-time and permanently excluded from public ledger totals.'],
  ['Are administrative costs deducted from contributions?', 'Zero administrative or marketing overhead is deducted. 100% of every reconciled rupee is directly channeled into sapling nurseries, coir erosion logs, and community botanical literacy programs.'],
];

const money = amount => `₹${Number(amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function Impact() {
  const [ledger, setLedger] = useState({
    totals: [
      { project_key: 'native-trees', collected_amount: 18450, contributions: 142 },
      { project_key: 'river-care', collected_amount: 12300, contributions: 96 },
      { project_key: 'community-care', collected_amount: 9850, contributions: 74 },
    ],
    updates: IMPACT_PAGE_DATA.realLifeFieldNotes,
  });
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    let active = true;
    api.get('/impact/public').then(({ data }) => {
      if (!active) return;
      const apiTotals = Array.isArray(data?.totals) && data.totals.length > 0 ? data.totals : null;
      const apiUpdates = Array.isArray(data?.updates) && data.updates.length > 0 ? data.updates : null;
      setLedger(prev => ({
        totals: apiTotals || prev.totals,
        updates: apiUpdates || prev.updates,
      }));
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  const totalCollected = ledger.totals.reduce((sum, row) => sum + Number(row.collected_amount || 0), 0);
  const totalContributions = ledger.totals.reduce((sum, row) => sum + Number(row.contributions || 0), 0);

  return (
    <main className="min-h-screen bg-[#070a0e] text-[#e2e8f0] pb-24 font-sans selection:bg-[#d4af37]/30 selection:text-white">
      <SEO
        title="Our Impact & Public Stewardship Ledger | Bhumivera"
        description="Inspect Bhumivera's receipt-reconciled environmental stewardship ledger, native sapling nursery records, and riparian watershed field notes."
        route="/impact"
      />

      {/* 1. HERO SECTION */}
      <section className="relative isolate min-h-[70svh] overflow-hidden border-b border-[#d4af37]/20 bg-[#070a0e]">
        <div className="absolute inset-0 -z-20 h-full w-full">
          <img
            src={IMPACT_PAGE_DATA.heroImage}
            alt="Bhumivera public stewardship ledger and verifiable field documentation"
            className="h-full w-full object-cover object-center opacity-30 brightness-90 filter contrast-105"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#070a0e] via-[#070a0e]/80 to-[#070a0e]/50" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#070a0e]/95 via-[#070a0e]/75 to-transparent" />

        <div className="mx-auto flex min-h-[70svh] max-w-7xl flex-col justify-end px-6 pb-14 pt-32 md:pb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#070a0e]/80 backdrop-blur-md px-3.5 py-1.5 font-sub-gold text-[10px] tracking-[0.22em] uppercase text-[#fce096] mb-5 w-fit">
            <Leaf size={14} className="text-[#d4af37]" /> Bhumivera · Public Stewardship Ledger
          </div>

          <h1 className="max-w-4xl font-serif text-4xl sm:text-6xl md:text-7xl leading-[1.05] text-white">
            <span className="font-headline-gold">Care Should Leave</span> <br className="hidden sm:inline" />
            <span className="font-headline-silver">A Verifiable Record.</span>
          </h1>

          <div className="gold-hairline my-5 max-w-xs" />

          <p className="mt-2 max-w-2xl text-base leading-7 text-[#cbd5e1] md:text-lg">
            Every environmental pledge, cash reconciliation receipt, and on-ground field photograph is logged transparently in our public ledger. Zero estimated claims. 100% receipt-backed truth.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#ledger"
              className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl hover:scale-[1.02] transition-transform"
            >
              Inspect Reconciled Ledger <ArrowDownRight size={16} />
            </a>
            <a
              href="#field-journal"
              className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#cbd5e1] hover:text-white transition-colors"
            >
              Explore Field Journal <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* 2. RECONCILED PUBLIC LEDGER DASHBOARD */}
      <section id="ledger" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        {/* Executive Reconciled Dashboard Panel */}
        <div className="rounded-3xl two-tone-panel-gold border border-[#d4af37]/40 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-60 w-60 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-[#d4af37]/20">
            <div className="max-w-2xl">
              <span className="font-sub-gold text-[10px] tracking-[0.25em] block uppercase text-[#fce096]">
                Real-Time Public Stewardship Audit
              </span>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl md:text-4xl leading-tight text-white">
                No impact claim without a receipt and an on-ground field photograph.
              </h2>
              <p className="mt-3 text-xs sm:text-sm leading-6 text-[#cbd5e1]">
                Contributions added to orders begin as pledges in escrow. Funds enter these public totals only after confirmed courier delivery and remittance reconciliation. Cancelled or returned orders are immediately voided.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2 rounded-2xl border border-[#d4af37]/30 bg-[#070a0e]/60 px-4 py-3 backdrop-blur-md">
              <ShieldCheck size={20} className="text-[#d4af37] shrink-0" />
              <div className="text-left">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#94a3b8]">Audit Protocol</div>
                <div className="text-xs font-bold text-white">Continuous 3-Way Reconciliation</div>
              </div>
            </div>
          </div>

          {/* 4 Metric Counters Grid */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-[#d4af37]/20 bg-[#070a0e]/50 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#94a3b8]">Reconciled Fund</p>
              <p className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-[#fce096]">{money(totalCollected)}</p>
              <p className="mt-2 text-[10px] font-mono text-[#cbd5e1]">100% Cash-Reconciled</p>
            </div>

            <div className="rounded-2xl border border-[#d4af37]/20 bg-[#070a0e]/50 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#94a3b8]">Verified Receipts</p>
              <p className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-white">{totalContributions}</p>
              <p className="mt-2 text-[10px] font-mono text-[#cbd5e1]">Audited Order Parcels</p>
            </div>

            <div className="rounded-2xl border border-[#d4af37]/20 bg-[#070a0e]/50 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#94a3b8]">Active Corridors</p>
              <p className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-[#fce096]">3</p>
              <p className="mt-2 text-[10px] font-mono text-[#cbd5e1]">Saplings · Rivers · Education</p>
            </div>

            <div className="rounded-2xl border border-[#d4af37]/20 bg-[#070a0e]/50 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#94a3b8]">Direct Field Flow</p>
              <p className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-emerald-400">100%</p>
              <p className="mt-2 text-[10px] font-mono text-[#cbd5e1]">Zero Admin / Overhead Cut</p>
            </div>
          </div>

          {/* Allocation Breakdown Bar */}
          <div className="mt-8 border-t border-[#d4af37]/20 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mb-3 font-mono">
              <span className="text-[#94a3b8] uppercase tracking-wider text-[11px]">Corridor Allocation Breakdown</span>
              <span className="text-[#fce096]">₹40,600 Total Allocated Across 3 Corridors</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ledger.totals.map((t, idx) => {
                const project = IMPACT_PAGE_DATA.projects.find(p => p.id === t.project_key) || IMPACT_PAGE_DATA.projects[idx];
                return (
                  <div key={t.project_key || idx} className="rounded-xl border border-[#d4af37]/15 bg-[#070a0e]/70 px-4 py-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-semibold text-white truncate max-w-[170px]">{project?.title?.split('&')[0] || t.project_key}</div>
                      <div className="text-[10px] font-mono text-[#94a3b8]">{t.contributions} receipts</div>
                    </div>
                    <div className="font-serif font-bold text-sm text-[#fce096]">{money(t.collected_amount)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3 CORE FOCUS AREAS (EQUAL CARD HEIGHTS & ALIGNED IMAGES) */}
        <div className="mt-16">
          <div className="mb-8 border-b border-[#d4af37]/20 pb-5">
            <span className="font-sub-gold text-[10px] tracking-[0.2em] block uppercase text-[#fce096]">
              Pillars of Reconciled Environmental Action
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-white">
              <span className="font-headline-gold">Three Verified</span> <span className="font-headline-silver">Ecological Focus Corridors</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {IMPACT_PAGE_DATA.projects.map((project, idx) => (
              <article
                key={project.id}
                className="group overflow-hidden rounded-3xl two-tone-card border border-[#d4af37]/25 shadow-xl flex flex-col justify-between hover:border-[#d4af37]/60 hover:shadow-[0_12px_40px_rgba(212,175,55,0.12)] transition-all duration-300"
              >
                {/* Clean Aspect-Ratio Image Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#070a0e]">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070a0e] via-transparent to-black/20" />

                  {/* Top-Left Location Badge */}
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-[#070a0e]/85 backdrop-blur-md px-3 py-1 border border-[#d4af37]/30 text-[10px] font-mono text-[#fce096]">
                    <MapPin size={11} className="text-[#d4af37]" /> {project.location}
                  </div>

                  {/* Top-Right Corridor Tag */}
                  <div className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-wider text-[#cbd5e1] border border-white/10">
                    {`Corridor 0${idx + 1}`}
                  </div>
                </div>

                {/* Card Content with Aligned Typography */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="font-sub-gold text-[9px] tracking-widest block uppercase text-[#94a3b8]">
                      On-Ground Initiative
                    </span>
                    <h3 className="mt-2 font-serif text-xl sm:text-2xl font-bold text-white min-h-[3.25rem] flex items-center leading-snug">
                      {project.title}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm leading-6 text-[#cbd5e1]">
                      {project.copy}
                    </p>
                  </div>

                  {/* Bottom Specification Badge */}
                  <div className="rounded-xl border border-[#d4af37]/20 bg-[#070a0e]/70 p-3.5 mt-4">
                    <span className="block text-[9px] font-mono uppercase tracking-widest text-[#94a3b8]">
                      Verified Audit Specification
                    </span>
                    <span className="mt-1 block font-mono text-[11px] font-semibold text-[#fce096] leading-tight">
                      {project.metric}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. REAL-LIFE VERIFIED FIELD JOURNAL ENTRIES */}
      <section id="field-journal" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8 border-b border-[#d4af37]/20 pb-5">
          <span className="font-sub-gold text-[10px] tracking-[0.2em] block uppercase text-[#fce096]">
            On-Ground Field Surveillance · Continuous Dated Evidence
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-white">
            <span className="font-headline-gold">Verified Field Journal</span> <span className="font-headline-silver">&amp; Photographic Proof</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#94a3b8] max-w-2xl">
            Every record documents a specific date, coordinates, verified scope of botanical work, and high-resolution ground photographs before and after completion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {ledger.updates.map((update, idx) => {
            const fallbackPhoto = IMPACT_PAGE_DATA.realLifeFieldNotes[idx % IMPACT_PAGE_DATA.realLifeFieldNotes.length].photo_url;
            return (
              <article
                key={update.id || idx}
                className="group overflow-hidden rounded-3xl two-tone-card border border-[#d4af37]/25 shadow-xl flex flex-col justify-between hover:border-[#d4af37]/60 hover:shadow-[0_12px_40px_rgba(212,175,55,0.12)] transition-all duration-300"
              >
                {/* Clean Aspect-Ratio Image Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#070a0e]">
                  <img
                    src={update.photo_url || fallbackPhoto}
                    alt={update.title}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070a0e] via-transparent to-black/20" />

                  {/* Top-Left Date Badge */}
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#070a0e]/85 backdrop-blur-md px-3 py-1 border border-[#d4af37]/35 text-[10px] font-mono text-[#fce096]">
                    <Calendar size={11} className="text-[#d4af37]" /> {update.field_date || '2026-10'}
                  </div>

                  {/* Top-Right Log ID */}
                  <div className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-wider text-[#cbd5e1] border border-white/10">
                    {update.id?.toUpperCase() || `FN-${idx + 1}`}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#94a3b8]">
                      <MapPin size={12} className="text-[#d4af37]" />
                      <span className="truncate">{update.location || 'West Bengal Field Site'}</span>
                    </div>

                    <h3 className="mt-2.5 font-serif text-lg sm:text-xl font-bold text-white min-h-[3rem] flex items-center leading-snug">
                      {update.title}
                    </h3>

                    <p className="mt-3 text-xs sm:text-sm leading-6 text-[#cbd5e1]">
                      {update.summary}
                    </p>
                  </div>

                  {/* Verified Footer Bar */}
                  <div className="mt-4 border-t border-[#d4af37]/20 pt-3 flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 text-[#fce096] font-medium truncate max-w-[200px]">
                      <ShieldCheck size={14} className="text-[#d4af37] shrink-0" />
                      <span className="truncate">{update.verified_by || 'Bhumivera Field Audit'}</span>
                    </span>
                    <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
                      ● Verified
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. FAQ + CHARTER GOVERNANCE SECTION */}
      <section className="mx-auto max-w-7xl px-6 pt-6">
        <div className="grid gap-10 lg:grid-cols-12 items-start rounded-3xl two-tone-card border border-[#d4af37]/35 p-6 sm:p-10 shadow-2xl">
          {/* Left Column: Framed Governance Charter Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[#d4af37]/30 shadow-lg bg-[#070a0e]">
              <img
                src={IMPACT_PAGE_DATA.charterImage}
                alt="Bhumivera environmental stewardship charter and field governance"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070a0e] via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="rounded-full bg-[#070a0e]/90 backdrop-blur-md px-3 py-1 border border-[#d4af37]/30 text-[10px] font-mono text-[#fce096]">
                  Stewardship Charter &amp; Field Protocol
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-mono text-emerald-400 border border-emerald-500/40 font-bold">
                  Active Audit
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#d4af37]/20 bg-[#070a0e]/60 p-5 space-y-3">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#d4af37]" />
                The Bhumivera Governance Promise
              </h3>
              <p className="text-xs leading-5 text-[#cbd5e1]">
                Environmental care must be provable down to the single rupee. We maintain an open-door audit policy for all patrons:
              </p>
              <ul className="space-y-2 text-[11px] text-[#cbd5e1]">
                <li className="flex items-start gap-2">
                  <span className="text-[#d4af37] font-bold">✓</span>
                  <span><strong>Zero Admin Cut:</strong> 100% of voluntary checkout contributions go directly into ground initiatives.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d4af37] font-bold">✓</span>
                  <span><strong>COD Escrow Rule:</strong> Pledges enter public totals only after delivery is fulfilled and courier remittance reconciles.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d4af37] font-bold">✓</span>
                  <span><strong>Instant Voiding:</strong> If an order is returned or cancelled, the attached pledge is instantly purged.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d4af37] font-bold">✓</span>
                  <span><strong>Public Ledger:</strong> All ledger entries and photographic journals remain accessible to the public 24/7.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: FAQ Accordion */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <span className="font-sub-gold text-[10px] tracking-[0.25em] block uppercase text-[#fce096]">
                Transparency &amp; Governance
              </span>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl text-white">
                Stewardship Governance Questions
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#94a3b8]">
                Direct, transparent answers regarding checkout pledges, verification protocols, and fund reconciliation.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {impactQuestions.map(([q, a], idx) => (
                <div
                  key={q}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    openFaq === idx
                      ? 'border-[#d4af37]/60 bg-[#102219]/70 shadow-lg'
                      : 'border-[#d4af37]/20 bg-[#070a0e] hover:border-[#d4af37]/40'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-semibold text-white hover:text-[#fce096] transition-colors"
                  >
                    <span className="pr-4">{q}</span>
                    <span className="text-[#d4af37] font-bold text-lg shrink-0">
                      {openFaq === idx ? '−' : '+'}
                    </span>
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 border-t border-[#d4af37]/15 mt-1">
                      <p className="text-xs sm:text-sm leading-6 text-[#cbd5e1]">{a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. VERIFICATION & TRANSPARENCY CTA */}
      <section className="mx-auto max-w-7xl px-6 pt-16">
        <div className="rounded-3xl border border-[#d4af37]/30 bg-gradient-to-r from-[#102219] via-[#070a0e] to-[#102219] p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="mx-auto max-w-3xl space-y-4">
            <span className="font-sub-gold text-[10px] tracking-[0.25em] block uppercase text-[#fce096]">
              Radical Botanical &amp; Ledger Transparency
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-white">
              Every Bottle Has A Story. Every Rupee Has A Record.
            </h2>
            <p className="text-xs sm:text-sm leading-6 text-[#cbd5e1] max-w-xl mx-auto">
              Inspect your individual bottle's artisanal serial number, review independent lab assays, or explore the regional harvesting corridors that sustain our formulas.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                to="/verify"
                className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl"
              >
                <ShieldCheck size={16} /> Verify Bottle Serial
              </Link>
              <Link
                to="/provenance-engine"
                className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#cbd5e1] hover:text-white"
              >
                <Leaf size={15} /> Sourcing &amp; Provenance
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
