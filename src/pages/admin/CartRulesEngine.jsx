import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { cartRules as cartRulesApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Download, Layers3, Plus, RefreshCw, Search, ShieldCheck, Trash2 } from 'lucide-react';

const blankRule = {
  name: '',
  description: '',
  priority: 0,
  min_cart_value: 0,
  max_cart_value: '',
  discount_amount: 0,
  discount_percent: 0,
  free_shipping_enabled: 0,
  gift_product_id: '',
  gift_quantity: 1,
  loyalty_bonus_points: 0,
  loyalty_tier_id: '',
  customer_id: '',
  start_time: '',
  end_time: '',
  enforce_min_checkout: 0,
  badge_text: '',
  status: 'active',
};
const dateToIso = value => (value ? new Date(value).toISOString() : null);

export default function CartRulesEngine() {
  const [rules, setRules] = useState([]);
  const [loyaltyTiers, setLoyaltyTiers] = useState([]);
  const [draft, setDraft] = useState(blankRule);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast() || {};

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rulesResponse, tiersResponse] = await Promise.all([
        cartRulesApi.list(),
        cartRulesApi.getLoyaltyTiers(),
      ]);
      setRules(rulesResponse.data?.data || []);
      setLoyaltyTiers(tiersResponse.data?.data || []);
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not load cart rules.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const create = async event => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      ...draft,
      priority: Number(draft.priority) || 0,
      min_cart_value: Number(draft.min_cart_value) || 0,
      max_cart_value: draft.max_cart_value === '' ? null : Number(draft.max_cart_value),
      discount_amount: Math.max(0, Number(draft.discount_amount) || 0),
      discount_percent: Math.max(0, Math.min(100, Number(draft.discount_percent) || 0)),
      free_shipping_enabled: draft.free_shipping_enabled ? 1 : 0,
      gift_product_id: draft.gift_product_id === '' ? null : Number(draft.gift_product_id),
      gift_quantity: Math.max(1, Number(draft.gift_quantity) || 1),
      loyalty_bonus_points: Math.max(0, Number(draft.loyalty_bonus_points) || 0),
      loyalty_tier_id: draft.loyalty_tier_id === '' ? null : Number(draft.loyalty_tier_id),
      customer_id: draft.customer_id === '' ? null : Number(draft.customer_id),
      enforce_min_checkout: draft.enforce_min_checkout ? 1 : 0,
      start_time: dateToIso(draft.start_time),
      end_time: dateToIso(draft.end_time),
    };
    try {
      await cartRulesApi.create(payload);
      setDraft(blankRule);
      showToast?.('Cart rule created.', 'success');
      await load();
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not create cart rule.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggle = async rule => {
    try {
      await cartRulesApi.toggle(rule.id, rule.status === 'active' ? 'inactive' : 'active');
      await load();
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not change rule status.', 'error');
    }
  };

  const remove = async rule => {
    if (!window.confirm(`Delete ${rule.name}?`)) return;
    try {
      await cartRulesApi.remove(rule.id);
      await load();
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not delete rule.', 'error');
    }
  };

  const filteredRules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rules;
    return rules.filter(
      r =>
        String(r.name || '').toLowerCase().includes(q) ||
        String(r.badge_text || '').toLowerCase().includes(q) ||
        String(r.description || '').toLowerCase().includes(q)
    );
  }, [rules, searchQuery]);

  const handleExportCsv = () => {
    const headers = [
      'Rule ID',
      'Rule Name',
      'Priority',
      'Min Cart Value (INR)',
      'Max Cart Value (INR)',
      'Fixed Discount (INR)',
      'Percent Discount (%)',
      'Free Shipping',
      'Gift Product ID',
      'Gift Qty',
      'Loyalty Bonus Pts',
      'Target Tier',
      'Enforce Minimum Checkout',
      'Status',
    ];
    const escapeCell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = filteredRules.map(r =>
      [
        r.id,
        r.name,
        r.priority,
        r.min_cart_value,
        r.max_cart_value ?? 'Unlimited',
        r.discount_amount || 0,
        r.discount_percent || 0,
        Number(r.free_shipping_enabled) ? 'Yes' : 'No',
        r.gift_product_id || '',
        r.gift_quantity || 0,
        r.loyalty_bonus_points || 0,
        r.loyalty_tier_name || 'All Members',
        Number(r.enforce_min_checkout) ? 'Yes' : 'No',
        r.status,
      ]
        .map(escapeCell)
        .join(',')
    );
    const csv = `\uFEFF${headers.map(escapeCell).join(',')}\n${rows.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bhumivera-cart-rules-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-slate-100">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">
            Cart policy &amp; 100X Dynamic Thresholds
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Cart rules</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-3.5 py-2 text-xs font-bold text-emerald-200 hover:bg-emerald-500/25"
          >
            <Download size={14} /> Export 14-Col Rules CSV
          </button>
          <button
            title="Refresh rules"
            onClick={load}
            className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 backdrop-blur-lg transition hover:border-emerald-400/50 hover:bg-white/10"
          >
            <RefreshCw size={17} />
          </button>
        </div>
      </header>

      <form onSubmit={create} className="admin-glass-panel grid gap-4 rounded-2xl p-5 md:grid-cols-4">
        <label className="text-xs text-slate-300">
          Rule name
          <input
            required
            value={draft.name}
            onChange={event => setDraft(current => ({ ...current, name: event.target.value }))}
            className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs text-slate-300">
          Priority
          <input
            type="number"
            value={draft.priority}
            onChange={event => setDraft(current => ({ ...current, priority: event.target.value }))}
            className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs text-slate-300">
          Minimum ₹
          <input
            min="0"
            required
            type="number"
            value={draft.min_cart_value}
            onChange={event => setDraft(current => ({ ...current, min_cart_value: event.target.value }))}
            className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs text-slate-300">
          Maximum ₹
          <input
            min="0"
            type="number"
            value={draft.max_cart_value}
            onChange={event => setDraft(current => ({ ...current, max_cart_value: event.target.value }))}
            className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs text-slate-300">
          Discount ₹
          <input
            min="0"
            type="number"
            value={draft.discount_amount}
            onChange={event => setDraft(current => ({ ...current, discount_amount: event.target.value }))}
            className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs text-slate-300">
          Discount %
          <input
            min="0"
            max="100"
            type="number"
            value={draft.discount_percent}
            onChange={event => setDraft(current => ({ ...current, discount_percent: event.target.value }))}
            className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs text-slate-300">
          Member tier
          <select
            value={draft.loyalty_tier_id}
            onChange={event => setDraft(current => ({ ...current, loyalty_tier_id: event.target.value }))}
            className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All members</option>
            {loyaltyTiers.map(tier => (
              <option key={tier.id} value={tier.id}>
                {tier.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-slate-300">
          Specific customer ID (blank = everyone)
          <input
            min="1"
            step="1"
            type="number"
            value={draft.customer_id}
            onChange={event => setDraft(current => ({ ...current, customer_id: event.target.value }))}
            className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs text-slate-300">
          Gift product ID
          <input
            min="1"
            type="number"
            value={draft.gift_product_id}
            onChange={event => setDraft(current => ({ ...current, gift_product_id: event.target.value }))}
            className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs text-slate-300">
          Gift quantity
          <input
            min="1"
            type="number"
            value={draft.gift_quantity}
            onChange={event => setDraft(current => ({ ...current, gift_quantity: event.target.value }))}
            className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs text-slate-300">
          Bonus loyalty points
          <input
            min="0"
            type="number"
            value={draft.loyalty_bonus_points}
            onChange={event => setDraft(current => ({ ...current, loyalty_bonus_points: event.target.value }))}
            className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"
          />
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-300">
          <input
            type="checkbox"
            checked={Boolean(Number(draft.free_shipping_enabled))}
            onChange={event =>
              setDraft(current => ({ ...current, free_shipping_enabled: event.target.checked ? 1 : 0 }))
            }
            className="h-4 w-4 accent-emerald-400"
          />
          Free shipping
        </label>
        <label className="text-xs text-slate-300">
          Starts at
          <input
            type="datetime-local"
            value={draft.start_time}
            onChange={event => setDraft(current => ({ ...current, start_time: event.target.value }))}
            className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs text-slate-300">
          Ends at
          <input
            type="datetime-local"
            value={draft.end_time}
            onChange={event => setDraft(current => ({ ...current, end_time: event.target.value }))}
            className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs text-slate-300">
          Badge text
          <input
            value={draft.badge_text}
            onChange={event => setDraft(current => ({ ...current, badge_text: event.target.value }))}
            className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"
          />
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-300">
          <input
            type="checkbox"
            checked={Boolean(Number(draft.enforce_min_checkout))}
            onChange={event =>
              setDraft(current => ({ ...current, enforce_min_checkout: event.target.checked ? 1 : 0 }))
            }
            className="h-4 w-4 accent-emerald-400"
          />
          Enforce minimum
        </label>
        <label className="text-xs text-slate-300 md:col-span-3">
          Description
          <input
            value={draft.description}
            onChange={event => setDraft(current => ({ ...current, description: event.target.value }))}
            className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"
          />
        </label>
        <button
          disabled={saving}
          type="submit"
          className="inline-flex items-center justify-center gap-2 self-end rounded-lg bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-50"
        >
          <Plus size={15} />
          Add rule
        </button>
      </form>

      <div className="admin-glass-panel overflow-hidden rounded-2xl">
        <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-white">
            Expanded 10-Column Cart Rules Matrix ({filteredRules.length})
          </span>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search rule name or badge…"
              className="rounded-xl border border-white/15 bg-black/40 pl-8 pr-3 py-1.5 text-xs text-white"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-white/[0.035] text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th>Rule</th>
                <th>Priority</th>
                <th>Range (₹)</th>
                <th>Discount</th>
                <th>Free Ship / Gift</th>
                <th>Bonus Pts</th>
                <th>Window</th>
                <th>Enforced</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan="11" className="py-8 text-center text-slate-400">
                    Loading…
                  </td>
                </tr>
              ) : (
                filteredRules.map(rule => (
                  <tr key={rule.id} className="transition-colors hover:bg-white/[0.035]">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">#{rule.id}</td>
                    <td className="py-3 font-semibold text-white">
                      {rule.name}
                      {rule.badge_text && (
                        <span className="block text-[10px] text-[#d4af37]">{rule.badge_text}</span>
                      )}
                    </td>
                    <td className="font-mono text-xs text-slate-400">P{rule.priority}</td>
                    <td className="font-mono text-xs">
                      ₹{rule.min_cart_value} – {rule.max_cart_value ? `₹${rule.max_cart_value}` : '∞'}
                    </td>
                    <td className="text-xs text-emerald-300">
                      {Number(rule.discount_percent) || 0}% · ₹{Number(rule.discount_amount) || 0}
                    </td>
                    <td className="text-xs text-slate-300">
                      {Number(rule.free_shipping_enabled) ? 'Free Ship ' : ''}
                      {rule.gift_product_name ? `· Gift: ${rule.gift_product_name}` : ''}
                      {!Number(rule.free_shipping_enabled) && !rule.gift_product_name ? '—' : ''}
                    </td>
                    <td className="font-mono text-xs text-[#d4af37]">
                      +{Number(rule.loyalty_bonus_points || 0)} pts
                    </td>
                    <td className="text-xs text-slate-400">
                      {rule.start_time || 'Always'} → {rule.end_time || 'Open'}
                    </td>
                    <td>
                      {Number(rule.enforce_min_checkout) ? (
                        <ShieldCheck size={15} className="text-emerald-400" />
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      <button onClick={() => toggle(rule)} className="text-xs text-emerald-300">
                        {rule.status}
                      </button>
                    </td>
                    <td>
                      <button
                        aria-label={`Delete ${rule.name}`}
                        onClick={() => remove(rule)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-400/10 hover:text-rose-300"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && filteredRules.length === 0 && (
          <div className="py-8 text-center text-sm text-slate-400">
            <Layers3 className="mx-auto mb-2" />
            No rules configured.
          </div>
        )}
      </div>
    </div>
  );
}
