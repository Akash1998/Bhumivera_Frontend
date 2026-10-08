import { useEffect, useState } from 'react';
import { coupons as couponsApi, products as productsApi, settings as settingsApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Gift, Save } from 'lucide-react';

const INITIAL = {
  lifecycle_third_order_enabled: '0',
  lifecycle_third_order_gift_product_id: '',
  lifecycle_winback_enabled: '0',
  lifecycle_winback_days: '7',
  lifecycle_churn_days: '90',
  lifecycle_birthday_enabled: '0',
  lifecycle_birthday_coupon_code: '',
};

export default function LifecycleOffers() {
  const [values, setValues] = useState(INITIAL);
  const [products, setProducts] = useState([]);
  const [couponCodes, setCouponCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast() || {};

  useEffect(() => {
    let active = true;
    Promise.all([settingsApi.get(), productsApi.getAllAdmin(), couponsApi.getAllAdmin()]).then(([settingResponse, productResponse, couponResponse]) => {
      if (!active) return;
      setValues({ ...INITIAL, ...(settingResponse.data?.lifecycle || {}) });
      setProducts(productResponse.data?.products || productResponse.data?.data || productResponse.data || []);
      setCouponCodes((couponResponse.data?.data || couponResponse.data?.coupons || couponResponse.data || []).map(coupon => coupon.code).filter(Boolean));
    }).catch(error => {
      if (active) showToast?.(error.normalized?.message || 'Could not load lifecycle offers.', 'error');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [showToast]);

  const set = (key, value) => setValues(current => ({ ...current, [key]: String(value) }));
  const save = async event => {
    event.preventDefault();
    setSaving(true);
    try {
      await settingsApi.update(values);
      showToast?.('Lifecycle offers saved.', 'success');
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not save lifecycle offers.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-sm text-slate-400">Loading lifecycle settings…</p>;

  return (
    <form onSubmit={save} className="space-y-6 text-slate-100">
      <header className="border-b border-slate-800 pb-5"><p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Promotion controls</p><h2 className="mt-2 text-2xl font-black text-white">Lifecycle Offers</h2></header>
      <section className="grid gap-6 border-y border-slate-800 py-5 lg:grid-cols-3">
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-white"><input type="checkbox" checked={values.lifecycle_third_order_enabled === '1' || values.lifecycle_third_order_enabled === 1} onChange={event => set('lifecycle_third_order_enabled', event.target.checked ? '1' : '0')} className="h-4 w-4 accent-emerald-400"/>Third-order gift</label>
          <label className="block text-xs text-slate-400">Gift product<select value={values.lifecycle_third_order_gift_product_id} onChange={event => set('lifecycle_third_order_gift_product_id', event.target.value)} className="mt-2 w-full border border-slate-700 bg-[#081b15]/90 backdrop-blur-xl px-3 py-2 text-sm text-white"><option value="">Choose a product</option>{products.map(product => <option key={product.id || product._id} value={product.id || product._id}>{product.name}</option>)}</select></label>
        </div>
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-white"><input type="checkbox" checked={values.lifecycle_winback_enabled === '1' || values.lifecycle_winback_enabled === 1} onChange={event => set('lifecycle_winback_enabled', event.target.checked ? '1' : '0')} className="h-4 w-4 accent-emerald-400"/>Win-back offer</label>
          <label className="block text-xs text-slate-400">Inactive days<input type="number" min="1" value={values.lifecycle_winback_days} onChange={event => set('lifecycle_winback_days', event.target.value)} className="mt-2 w-full border-b border-slate-700 bg-transparent px-1 py-2 text-sm text-white"/></label>
          <label className="block text-xs text-slate-400">Churn window (days)<input type="number" min="1" value={values.lifecycle_churn_days} onChange={event => set('lifecycle_churn_days', event.target.value)} className="mt-2 w-full border-b border-slate-700 bg-transparent px-1 py-2 text-sm text-white"/></label>
        </div>
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-white"><input type="checkbox" checked={values.lifecycle_birthday_enabled === '1' || values.lifecycle_birthday_enabled === 1} onChange={event => set('lifecycle_birthday_enabled', event.target.checked ? '1' : '0')} className="h-4 w-4 accent-emerald-400"/>Birthday coupon</label>
          <label className="block text-xs text-slate-400">Coupon<select value={values.lifecycle_birthday_coupon_code} onChange={event => set('lifecycle_birthday_coupon_code', event.target.value)} className="mt-2 w-full border border-slate-700 bg-[#081b15]/90 backdrop-blur-xl px-3 py-2 text-sm text-white"><option value="">Choose a coupon</option>{couponCodes.map(code => <option key={code} value={code}>{code}</option>)}</select></label>
        </div>
      </section>
      <div className="flex justify-end"><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 disabled:opacity-50"><Save size={16}/>{saving ? 'Saving…' : 'Save lifecycle offers'}</button></div>
      <p className="flex items-center gap-2 text-xs text-slate-500"><Gift size={14}/>Offer settings are stored centrally.</p>
    </form>
  );
}
