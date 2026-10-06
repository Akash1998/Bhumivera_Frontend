import { useEffect, useState } from 'react';
import { cartRules as cartRulesApi, products as productsApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { BadgeCheck, Gift, LoaderCircle, Pencil, Plus, RefreshCw, ShoppingCart, Trash2, Truck, X } from 'lucide-react';

const EMPTY_RULE = {
  name: '', description: '', priority: 0, min_cart_value: 799, max_cart_value: '',
  discount_amount: 0, discount_percent: 0, free_shipping_enabled: 1,
  gift_product_id: '', gift_quantity: 1, loyalty_bonus_points: 100,
  auto_coupon_code: '', enforce_min_checkout: 0, badge_text: '',
  start_time: '', end_time: '', status: 'active',
};

const money = value => `₹${(Number(value) || 0).toLocaleString('en-IN')}`;

export default function MinCartValueCenter() {
  const [rules, setRules] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editor, setEditor] = useState(null);
  const [subtotal, setSubtotal] = useState(500);
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const { showToast } = useToast() || {};

  const refresh = async () => {
    setLoading(true);
    try {
      const [rulesResponse, productResponse] = await Promise.all([
        cartRulesApi.list(),
        productsApi.getAllAdmin(),
      ]);
      setRules(rulesResponse.data?.data || []);
      setProducts(productResponse.data?.products || productResponse.data?.data || productResponse.data || []);
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not load cart rules.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setPreviewLoading(true);
      try {
        const response = await cartRulesApi.preview(subtotal);
        setPreview(response.data);
      } catch (error) {
        showToast?.(error.normalized?.message || 'Could not calculate the preview.', 'error');
      } finally {
        setPreviewLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [subtotal]);

  const openEditor = rule => setEditor(rule ? { ...EMPTY_RULE, ...rule } : { ...EMPTY_RULE });

  const saveRule = async event => {
    event.preventDefault();
    const payload = {
      ...editor,
      priority: Number(editor.priority) || 0,
      min_cart_value: Number(editor.min_cart_value),
      max_cart_value: editor.max_cart_value === '' ? null : Number(editor.max_cart_value),
      discount_amount: Number(editor.discount_amount) || 0,
      discount_percent: Number(editor.discount_percent) || 0,
      free_shipping_enabled: Number(editor.free_shipping_enabled),
      gift_product_id: editor.gift_product_id === '' ? null : Number(editor.gift_product_id),
      gift_quantity: Number(editor.gift_quantity) || 1,
      loyalty_bonus_points: Number(editor.loyalty_bonus_points) || 0,
      enforce_min_checkout: Number(editor.enforce_min_checkout),
      start_time: editor.start_time || null,
      end_time: editor.end_time || null,
    };
    setSaving(true);
    try {
      if (editor.id) await cartRulesApi.update(editor.id, payload);
      else await cartRulesApi.create(payload);
      showToast?.('Cart rule saved.', 'success');
      setEditor(null);
      await refresh();
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not save this cart rule.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleRule = async rule => {
    try {
      await cartRulesApi.toggle(rule.id, rule.status === 'active' ? 'inactive' : 'active');
      await refresh();
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not change rule status.', 'error');
    }
  };

  const deleteRule = async rule => {
    if (!window.confirm(`Delete the “${rule.name}” cart rule?`)) return;
    try {
      await cartRulesApi.remove(rule.id);
      showToast?.('Cart rule deleted.', 'success');
      await refresh();
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not delete this cart rule.', 'error');
    }
  };

  const activeCount = rules.filter(rule => rule.status === 'active').length;
  const giftCount = rules.filter(rule => rule.status === 'active' && rule.gift_product_id).length;
  const shippingCount = rules.filter(rule => rule.status === 'active' && Number(rule.free_shipping_enabled)).length;
  const enforcedCount = rules.filter(rule => rule.status === 'active' && Number(rule.enforce_min_checkout)).length;

  return (
    <div className="space-y-6 text-slate-100">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">Promotions / Cart thresholds</p>
          <h2 className="mt-2 text-2xl font-black text-white">MIN-CART-VALUE CONTROL CENTER</h2>
        </div>
        <div className="flex gap-2">
          <button title="Refresh rules" onClick={refresh} className="rounded-lg border border-slate-700 p-2.5 text-slate-300 hover:border-emerald-500 hover:text-white"><RefreshCw size={17}/></button>
          <button onClick={() => openEditor(null)} className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-300"><Plus size={17}/> New rule</button>
        </div>
      </header>

      <section aria-label="Cart rule metrics" className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        {[
          ['Total rules', rules.length, ShoppingCart],
          ['Active rules', activeCount, BadgeCheck],
          ['Gift rules', giftCount, Gift],
          ['Free shipping', shippingCount, Truck],
          ['Enforced tiers', enforcedCount, LoaderCircle],
        ].map(([label, value, Icon]) => <div key={label} className="border-b border-slate-800 py-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400"><Icon size={15} className="text-emerald-400"/>{label}</div>
          <p className="mt-2 text-2xl font-bold text-white">{value}</p>
        </div>)}
      </section>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0">
          <div className="overflow-x-auto border-y border-slate-800">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="text-[10px] uppercase tracking-wider text-slate-500">
                <tr><th className="py-3 pr-4">Rule</th><th className="py-3 pr-4">Cart range</th><th className="py-3 pr-4">Benefits</th><th className="py-3 pr-4">Enforced</th><th className="py-3 pr-4">Status</th><th className="py-3 text-right">Actions</th></tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan="6" className="py-8 text-center text-slate-500">Loading rules…</td></tr> : rules.length === 0 ? <tr><td colSpan="6" className="py-8 text-center text-slate-500">No cart rules yet.</td></tr> : rules.map(rule => (
                  <tr key={rule.id} className="border-t border-slate-800/80 align-top">
                    <td className="py-4 pr-4"><p className="font-semibold text-white">{rule.name}</p><p className="mt-1 text-xs text-slate-500">Priority {rule.priority} {rule.badge_text ? `· ${rule.badge_text}` : ''}</p></td>
                    <td className="py-4 pr-4 text-slate-300">{money(rule.min_cart_value)}{rule.max_cart_value ? ` – ${money(rule.max_cart_value)}` : '+'}</td>
                    <td className="py-4 pr-4 text-xs leading-5 text-slate-400">{Number(rule.discount_amount) ? `${money(rule.discount_amount)} off · ` : ''}{Number(rule.discount_percent) ? `${rule.discount_percent}% off · ` : ''}{Number(rule.free_shipping_enabled) ? 'Free delivery · ' : ''}{Number(rule.loyalty_bonus_points) ? `${rule.loyalty_bonus_points} pts` : ''}{rule.gift_product_id ? ' · Gift' : ''}</td>
                    <td className="py-4 pr-4 text-slate-400">{Number(rule.enforce_min_checkout) ? 'Yes' : 'No'}</td>
                    <td className="py-4 pr-4"><button onClick={() => toggleRule(rule)} className={`text-xs font-semibold ${rule.status === 'active' ? 'text-emerald-400' : 'text-slate-500'}`}>{rule.status === 'active' ? 'Active' : 'Inactive'}</button></td>
                    <td className="py-4 text-right"><div className="inline-flex gap-1"><button title="Edit rule" onClick={() => openEditor(rule)} className="rounded p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><Pencil size={15}/></button><button title="Delete rule" onClick={() => deleteRule(rule)} className="rounded p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-300"><Trash2 size={15}/></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="border-l border-slate-800 pl-0 xl:pl-6">
          <h3 className="text-sm font-bold text-white">Subtotal simulator</h3>
          <label htmlFor="cart-rule-subtotal" className="mt-5 block text-xs text-slate-400">Cart subtotal</label>
          <div className="mt-2 flex items-center gap-3"><span className="text-sm text-slate-500">₹</span><input id="cart-rule-subtotal" type="number" min="0" step="25" value={subtotal} onChange={event => setSubtotal(Math.max(0, Number(event.target.value) || 0))} className="min-w-0 flex-1 border-b border-slate-700 bg-transparent py-2 text-lg font-bold text-white outline-none focus:border-emerald-400"/></div>
          <input aria-label="Adjust simulated subtotal" type="range" min="0" max="10000" step="25" value={subtotal} onChange={event => setSubtotal(Number(event.target.value))} className="mt-5 w-full accent-emerald-400"/>
          <div className="mt-6 space-y-4 border-t border-slate-800 pt-4">
            {previewLoading ? <p className="text-xs text-slate-500">Updating preview…</p> : preview ? <>
              <div><p className="text-[10px] uppercase tracking-wider text-slate-500">Unlocked rules</p><p className="mt-1 text-sm font-semibold text-white">{preview.badges?.length ? preview.badges.join(', ') : 'No tier unlocked'}</p></div>
              <div className="flex justify-between text-xs"><span className="text-slate-400">Rule savings</span><span className="font-semibold text-emerald-300">{money(preview.totalDiscount)}</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-400">Delivery</span><span className="font-semibold text-white">{preview.freeShipping ? 'Free' : 'Standard'}</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-400">Bonus points</span><span className="font-semibold text-white">{preview.loyaltyBonusPoints || 0}</span></div>
              {preview.enforcedMin !== null && <p className="border-l-2 border-amber-400 pl-3 text-xs text-amber-200">Add {money(preview.missingAmount)} to meet the enforced minimum.</p>}
            </> : <p className="text-xs text-slate-500">Preview unavailable.</p>}
          </div>
        </aside>
      </div>

      {editor && <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="cart-rule-editor-title">
        <form onSubmit={saveRule} className="my-auto w-full max-w-3xl border border-slate-700 bg-slate-950 p-5 shadow-2xl sm:p-7">
          <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-4"><h3 id="cart-rule-editor-title" className="text-lg font-bold text-white">{editor.id ? 'Edit cart rule' : 'Create cart rule'}</h3><button type="button" aria-label="Close editor" onClick={() => setEditor(null)} className="p-2 text-slate-400 hover:text-white"><X size={18}/></button></div>
          <div className="grid max-h-[70vh] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
            <label className="text-xs text-slate-400">Rule name<input required value={editor.name} onChange={event => setEditor({ ...editor, name: event.target.value })} className="mt-1 w-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"/></label>
            <label className="text-xs text-slate-400">Priority<input type="number" value={editor.priority} onChange={event => setEditor({ ...editor, priority: event.target.value })} className="mt-1 w-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"/></label>
            <label className="text-xs text-slate-400">Minimum cart value<input required min="0" type="number" value={editor.min_cart_value} onChange={event => setEditor({ ...editor, min_cart_value: event.target.value })} className="mt-1 w-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"/></label>
            <label className="text-xs text-slate-400">Maximum cart value<input min="0" type="number" value={editor.max_cart_value ?? ''} onChange={event => setEditor({ ...editor, max_cart_value: event.target.value })} className="mt-1 w-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"/></label>
            <label className="text-xs text-slate-400">Fixed discount<input min="0" type="number" value={editor.discount_amount} onChange={event => setEditor({ ...editor, discount_amount: event.target.value })} className="mt-1 w-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"/></label>
            <label className="text-xs text-slate-400">Percent discount<input min="0" max="100" type="number" value={editor.discount_percent} onChange={event => setEditor({ ...editor, discount_percent: event.target.value })} className="mt-1 w-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"/></label>
            <label className="text-xs text-slate-400">Gift product<select value={editor.gift_product_id ?? ''} onChange={event => setEditor({ ...editor, gift_product_id: event.target.value })} className="mt-1 w-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"><option value="">No gift selected</option>{products.map(product => <option key={product.id || product._id} value={product.id || product._id}>{product.name}</option>)}</select></label>
            <label className="text-xs text-slate-400">Gift quantity<input min="1" type="number" value={editor.gift_quantity} onChange={event => setEditor({ ...editor, gift_quantity: event.target.value })} className="mt-1 w-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"/></label>
            <label className="text-xs text-slate-400">Loyalty bonus points<input min="0" type="number" value={editor.loyalty_bonus_points} onChange={event => setEditor({ ...editor, loyalty_bonus_points: event.target.value })} className="mt-1 w-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"/></label>
            <label className="text-xs text-slate-400">Auto coupon code<input value={editor.auto_coupon_code ?? ''} onChange={event => setEditor({ ...editor, auto_coupon_code: event.target.value })} className="mt-1 w-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"/></label>
            <label className="text-xs text-slate-400">Starts at<input type="datetime-local" value={editor.start_time ? String(editor.start_time).slice(0, 16).replace(' ', 'T') : ''} onChange={event => setEditor({ ...editor, start_time: event.target.value })} className="mt-1 w-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"/></label>
            <label className="text-xs text-slate-400">Ends at<input type="datetime-local" value={editor.end_time ? String(editor.end_time).slice(0, 16).replace(' ', 'T') : ''} onChange={event => setEditor({ ...editor, end_time: event.target.value })} className="mt-1 w-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"/></label>
            <label className="text-xs text-slate-400">Badge text<input value={editor.badge_text ?? ''} onChange={event => setEditor({ ...editor, badge_text: event.target.value })} className="mt-1 w-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"/></label>
            <label className="text-xs text-slate-400">Status<select value={editor.status} onChange={event => setEditor({ ...editor, status: event.target.value })} className="mt-1 w-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"><option value="active">Active</option><option value="inactive">Inactive</option></select></label>
            <label className="text-xs text-slate-400">Description<input value={editor.description ?? ''} onChange={event => setEditor({ ...editor, description: event.target.value })} className="mt-1 w-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"/></label>
            <label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={Boolean(Number(editor.free_shipping_enabled))} onChange={event => setEditor({ ...editor, free_shipping_enabled: event.target.checked ? 1 : 0 })}/>Free shipping</label>
            <label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={Boolean(Number(editor.enforce_min_checkout))} onChange={event => setEditor({ ...editor, enforce_min_checkout: event.target.checked ? 1 : 0 })}/>Enforce checkout minimum</label>
          </div>
          <div className="mt-6 flex justify-end gap-2 border-t border-slate-800 pt-4"><button type="button" onClick={() => setEditor(null)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button><button disabled={saving} type="submit" className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 disabled:opacity-50">{saving ? 'Saving…' : 'Save rule'}</button></div>
        </form>
      </div>}
    </div>
  );
}