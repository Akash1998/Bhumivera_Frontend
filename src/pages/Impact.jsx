import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowRight, ExternalLink, Leaf, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const projects = [
  { id: 'native-trees', title: 'Native tree restoration', copy: 'Support locally appropriate planting and follow-up care, documented when field work takes place.' },
  { id: 'river-care', title: 'River care', copy: 'Back practical river and waterway care, with evidence published after verified activity.' },
  { id: 'community-care', title: 'Community care', copy: 'Make room for locally led support, with funds and updates recorded transparently.' },
];

const money = amount => `₹${Number(amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function Impact() {
  const [ledger, setLedger] = useState({ totals: [], updates: [] });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    api.get('/impact/public').then(({ data }) => {
      if (active) setLedger({ totals: data?.totals || [], updates: data?.updates || [] });
    }).catch(() => {
      if (active) setLoadError(true);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const totalCollected = ledger.totals.reduce((sum, row) => sum + Number(row.collected_amount || 0), 0);
  const totalContributions = ledger.totals.reduce((sum, row) => sum + Number(row.contributions || 0), 0);

  return (
    <main className="min-h-screen bg-[#101a17] text-[#f0eee7]">
      <section className="relative isolate min-h-[72svh] overflow-hidden border-b border-white/10">
        <img src="/assets/images/foundermanifesto.webp" alt="Bhumivera's nature-first commitment" className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0a100e]/95 via-[#0a100e]/65 to-[#0a100e]/15" />
        <div className="mx-auto flex min-h-[72svh] max-w-7xl flex-col justify-end px-6 pb-12 pt-36 md:pb-20">
          <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#b4c68a]"><Leaf size={15}/> Bhumivera field ledger</p>
          <h1 className="max-w-4xl font-serif text-5xl leading-[1.04] md:text-7xl">Care should leave a record.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/75 md:text-lg">A considered daily ritual. An optional contribution. A public account of what was collected and what was actually done.</p>
          <Link to="/shop" className="mt-8 inline-flex w-fit items-center gap-3 border border-[#c2d09f]/60 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c2d09f] hover:text-[#101a17]">Explore the collection <ArrowRight size={16}/></Link>
        </div>
        <a href="#ledger" className="absolute bottom-7 right-8 hidden items-center gap-2 text-xs uppercase tracking-widest text-white/70 md:flex">Read the ledger <ArrowDownRight size={16}/></a>
      </section>

      <section id="ledger" className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[0.8fr_1.2fr] md:py-24">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b4c68a]">The standard</p>
          <h2 className="mt-4 max-w-md font-serif text-3xl leading-tight md:text-4xl">No impact claim without a receipt and a field record.</h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/65">Contributions added to cash-on-delivery orders begin as pledges. They are counted here only after delivery and manual collection reconciliation. Field updates appear only after the team adds secure photo or video evidence and confirms the work is complete.</p>
          <div className="mt-7 flex items-start gap-3 border-l border-[#b4c68a] pl-4 text-sm leading-6 text-white/80"><ShieldCheck size={17} className="mt-1 shrink-0 text-[#b4c68a]"/>This ledger is designed to separate what is promised from what is collected and verified.</div>
        </div>
        <div className="grid gap-px self-start border border-white/10 bg-white/10 sm:grid-cols-2">
          <div className="bg-[#15221d] p-6"><p className="text-xs uppercase tracking-widest text-white/50">Verified collected</p><p className="mt-3 font-serif text-4xl">{loading ? '—' : money(totalCollected)}</p></div>
          <div className="bg-[#15221d] p-6"><p className="text-xs uppercase tracking-widest text-white/50">Reconciled contributions</p><p className="mt-3 font-serif text-4xl">{loading ? '—' : totalContributions.toLocaleString('en-IN')}</p></div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#17231e]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b4c68a]">Where pledges can go</p><h2 className="mt-3 font-serif text-3xl md:text-4xl">Three starting directions.</h2></div>
            <p className="max-w-md text-sm leading-6 text-white/55">These are focus areas, not claims of completed projects. Contributions are not assigned to a named partner until that partnership is confirmed.</p>
          </div>
          <div className="grid gap-0 border-y border-white/10 md:grid-cols-3 md:divide-x md:divide-white/10">
            {projects.map((project, index) => {
              const totals = ledger.totals.find(row => row.project_key === project.id);
              return <article key={project.id} className="py-7 md:px-7 first:md:pl-0 last:md:pr-0">
                <span className="font-mono text-xs text-[#b4c68a]">0{index + 1}</span>
                <h3 className="mt-5 font-serif text-2xl">{project.title}</h3>
                <p className="mt-3 min-h-14 text-sm leading-6 text-white/60">{project.copy}</p>
                <p className="mt-6 border-t border-white/10 pt-4 text-xs uppercase tracking-widest text-white/50">Verified collected</p>
                <p className="mt-1 text-xl font-semibold">{loading ? '—' : money(totals?.collected_amount)}</p>
              </article>;
            })}
          </div>
          <p className="mt-7 text-xs leading-5 text-white/45">Optional contributions are currently available only with cash-on-delivery orders. Your order receipt will show the contribution as pledged until it is reconciled.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b4c68a]">Evidence, not promises</p><h2 className="mt-3 font-serif text-3xl md:text-4xl">Field notes</h2></div>
          <p className="max-w-md text-sm leading-6 text-white/55">Photos and videos are published only with a field date and team verification.</p>
        </div>
        {loadError ? <p role="status" className="py-12 text-sm text-white/60">The impact ledger is temporarily unavailable. No totals are being estimated.</p> : loading ? <p className="py-12 text-sm text-white/60">Loading verified records…</p> : ledger.updates.length === 0 ? (
          <div className="grid gap-6 py-12 md:grid-cols-[1fr_auto] md:items-end">
            <div><p className="font-serif text-2xl">The field journal is waiting for its first verified entry.</p><p className="mt-3 max-w-xl text-sm leading-6 text-white/55">When on-ground work is completed, the date, story, and supporting media will appear here. Until then, this space stays intentionally empty.</p></div>
            <span className="border border-white/15 px-4 py-2 text-xs uppercase tracking-widest text-white/45">No field reports yet</span>
          </div>
        ) : (
          <div className="grid gap-8 py-10 md:grid-cols-2">
            {ledger.updates.map(update => <article key={update.id} className="border-b border-white/10 pb-8">
              {update.photo_url && <img src={update.photo_url} alt={update.title} loading="lazy" className="mb-5 aspect-[16/9] w-full object-cover" />}
              <p className="text-xs uppercase tracking-widest text-[#b4c68a]">{new Date(update.field_date || update.verified_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <h3 className="mt-2 font-serif text-2xl">{update.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/65">{update.summary}</p>
              {update.video_url && <a href={update.video_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#c2d09f] hover:text-white">Watch field footage <ExternalLink size={14}/></a>}
            </article>)}
          </div>
        )}
      </section>
    </main>
  );
}