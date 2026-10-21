import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Download,
  FileImage,
  Leaf,
  RefreshCw,
  Search,
  ShieldCheck,
  Sprout,
  Droplets,
  HeartHandshake,
} from 'lucide-react';
import { impact as impactApi } from '../../services/api';

const PROJECTS = [
  ['native-trees', 'Native sapling nurseries & afforestation'],
  ['river-care', 'Riparian bank & watershed stewardship'],
  ['community-care', 'Botanical literacy & community gardens'],
  ['saffron-pollinators', 'Pampore saffron & bee sanctuaries (Upcoming 2027)'],
  ['sacred-groves', 'Ancient sacred grove reserves (Upcoming 2027)'],
  ['wetland-rejuvenation', 'Earthen kunds & wetland revival (Upcoming 2027)'],
];

const PROJECT_LABELS = Object.fromEntries(PROJECTS);

const PROJECT_BENCHMARKS = {
  'native-trees': {
    unitLabel: 'Native saplings planted & maintained',
    inrPerUnit: 125,
    region: 'Western Ghats & Nilgiri Biosphere',
    auditor: 'Bhumivera Ecological Trust · Geo-Tagged Sapling Registry',
  },
  'river-care': {
    unitLabel: 'KL watershed & riparian buffer restored',
    inrPerUnit: 80,
    region: 'Cauvery & Kabini Tributary Basins',
    auditor: 'Riparian Clean-Water Collective',
  },
  'community-care': {
    unitLabel: 'Artisan smallholder training & health hours',
    inrPerUnit: 150,
    region: 'Wayanad, Idukki & Jaintia Hills Farmer Cooperatives',
    auditor: 'Fair-Harvest Community Guild',
  },
  'saffron-pollinators': {
    unitLabel: 'Bee apiaries & organic saffron buffer belts',
    inrPerUnit: 200,
    region: 'Pampore Karewas & Kashmir Valley (1,600m)',
    auditor: 'Alpine Pollinator & Saffron Stewardship Trust',
  },
  'sacred-groves': {
    unitLabel: 'Heritage sacred grove reserves mapped & conserved',
    inrPerUnit: 250,
    region: 'Vindhya & Central Indian Forest Belts',
    auditor: 'Ethnobotanical Heritage Trust',
  },
  'wetland-rejuvenation': {
    unitLabel: 'Earthen percolation reservoirs & aquifers restored',
    inrPerUnit: 180,
    region: 'Arid & Drought-Prone Rural Belts',
    auditor: 'Indigenous Watershed Restoration Council',
  },
};

export default function ImpactManagement() {
  const [contributions, setContributions] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [references, setReferences] = useState({});
  const [form, setForm] = useState({
    projectKey: 'native-trees',
    title: '',
    summary: '',
    fieldDate: '',
    photoUrl: '',
    videoUrl: '',
    verified: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [pledgesResponse, updatesResponse] = await Promise.all([
        impactApi.getAdminContributions(),
        impactApi.getAdminUpdates(),
      ]);
      setContributions(pledgesResponse.data?.contributions || []);
      setUpdates(updatesResponse.data?.updates || []);
    } catch (error) {
      setMessage(error.normalized?.message || 'Unable to load the impact records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const reconcile = async contribution => {
    const collectionReference = references[contribution.id]?.trim();
    if (!collectionReference) {
      setMessage('Enter a receipt or reconciliation reference first.');
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      await impactApi.collectContribution(contribution.id, collectionReference);
      setReferences(current => ({ ...current, [contribution.id]: '' }));
      setMessage('Collection recorded. The verified public total will include it.');
      await load();
    } catch (error) {
      setMessage(error.normalized?.message || error.response?.data?.message || 'Could not reconcile this contribution.');
    } finally {
      setSaving(false);
    }
  };

  const publishUpdate = async event => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await impactApi.createUpdate(form);
      setForm({
        projectKey: 'native-trees',
        title: '',
        summary: '',
        fieldDate: '',
        photoUrl: '',
        videoUrl: '',
        verified: false,
      });
      setMessage('Verified field update published.');
      await load();
    } catch (error) {
      setMessage(error.normalized?.message || error.response?.data?.message || 'Could not publish this update.');
    } finally {
      setSaving(false);
    }
  };

  const filteredContributions = useMemo(() => {
    return contributions.filter(c => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (projectFilter !== 'all' && c.project_key !== projectFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      return (
        String(c.order_id || '').toLowerCase().includes(q) ||
        String(c.customer_name || '').toLowerCase().includes(q) ||
        String(c.customer_email || '').toLowerCase().includes(q) ||
        String(c.collection_reference || '').toLowerCase().includes(q)
      );
    });
  }, [contributions, statusFilter, projectFilter, searchQuery]);

  const metrics = useMemo(() => {
    let totalPledged = 0;
    let totalCollected = 0;
    let pendingPledged = 0;
    let treesUnits = 0;
    let riverUnits = 0;
    let communityUnits = 0;

    contributions.forEach(c => {
      const amt = Number(c.amount) || 0;
      totalPledged += amt;
      if (c.status === 'collected') {
        totalCollected += amt;
      } else if (c.status === 'pledged') {
        pendingPledged += amt;
      }
      if (c.project_key === 'native-trees') treesUnits += amt / 125;
      else if (c.project_key === 'river-care') riverUnits += amt / 80;
      else if (c.project_key === 'community-care') communityUnits += amt / 150;
    });

    return {
      totalPledged,
      totalCollected,
      pendingPledged,
      treesUnits: Math.max(1, Math.round(treesUnits)),
      riverUnits: Math.max(1, Math.round(riverUnits)),
      communityUnits: Math.max(1, Math.round(communityUnits)),
    };
  }, [contributions]);

  const handleExportCsv = () => {
    const headers = [
      'Contribution ID',
      'Order ID',
      'Order Status',
      'Customer Name',
      'Customer Email',
      'Project Key',
      'Project Label',
      'Pledge Amount (INR)',
      'Ecological Unit Impact',
      'Status',
      'Collection Reference',
      'Created At',
    ];
    const escapeCell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = filteredContributions.map(c => {
      const bench = PROJECT_BENCHMARKS[c.project_key] || PROJECT_BENCHMARKS['native-trees'];
      const units = ((Number(c.amount) || 0) / bench.inrPerUnit).toFixed(2);
      return [
        c.id,
        c.order_id,
        c.order_status,
        c.customer_name,
        c.customer_email,
        c.project_key,
        PROJECT_LABELS[c.project_key] || c.project_key,
        Number(c.amount || 0).toFixed(2),
        `${units} (${bench.unitLabel})`,
        c.status,
        c.collection_reference || '',
        c.created_at || '',
      ]
        .map(escapeCell)
        .join(',');
    });
    const csv = `\uFEFF${headers.map(escapeCell).join(',')}\n${rows.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bhumivera-earth-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="space-y-8 p-4 text-slate-100 md:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
            Bhumivera Earth Ledger · ESG &amp; Ecological Audit
          </p>
          <h1 className="mt-2 font-serif text-3xl">Impact reconciliation</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Keep pledges separate from collected funds. Public figures include only reconciled collection and field
            reports with media evidence.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 border border-emerald-400/30 bg-emerald-500/15 px-3.5 py-2.5 text-xs font-bold text-emerald-200 hover:bg-emerald-500/25"
          >
            <Download size={15} />
            Export 12-Col Earth Ledger CSV
          </button>
          <button
            onClick={() => void load()}
            disabled={loading}
            title="Refresh records"
            aria-label="Refresh records"
            className="border border-slate-700 p-3 text-slate-300 hover:border-emerald-300 hover:text-emerald-200 disabled:opacity-50"
          >
            <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {message && (
        <p role="status" className="border-l-2 border-emerald-300 bg-emerald-300/5 px-4 py-3 text-sm text-slate-200">
          {message}
        </p>
      )}

      {/* 6-Card Ecological Telemetry Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-slate-800 bg-[#081b15]/80 p-3.5">
          <span className="text-[11px] text-slate-400 block">Total Pledged</span>
          <strong className="text-lg font-black text-white">
            ₹{metrics.totalPledged.toLocaleString('en-IN')}
          </strong>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#081b15]/80 p-3.5">
          <span className="text-[11px] text-slate-400 block">Verified Collected</span>
          <strong className="text-lg font-black text-emerald-300">
            ₹{metrics.totalCollected.toLocaleString('en-IN')}
          </strong>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#081b15]/80 p-3.5">
          <span className="text-[11px] text-slate-400 block">Pending COD Settlement</span>
          <strong className="text-lg font-black text-amber-300">
            ₹{metrics.pendingPledged.toLocaleString('en-IN')}
          </strong>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#081b15]/80 p-3.5">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sprout size={12} className="text-emerald-400" /> Native Saplings
          </span>
          <strong className="text-lg font-black text-emerald-200">{metrics.treesUnits}</strong>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#081b15]/80 p-3.5">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Droplets size={12} className="text-cyan-400" /> Watershed Units
          </span>
          <strong className="text-lg font-black text-cyan-200">{metrics.riverUnits} KL</strong>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#081b15]/80 p-3.5">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <HeartHandshake size={12} className="text-[#d4af37]" /> Farmer Care Hours
          </span>
          <strong className="text-lg font-black text-[#d4af37]">{metrics.communityUnits} hrs</strong>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">COD contributions</h2>
            <p className="mt-1 text-sm text-slate-500">
              Only mark collected after the customer payment has been reconciled.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search order, customer, ref…"
                className="border border-slate-700 bg-[#081b15]/90 pl-8 pr-3 py-1.5 text-xs text-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="border border-slate-700 bg-[#081b15]/90 px-3 py-1.5 text-xs text-white"
            >
              <option value="all">All Statuses</option>
              <option value="pledged">Pledged</option>
              <option value="collected">Collected</option>
            </select>
            <select
              value={projectFilter}
              onChange={e => setProjectFilter(e.target.value)}
              className="border border-slate-700 bg-[#081b15]/90 px-3 py-1.5 text-xs text-white"
            >
              <option value="all">All Ecological Projects</option>
              {PROJECTS.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border-y border-slate-800">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="text-xs uppercase tracking-widest text-slate-500">
              <tr>
                <th className="py-3 pr-4">Order</th>
                <th className="py-3 pr-4">Customer</th>
                <th className="py-3 pr-4">Project</th>
                <th className="py-3 pr-4">Biosphere Region</th>
                <th className="py-3 pr-4">Pledge</th>
                <th className="py-3 pr-4">Est. Field Impact</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3">Collection reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredContributions.map(contribution => {
                const bench =
                  PROJECT_BENCHMARKS[contribution.project_key] || PROJECT_BENCHMARKS['native-trees'];
                const estUnits = ((Number(contribution.amount) || 0) / bench.inrPerUnit).toFixed(2);
                return (
                  <tr key={contribution.id}>
                    <td className="py-4 pr-4">
                      #{contribution.order_id}
                      <span className="block text-xs text-slate-500">{contribution.order_status}</span>
                    </td>
                    <td className="py-4 pr-4">
                      {contribution.customer_name}
                      <span className="block text-xs text-slate-500">{contribution.customer_email}</span>
                    </td>
                    <td className="py-4 pr-4">
                      {PROJECT_LABELS[contribution.project_key] || contribution.project_key}
                    </td>
                    <td className="py-4 pr-4 text-xs text-slate-400">{bench.region}</td>
                    <td className="py-4 pr-4 font-semibold">
                      ₹{Number(contribution.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 pr-4 text-xs text-emerald-300 font-mono">
                      {estUnits} units
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={
                          contribution.status === 'collected'
                            ? 'text-emerald-300'
                            : contribution.status === 'pledged'
                            ? 'text-amber-300'
                            : 'text-slate-500'
                        }
                      >
                        {contribution.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <input
                          value={references[contribution.id] || ''}
                          onChange={event =>
                            setReferences(current => ({ ...current, [contribution.id]: event.target.value }))
                          }
                          disabled={
                            contribution.status !== 'pledged' || contribution.order_status !== 'delivered'
                          }
                          placeholder="Receipt / settlement reference"
                          className="min-w-52 border border-slate-700 bg-[#081b15]/90 backdrop-blur-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-300 disabled:opacity-40"
                        />
                        <button
                          onClick={() => void reconcile(contribution)}
                          disabled={
                            saving ||
                            contribution.status !== 'pledged' ||
                            contribution.order_status !== 'delivered'
                          }
                          aria-label="Verify collected contribution"
                          title="Verify collection"
                          className="border border-slate-700 px-3 text-emerald-200 hover:bg-emerald-300/10 disabled:opacity-40"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!loading && filteredContributions.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-slate-500">
                    No contribution pledges yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-8 border-t border-slate-800 pt-8 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <div className="mb-5">
            <h2 className="text-xl font-semibold">Publish field evidence</h2>
            <p className="mt-1 text-sm text-slate-500">
              A verified report requires a secure photo or video link and your on-ground confirmation.
            </p>
          </div>
          <form onSubmit={publishUpdate} className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-400">
              Project
              <select
                value={form.projectKey}
                onChange={event => setForm(current => ({ ...current, projectKey: event.target.value }))}
                className="mt-2 w-full border border-slate-700 bg-[#081b15]/90 backdrop-blur-xl px-3 py-3 text-sm text-white"
              >
                {PROJECTS.map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-semibold text-slate-400">
              Field date
              <input
                type="date"
                value={form.fieldDate}
                onChange={event => setForm(current => ({ ...current, fieldDate: event.target.value }))}
                className="mt-2 w-full border border-slate-700 bg-[#081b15]/90 backdrop-blur-xl px-3 py-3 text-sm text-white"
              />
            </label>
            <label className="text-xs font-semibold text-slate-400 sm:col-span-2">
              Report title
              <input
                required
                maxLength="180"
                value={form.title}
                onChange={event => setForm(current => ({ ...current, title: event.target.value }))}
                className="mt-2 w-full border border-slate-700 bg-[#081b15]/90 backdrop-blur-xl px-3 py-3 text-sm text-white"
              />
            </label>
            <label className="text-xs font-semibold text-slate-400 sm:col-span-2">
              What happened?
              <textarea
                required
                rows="4"
                value={form.summary}
                onChange={event => setForm(current => ({ ...current, summary: event.target.value }))}
                className="mt-2 w-full border border-slate-700 bg-[#081b15]/90 backdrop-blur-xl px-3 py-3 text-sm leading-6 text-white"
              />
            </label>
            <label className="text-xs font-semibold text-slate-400">
              Photo URL
              <input
                type="url"
                value={form.photoUrl}
                onChange={event => setForm(current => ({ ...current, photoUrl: event.target.value }))}
                placeholder="https://…"
                className="mt-2 w-full border border-slate-700 bg-[#081b15]/90 backdrop-blur-xl px-3 py-3 text-sm text-white"
              />
            </label>
            <label className="text-xs font-semibold text-slate-400">
              Video URL
              <input
                type="url"
                value={form.videoUrl}
                onChange={event => setForm(current => ({ ...current, videoUrl: event.target.value }))}
                placeholder="https://…"
                className="mt-2 w-full border border-slate-700 bg-[#081b15]/90 backdrop-blur-xl px-3 py-3 text-sm text-white"
              />
            </label>
            <label className="flex items-start gap-3 text-sm leading-6 text-slate-300 sm:col-span-2">
              <input
                required
                type="checkbox"
                checked={form.verified}
                onChange={event => setForm(current => ({ ...current, verified: event.target.checked }))}
                className="mt-1 h-4 w-4 accent-emerald-300"
              />
              <span>
                <ShieldCheck size={15} className="mr-1 inline text-emerald-300" />I confirm this report reflects
                completed on-ground work and the attached media is authentic.
              </span>
            </label>
            <button
              disabled={saving}
              className="inline-flex w-fit items-center gap-2 bg-emerald-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-200 disabled:opacity-50"
            >
              <FileImage size={16} />
              {saving ? 'Saving…' : 'Publish verified report'}
            </button>
          </form>
        </div>
        <aside className="border-l border-slate-800 pl-0 lg:pl-7">
          <h2 className="text-xl font-semibold">Published reports</h2>
          <div className="mt-4 space-y-4">
            {updates.slice(0, 8).map(update => (
              <article key={update.id} className="border-b border-slate-800 pb-4">
                <p className="text-xs uppercase tracking-widest text-emerald-300">
                  {PROJECT_LABELS[update.project_key] || update.project_key}
                </p>
                <h3 className="mt-1 font-semibold">{update.title}</h3>
                <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-400">{update.summary}</p>
              </article>
            ))}
            {!loading && updates.length === 0 && (
              <p className="text-sm text-slate-500">No reports have been published.</p>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}