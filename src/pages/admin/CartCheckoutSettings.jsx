import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { settings as settingsApi } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import { AlertCircle, CheckCircle, Save, Truck } from 'lucide-react';

const DEFAULT_CART_SETTINGS = {
  coupon_stack_policy: 'both',
  enforce_cart_rule_minimum: '0',
  cart_abandonment_coupon_enabled: '1',
  cart_abandonment_coupon_percent: '5',
  cart_abandonment_coupon_delay_minutes: '30',
  cart_abandonment_coupon_valid_days: '7',
  cart_abandonment_coupon_max_discount: '100',
};

const DEFAULT_SHIPPING_SETTINGS = {
  standard_charge: '50',
  express_charge: '150',
  free_shipping_threshold: '599',
};

export default function CartCheckoutSettings() {
  const { updatePublicSettings } = useSettings();
  const [cartSettings, setCartSettings] = useState(DEFAULT_CART_SETTINGS);
  const [shippingSettings, setShippingSettings] = useState(DEFAULT_SHIPPING_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    settingsApi.get()
      .then(response => {
        if (!active) return;
        const data = response.data || {};
        const values = { ...data.cart_rules, ...data.general };
        setCartSettings(current => ({
          ...current,
          ...Object.fromEntries(Object.keys(DEFAULT_CART_SETTINGS).map(key => [key, values[key] ?? current[key]])),
        }));
        setShippingSettings(current => ({ ...current, ...(data.shipping || {}) }));
      })
      .catch(loadError => {
        if (active) setError(loadError.normalized?.message || loadError.response?.data?.message || 'Could not load cart and shipping settings.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const save = async (event, section, values, successMessage) => {
    event.preventDefault();
    setSaving(section);
    setMessage('');
    setError('');
    try {
      await settingsApi.update(values);
      if (section === 'shipping') updatePublicSettings(values);
      setMessage(successMessage);
    } catch (saveError) {
      setError(saveError.normalized?.message || saveError.response?.data?.message || 'Could not save these settings.');
    } finally {
      setSaving('');
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {message && <p role="status" className="flex items-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-400/10 p-3 text-sm text-emerald-200"><CheckCircle size={16}/>{message}</p>}
      {error && <p role="alert" className="flex items-center gap-2 rounded-xl border border-rose-400/25 bg-rose-400/10 p-3 text-sm text-rose-200"><AlertCircle size={16}/>{error}</p>}

      <aside className="rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm leading-6 text-amber-100">
        <p className="font-semibold">Free delivery can have more than one source.</p>
        <p className="mt-1 text-amber-100/80">
          The threshold below controls standard delivery. Active cart rules, an applied free-delivery coupon, or a loyalty-tier benefit can also unlock it. Review <Link className="font-semibold underline" to="/admin/dashboard/cart-rules">Cart Rules</Link> or <Link className="font-semibold underline" to="/admin/dashboard/loyalty-matrix">Loyalty Tiers</Link> if a customer sees free delivery below the standard threshold.
        </p>
      </aside>

      <section className="admin-glass-panel rounded-2xl p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-2 text-emerald-200"><Truck size={18}/></span>
          <div>
            <h3 className="font-semibold text-white">Standard and premium delivery</h3>
            <p className="text-xs text-slate-400">Amounts customers see at checkout.</p>
          </div>
        </div>
        <form onSubmit={event => save(event, 'shipping', shippingSettings, 'Delivery settings saved.')} className="grid gap-4 sm:grid-cols-3">
          {[
            ['standard_charge', 'Standard delivery charge'],
            ['express_charge', 'Premium delivery charge'],
            ['free_shipping_threshold', 'Free delivery threshold'],
          ].map(([key, label]) => (
            <label key={key} className="text-sm text-slate-300">
              {label} (₹)
              <input
                type="number"
                min="0"
                value={shippingSettings[key]}
                onChange={event => setShippingSettings(current => ({ ...current, [key]: event.target.value }))}
                disabled={loading || Boolean(saving)}
                className="admin-glass-control mt-2 w-full rounded-lg px-3 py-2 text-white disabled:opacity-50"
              />
            </label>
          ))}
          <div className="sm:col-span-3">
            <button type="submit" disabled={loading || Boolean(saving)} className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300 disabled:opacity-50">
              <Save size={15}/>{saving === 'shipping' ? 'Saving…' : 'Save delivery settings'}
            </button>
          </div>
        </form>
      </section>

      <section className="admin-glass-panel rounded-2xl p-5 sm:p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-white">Cart rules and abandoned-cart coupons</h3>
          <p className="mt-1 text-xs text-slate-400">Choose how discounts combine and whether qualifying cart minimums are enforced.</p>
        </div>
        <form onSubmit={event => save(event, 'cart', cartSettings, 'Cart behavior settings saved.')} className="space-y-5">
          <fieldset disabled={loading || Boolean(saving)}>
            <legend className="mb-2 block text-sm font-medium text-slate-300">Coupon and cart-rule stacking</legend>
            <div role="radiogroup" aria-label="Coupon and cart-rule stacking" className="flex flex-wrap gap-2">
              {[
                ['rule_first', 'Rule first'],
                ['coupon_first', 'Coupon first'],
                ['both', 'Allow both'],
              ].map(([value, label]) => (
                <label key={value} className={`cursor-pointer rounded-lg border px-3 py-2 text-sm ${cartSettings.coupon_stack_policy === value ? 'border-emerald-400 bg-emerald-400/10 text-emerald-200' : 'border-white/10 text-slate-400'}`}>
                  <input type="radio" name="coupon_stack_policy" value={value} checked={cartSettings.coupon_stack_policy === value} onChange={() => setCartSettings(current => ({ ...current, coupon_stack_policy: value }))} className="sr-only"/>
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex items-center justify-between gap-4 rounded-lg border border-white/10 p-4 text-sm text-slate-200">
            <span><span className="block font-medium">Enforce cart-rule minimums</span><span className="mt-1 block text-xs text-slate-500">Prevent checkout below a rule minimum when that rule is marked as enforced.</span></span>
            <input type="checkbox" checked={cartSettings.enforce_cart_rule_minimum === '1' || cartSettings.enforce_cart_rule_minimum === 1} onChange={event => setCartSettings(current => ({ ...current, enforce_cart_rule_minimum: event.target.checked ? '1' : '0' }))} disabled={loading || Boolean(saving)} className="h-4 w-4 accent-emerald-400 disabled:opacity-50"/>
          </label>

          <div className="rounded-xl border border-white/10 p-4">
            <label className="flex items-center justify-between gap-4 text-sm text-slate-200">
              <span><span className="block font-medium">Personal abandoned-cart coupon</span><span className="mt-1 block text-xs text-slate-500">Issue a one-use coupon to a signed-in customer after their cart is inactive.</span></span>
              <input type="checkbox" checked={cartSettings.cart_abandonment_coupon_enabled === '1' || cartSettings.cart_abandonment_coupon_enabled === 1} onChange={event => setCartSettings(current => ({ ...current, cart_abandonment_coupon_enabled: event.target.checked ? '1' : '0' }))} disabled={loading || Boolean(saving)} className="h-4 w-4 accent-emerald-400 disabled:opacity-50"/>
            </label>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['cart_abandonment_coupon_percent', 'Discount (%)', 1, 50],
                ['cart_abandonment_coupon_delay_minutes', 'Idle time (minutes)', 1, 10080],
                ['cart_abandonment_coupon_valid_days', 'Valid for (days)', 1, 30],
                ['cart_abandonment_coupon_max_discount', 'Maximum discount (₹)', 1, 100000],
              ].map(([key, label, min, max]) => (
                <label key={key} className="text-xs text-slate-400">{label}
                  <input type="number" min={min} max={max} value={cartSettings[key]} onChange={event => setCartSettings(current => ({ ...current, [key]: event.target.value }))} disabled={loading || Boolean(saving)} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50"/>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading || Boolean(saving)} className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300 disabled:opacity-50">
            <Save size={15}/>{saving === 'cart' ? 'Saving…' : 'Save cart behavior'}
          </button>
        </form>
      </section>
    </div>
  );
}
