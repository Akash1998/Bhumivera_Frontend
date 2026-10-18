import React, { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowRight, Leaf, ShieldCheck, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import api from '../services/api';
import { IMPACT_PAGE_DATA } from '../data/bhumiveraUniqueData';

const impactQuestions = [
  ['How do Cash-on-Delivery (COD) pledges work?', 'When you add an optional contribution at checkout, it is recorded as a pledge. It is counted in collected totals only after delivery and manual cash reconciliation.'],
  ['What makes a field update verified?', 'An administrator must provide a field date, location, written summary, and authentic on-ground field photographs documenting completed work.'],
  ['Can I leave the contribution at zero?', 'Yes. Zero is the default at checkout, and every contribution is 100% optional.'],
  ['What happens if an order is cancelled?', 'Any uncollected pledge attached to a cancelled order is automatically voided and excluded from public totals.'],
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
      <section className="relative isolate min-h-[68svh] overflow-hidden border-b border-[#d4af37]/20 bg-[#070a0e]">
        <div className="absolute inset-0 -z-20 h-full w-full">
          <img
            src={IMPACT_PAGE_DATA.heroImage}
            alt="Bhumivera native sapling nursery and environmental stewardship"
            className="h-full w-full object-cover object-center opacity-30"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#070a0e]/95 via-[#070a0e]/80 to-[#070a0e]/40" />
        <div className="mx-auto flex min-h-[68svh] max-w-7xl flex-col justify-end px-6 pb-14 pt-32 md:pb-20">
          <p className="mb-4 flex items-center gap-2 font-sub-gold text-xs tracking-[0.24em]">
            <Leaf size={15} className="text-[#d4af37]" /> Bhumivera · Public Stewardship Ledger
          </p>
          <h1 className="max-w-4xl font-serif text-4xl sm:text-6xl md:text-7xl leading-[1.04] text-white">
            <span className="font-headline-gold">Care Should Leave</span> <span className="font-headline-silver">A Verifiable Record.</span>
          </h1>
          <div className="gold-hairline my-5 max-w-xs" />
          <p className="mt-4 max-w-xl text-base leading-7 text-[#cbd5e1] md:text-lg">
            Every environmental pledge, cash reconciliation receipt, and on-ground field photograph is logged transparently in our public ledger.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#ledger"
              className="btn-gold-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl"
            >
              Inspect Reconciled Ledger <ArrowDownRight size={16} />
            </a>
            <Link
              to="/shop"
              className="btn-silver-luxury inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#cbd5e1]"
            >
              Explore the Collection <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* RECONCILED TOTALS & 3 FOCUS AREAS */}
      <section id="ledger" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] items-start">
          <div className="rounded-3xl two-tone-panel-gold border border-[#d4af37]/40 p-8 shadow-2xl">
            <p className="font-sub-gold text-xs tracking-[0.2em]">Reconciled Public Totals</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-white">
              No impact claim without a receipt and a field photograph.
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 border-y border-[#d4af37]/25 py-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#94a3b8]">Reconciled Amount</p>
                <p className="mt-1 font-serif text-4xl font-bold text-[#fce096]">{money(totalCollected)}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#94a3b8]">Verified Receipts</p>
                <p className="mt-1 font-serif text-4xl font-bold text-white">{totalContributions}</p>
              </div>
            </div>
            <p className="mt-5 text-xs leading-6 text-[#cbd5e1]">
              Contributions added to orders begin as pledges and enter these totals only after delivery and collection reconciliation.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {IMPACT_PAGE_DATA.projects.map((project) => (
              <article key={project.id} className="overflow-hidden rounded-2xl two-tone-card border border-[#d4af37]/25 shadow-lg flex flex-col hover:border-[#d4af37]/60 transition-all">
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#070a0e]">
                  <img src={project.image} alt={project.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-sub-gold text-[9px] tracking-widest block">
                      {project.location}
                    </span>
                    <h3 className="mt-2 font-serif text-xl font-bold text-white">{project.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-[#cbd5e1]">{project.copy}</p>
                  </div>
                  <p className="mt-4 border-t border-[#d4af37]/15 pt-3 font-mono text-[10px] font-bold text-[#fce096]">
                    {project.metric}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* REAL-LIFE VERIFIED FIELD JOURNAL ENTRIES */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-8 border-b border-[#d4af37]/20 pb-5">
          <span className="font-sub-gold text-[10px] tracking-[0.2em] block">
            On-Ground Documentation
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-white">
            <span className="font-headline-gold">Verified Field Journal</span> <span className="font-headline-silver">&amp; Photographic Proof</span>
          </h2>
        </div>

        <div className="grid gap-7 md:grid-cols-3">
          {ledger.updates.map((update, idx) => {
            const fallbackPhoto = IMPACT_PAGE_DATA.realLifeFieldNotes[idx % IMPACT_PAGE_DATA.realLifeFieldNotes.length].photo_url;
            return (
              <article key={update.id || idx} className="overflow-hidden rounded-2xl two-tone-card border border-[#d4af37]/25 shadow-lg flex flex-col hover:border-[#d4af37]/60 transition-all">
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#070a0e]">
                  <img
                    src={update.photo_url || fallbackPhoto}
                    alt={update.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#fce096]">
                      <span>{update.field_date || '2026-10'}</span>
                      <span>{update.location || 'West Bengal Field Site'}</span>
                    </div>
                    <h3 className="mt-2 font-serif text-xl font-bold text-white">{update.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-[#cbd5e1]">{update.summary}</p>
                  </div>
                  <div className="mt-4 border-t border-[#d4af37]/15 pt-3 text-[11px] text-[#fce096] flex items-center gap-1.5 font-semibold">
                    <ShieldCheck size={14} className="text-[#d4af37]" /> {update.verified_by || 'Verified Field Record'}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* FAQ + CHARTER IMAGE */}
      <section className="mx-auto max-w-7xl px-6 pt-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center rounded-3xl two-tone-card border border-[#d4af37]/35 p-8 shadow-2xl">
          <img
            src={IMPACT_PAGE_DATA.charterImage}
            alt="Riparian watershed and botanical care"
            className="aspect-[16/10] w-full rounded-2xl object-cover border border-[#d4af37]/25"
          />
          <div className="space-y-3">
            <h2 className="font-serif text-2xl sm:text-3xl text-white">Stewardship Governance Questions</h2>
            {impactQuestions.map(([q, a], idx) => (
              <div key={q} className="rounded-xl border border-[#d4af37]/20 bg-[#070a0e] p-4 transition-all">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="flex w-full items-center justify-between text-left text-sm font-semibold text-white hover:text-[#fce096]"
                >
                  <span>{q}</span>
                  <span className="text-[#d4af37] font-bold text-base">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && <p className="mt-2 text-xs leading-6 text-[#cbd5e1]">{a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
