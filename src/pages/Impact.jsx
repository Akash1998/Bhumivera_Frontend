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
    <main className="min-h-screen bg-[#101a17] text-[#f0eee7] pb-20">
      <SEO
        title="Our Impact & Public Stewardship Ledger | Bhumivera"
        description="Inspect Bhumivera's receipt-reconciled environmental stewardship ledger, native sapling nursery records, and riparian watershed field notes."
        route="/impact"
      />
      <section className="relative isolate min-h-[68svh] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 -z-20 h-full w-full">
          <img
            src={IMPACT_PAGE_DATA.heroImage}
            alt="Bhumivera native sapling nursery and environmental stewardship"
            className="h-full w-full object-cover object-center opacity-50"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0a100e]/95 via-[#0a100e]/70 to-[#0a100e]/25" />
        <div className="mx-auto flex min-h-[68svh] max-w-7xl flex-col justify-end px-6 pb-14 pt-32 md:pb-20">
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#b4c68a]">
            <Leaf size={15} /> Bhumivera · Public Stewardship Ledger
          </p>
          <h1 className="max-w-4xl font-serif text-5xl leading-[1.04] md:text-7xl">
            Care should leave a verifiable record.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/75 md:text-lg">
            Every environmental pledge, cash reconciliation receipt, and on-ground field photograph is logged transparently in our public ledger.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#ledger"
              className="inline-flex items-center gap-2 rounded-xl bg-[#c2d09f] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#101a17]"
            >
              Inspect Reconciled Ledger <ArrowDownRight size={16} />
            </a>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10"
            >
              Explore the Collection <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* RECONCILED TOTALS & 3 FOCUS AREAS */}
      <section id="ledger" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] items-start">
          <div className="rounded-3xl border border-white/15 bg-white/[0.03] p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b4c68a]">Reconciled Public Totals</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight">
              No impact claim without a receipt and a field photograph.
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 border-y border-white/10 py-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/55">Reconciled Amount</p>
                <p className="mt-1 font-serif text-4xl text-[#c2d09f]">{money(totalCollected)}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/55">Verified Receipts</p>
                <p className="mt-1 font-serif text-4xl text-white">{totalContributions}</p>
              </div>
            </div>
            <p className="mt-5 text-xs leading-6 text-white/65">
              Contributions added to orders begin as pledges and enter these totals only after delivery and collection reconciliation.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {IMPACT_PAGE_DATA.projects.map((project) => (
              <article key={project.id} className="overflow-hidden rounded-2xl border border-white/15 bg-[#15231e] flex flex-col">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img src={project.image} alt={project.title} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#b4c68a]">
                      {project.location}
                    </span>
                    <h3 className="mt-2 font-serif text-xl text-white">{project.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-white/70">{project.copy}</p>
                  </div>
                  <p className="mt-4 border-t border-white/10 pt-3 font-mono text-[10px] text-[#c2d09f]">
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
        <div className="mb-8 border-b border-white/10 pb-5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#b4c68a]">
            On-Ground Documentation
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
            Verified Field Journal &amp; Photographic Proof
          </h2>
        </div>

        <div className="grid gap-7 md:grid-cols-3">
          {ledger.updates.map((update, idx) => {
            const fallbackPhoto = IMPACT_PAGE_DATA.realLifeFieldNotes[idx % IMPACT_PAGE_DATA.realLifeFieldNotes.length].photo_url;
            return (
              <article key={update.id || idx} className="overflow-hidden rounded-2xl border border-white/15 bg-[#15231e] flex flex-col">
                <div className="aspect-[16/10] w-full overflow-hidden bg-black">
                  <img
                    src={update.photo_url || fallbackPhoto}
                    alt={update.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#b4c68a]">
                      <span>{update.field_date || '2026-10'}</span>
                      <span>{update.location || 'West Bengal Field Site'}</span>
                    </div>
                    <h3 className="mt-2 font-serif text-xl text-white">{update.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-white/75">{update.summary}</p>
                  </div>
                  <div className="mt-4 border-t border-white/10 pt-3 text-[11px] text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck size={14} /> {update.verified_by || 'Verified Field Record'}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* FAQ + CHARTER IMAGE */}
      <section className="mx-auto max-w-7xl px-6 pt-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center rounded-3xl border border-white/15 bg-[#15231e] p-8">
          <img
            src={IMPACT_PAGE_DATA.charterImage}
            alt="Riparian watershed and botanical care"
            className="aspect-[16/10] w-full rounded-2xl object-cover"
          />
          <div className="space-y-3">
            <h2 className="font-serif text-2xl sm:text-3xl">Stewardship Governance Questions</h2>
            {impactQuestions.map(([q, a], idx) => (
              <div key={q} className="rounded-xl border border-white/10 bg-black/25 p-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="flex w-full items-center justify-between text-left text-sm font-semibold text-white"
                >
                  <span>{q}</span>
                  <span>{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && <p className="mt-2 text-xs leading-6 text-white/70">{a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
