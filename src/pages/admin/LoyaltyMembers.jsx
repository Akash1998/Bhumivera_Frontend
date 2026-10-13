import { useCallback, useEffect, useMemo, useState } from 'react';
import { Award, LoaderCircle, Pencil, Search, X } from 'lucide-react';
import { loyaltyTiers as loyaltyApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const emptyAdjustment = { points_delta: '', lifetime_points_delta: '', description: '' };

export default function LoyaltyMembers() {
  const [members, setMembers] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState(null);
  const [adjustment, setAdjustment] = useState(emptyAdjustment);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast() || {};

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [membersResponse, matrixResponse, transactionsResponse] = await Promise.all([
        loyaltyApi.getMembers(),
        loyaltyApi.getMatrix(),
        loyaltyApi.getTransactions({ limit: 50 }),
      ]);
      setMembers(membersResponse.data?.data || []);
      setTiers(matrixResponse.data?.data?.tiers || []);
      setTransactions(transactionsResponse.data?.data || []);
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not load loyalty members.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const filteredMembers = useMemo(() => members.filter(member =>
    `${member.name || ''} ${member.email || ''}`.toLowerCase().includes(query.toLowerCase())
  ), [members, query]);

  const tierFor = lifetimePoints => tiers
    .filter(tier => Number(tier.is_active) === 1 && Number(tier.min_points) <= Number(lifetimePoints || 0))
    .sort((first, second) => Number(second.min_points) - Number(first.min_points))[0] || null;

  const saveAdjustment = async event => {
    event.preventDefault();
    const pointsDelta = Number(adjustment.points_delta || 0);
    const lifetimePointsDelta = adjustment.lifetime_points_delta === ''
      ? Math.max(0, pointsDelta)
      : Number(adjustment.lifetime_points_delta);
    if ((!pointsDelta && !lifetimePointsDelta) || !Number.isInteger(pointsDelta) || !Number.isInteger(lifetimePointsDelta) || adjustment.description.trim().length < 5) {
      showToast?.('Enter a whole-point adjustment and a reason of at least five characters.', 'error');
      return;
    }
    setSaving(true);
    try {
      await loyaltyApi.adjustMember(draft.id, {
        points_delta: pointsDelta,
        lifetime_points_delta: lifetimePointsDelta,
        description: adjustment.description.trim(),
      });
      showToast?.('Loyalty adjustment recorded.', 'success');
      setDraft(null);
      setAdjustment(emptyAdjustment);
      await load();
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not apply this adjustment.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 text-slate-100">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div><p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Member ledger</p><h2 className="mt-2 text-2xl font-bold text-white">Loyalty members</h2><p className="mt-1 text-sm text-slate-400">Available points are redeemable at checkout; lifetime points determine tier qualification.</p></div>
        <label className="relative"><span className="sr-only">Search loyalty members</span><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Name or email" className="w-full min-w-56 border border-white/10 bg-white/[0.04] py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-emerald-400"/></label>
      </header>
      {loading ? <p role="status" className="flex items-center gap-2 text-sm text-slate-400"><LoaderCircle size={16} className="animate-spin"/>Loading member ledger…</p> : (
        <div className="overflow-x-auto border-y border-white/10">
          <table className="w-full min-w-[660px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500"><tr><th className="py-3 pr-4">Customer</th><th className="py-3 pr-4">Available points</th><th className="py-3 pr-4">Lifetime points</th><th className="py-3 pr-4">Current tier</th><th className="py-3 text-right">Action</th></tr></thead>
            <tbody className="divide-y divide-white/10">
              {filteredMembers.map(member => {
                const tier = tierFor(member.loyalty_lifetime_points);
                return <tr key={member.id}>
                  <td className="py-3 pr-4"><span className="block font-semibold text-white">{member.name}</span><span className="text-xs text-slate-500">{member.email}</span></td>
                  <td className="py-3 pr-4 font-mono text-emerald-200">{Number(member.loyalty_points || 0).toLocaleString()}</td>
                  <td className="py-3 pr-4 font-mono text-slate-300">{Number(member.loyalty_lifetime_points || 0).toLocaleString()}</td>
                  <td className="py-3 pr-4"><span className="inline-flex items-center gap-1.5"><Award size={14} style={{ color: tier?.color || '#34d399' }}/>{tier?.name || 'No active tier'}</span></td>
                  <td className="py-3 text-right"><button type="button" onClick={() => { setDraft(member); setAdjustment(emptyAdjustment); }} aria-label={`Adjust points for ${member.name}`} className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-emerald-300 hover:text-white"><Pencil size={13}/>Adjust</button></td>
                </tr>;
              })}
              {!filteredMembers.length && <tr><td colSpan="5" className="py-8 text-center text-sm text-slate-500">No loyalty members match this search.</td></tr>}
            </tbody>
          </table>
          <p className="py-3 text-xs text-slate-500">Showing up to 500 active customers. Every adjustment requires a reason and is stored in the points ledger.</p>
        </div>
      )}
      <section className="border-y border-white/10 py-4">
        <header className="mb-3 flex items-baseline justify-between gap-3"><h3 className="font-semibold text-white">Recent point transactions</h3><span className="text-xs text-slate-500">Latest 50 · append-only audit history</span></header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="uppercase text-slate-500"><tr><th className="py-2 pr-3">Date</th><th className="py-2 pr-3">Member</th><th className="py-2 pr-3">Type</th><th className="py-2 pr-3">Change</th><th className="py-2 pr-3">Balance after</th><th className="py-2">Reason / reference</th></tr></thead>
            <tbody className="divide-y divide-white/10">
              {transactions.map(transaction => <tr key={transaction.id}><td className="py-2.5 pr-3 text-slate-400">{new Date(transaction.created_at).toLocaleString()}</td><td className="py-2.5 pr-3 text-slate-200">{transaction.name}<span className="ml-2 text-slate-500">{transaction.email}</span></td><td className="py-2.5 pr-3 capitalize text-slate-300">{transaction.type}</td><td className={`py-2.5 pr-3 font-mono ${Number(transaction.points_delta) >= 0 ? 'text-emerald-300' : 'text-amber-300'}`}>{Number(transaction.points_delta) > 0 ? '+' : ''}{Number(transaction.points_delta).toLocaleString()}</td><td className="py-2.5 pr-3 font-mono text-slate-300">{Number(transaction.balance_after).toLocaleString()}</td><td className="max-w-xs truncate py-2.5 text-slate-400" title={transaction.description}>{transaction.description}</td></tr>)}
              {!transactions.length && <tr><td colSpan="6" className="py-6 text-center text-slate-500">No points activity recorded yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
      {draft && <div role="presentation" className="fixed inset-0 z-[120] grid place-items-center bg-black/70 p-4">
        <form role="dialog" aria-modal="true" aria-labelledby="loyalty-adjust-title" onSubmit={saveAdjustment} className="w-full max-w-md space-y-4 border border-white/15 bg-[#10241f] p-5 shadow-2xl">
          <header className="flex items-start justify-between gap-4"><div><h3 id="loyalty-adjust-title" className="text-lg font-semibold text-white">Adjust member points</h3><p className="mt-1 text-xs text-slate-400">{draft.name} · {Number(draft.loyalty_points || 0).toLocaleString()} available · {Number(draft.loyalty_lifetime_points || 0).toLocaleString()} lifetime</p></div><button type="button" aria-label="Close" onClick={() => setDraft(null)} className="p-1 text-slate-400 hover:text-white"><X size={17}/></button></header>
          <label className="block text-xs text-slate-300">Available balance change<input type="number" step="1" value={adjustment.points_delta} onChange={event => setAdjustment(current => ({ ...current, points_delta: event.target.value }))} placeholder="0" className="mt-1 w-full border border-white/15 bg-black/20 px-3 py-2 text-sm text-white"/><span className="mt-1 block text-slate-500">Negative changes cannot take the available balance below zero.</span></label>
          <label className="block text-xs text-slate-300">Lifetime tier-point change<input type="number" step="1" value={adjustment.lifetime_points_delta} onChange={event => setAdjustment(current => ({ ...current, lifetime_points_delta: event.target.value }))} placeholder="Defaults to positive balance adjustment" className="mt-1 w-full border border-white/15 bg-black/20 px-3 py-2 text-sm text-white"/></label>
          <label className="block text-xs text-slate-300">Required reason<textarea required minLength={5} maxLength={240} value={adjustment.description} onChange={event => setAdjustment(current => ({ ...current, description: event.target.value }))} rows={3} className="mt-1 w-full resize-y border border-white/15 bg-black/20 px-3 py-2 text-sm text-white"/></label>
          <button disabled={saving} type="submit" className="inline-flex items-center gap-2 bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-50">{saving ? <LoaderCircle size={15} className="animate-spin"/> : null}{saving ? 'Recording…' : 'Record adjustment'}</button>
        </form>
      </div>}
    </div>
  );
}
