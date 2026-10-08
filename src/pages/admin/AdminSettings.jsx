import React, { useEffect, useState } from 'react';
import { auth as authApi, settings as settingsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FiLock, FiSave, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

export default function AdminSettings() {
  const { adminOtpVerify } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [cartSettings, setCartSettings] = useState({
    coupon_stack_policy: 'rule_first',
    enforce_cart_rule_minimum: '0',
    cart_abandonment_coupon_enabled: '1',
    cart_abandonment_coupon_percent: '5',
    cart_abandonment_coupon_delay_minutes: '30',
    cart_abandonment_coupon_valid_days: '7',
    cart_abandonment_coupon_max_discount: '100',
  });
  const [shippingSettings, setShippingSettings] = useState({ standard_charge: '50', express_charge: '150', free_shipping_threshold: '500' });
  const [cartSettingsLoading, setCartSettingsLoading] = useState(true);
  const [cartSettingsSaving, setCartSettingsSaving] = useState(false);
  const [returnPolicyDays, setReturnPolicyDays] = useState('7');

  useEffect(() => {
    let active = true;
    settingsApi.get()
      .then(response => {
        if (!active) return;
        const values = { ...response.data?.cart_rules, ...response.data?.general };
        const shipping = response.data?.shipping || {};
        const policy = response.data?.policy || {};
        setShippingSettings(current => ({ ...current, ...shipping }));
        setReturnPolicyDays(policy.return_policy_days || response.data?.general?.return_policy_days || '7');
        setCartSettings({
          coupon_stack_policy: values.coupon_stack_policy || 'rule_first',
          enforce_cart_rule_minimum: values.enforce_cart_rule_minimum || '0',
          cart_abandonment_coupon_enabled: values.cart_abandonment_coupon_enabled || '1',
          cart_abandonment_coupon_percent: values.cart_abandonment_coupon_percent || '5',
          cart_abandonment_coupon_delay_minutes: values.cart_abandonment_coupon_delay_minutes || '30',
          cart_abandonment_coupon_valid_days: values.cart_abandonment_coupon_valid_days || '7',
          cart_abandonment_coupon_max_discount: values.cart_abandonment_coupon_max_discount || '100',
        });
      })
      .catch(loadError => {
        if (active) setError(loadError.normalized?.message || 'Could not load cart settings.');
      })
      .finally(() => { if (active) setCartSettingsLoading(false); });
    return () => { active = false; };
  }, []);

  const saveCartSettings = async event => {
    event.preventDefault();
    setCartSettingsSaving(true);
    setError(null);
    try {
      await settingsApi.update(cartSettings);
      setMessage('Checkout and cart rules saved.');
    } catch (saveError) {
      setError(saveError.normalized?.message || saveError.response?.data?.message || 'Failed to save cart settings.');
    } finally {
      setCartSettingsSaving(false);
    }
  };

  const saveShippingSettings = async event => {
    event.preventDefault();
    setCartSettingsSaving(true);
    setError(null);
    try {
      await settingsApi.update(shippingSettings);
      setMessage('Shipping tiers saved.');
    } catch (saveError) {
      setError(saveError.normalized?.message || saveError.response?.data?.message || 'Failed to save shipping tiers.');
    } finally {
      setCartSettingsSaving(false);
    }
  };

  const saveReturnPolicy = async event => {
    event.preventDefault();
    const days = Number(returnPolicyDays);
    if (!Number.isInteger(days) || days < 1 || days > 90) {
      setError('Return windows must be between 1 and 90 days.');
      return;
    }
    setCartSettingsSaving(true);
    setError(null);
    try {
      await settingsApi.update({ return_policy_days: String(days) });
      setMessage('Return policy saved. Customers can request returns from 30 minutes after delivery.');
    } catch (saveError) {
      setError(saveError.normalized?.message || saveError.response?.data?.message || 'Failed to save the return policy.');
    } finally {
      setCartSettingsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword.length < 12) {
      setError('New password must be at least 12 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.changeAdminPassword({ currentPassword, newPassword });
      await adminOtpVerify(response.data);
      setMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const d = err.normalized || err.response?.data;
      if (d?.code === 'MIN_LENGTH') setError(d.message);
      else if (d?.code === 'COMPLEXITY') setError(d.message);
      else if (d?.code === 'COMMON_PASSWORD') setError(d.message);
      else if (d?.code === 'PWNED_PASSWORD') setError(d.message);
      else if (d?.code === 'PASSWORD_REUSED') setError(d.message);
      else setError(d?.message || err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <FiLock className="text-cyan-400" />
          Admin Settings
        </h2>
        <p className="text-gray-400">Manage your admin account settings</p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-400">
          <FiCheckCircle />
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400">
          <FiAlertCircle />
          {error}
        </div>
      )}

      <div className="admin-glass-panel rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="admin-glass-control w-full rounded-lg px-4 py-2 focus:border-cyan-400"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="admin-glass-control w-full rounded-lg px-4 py-2 focus:border-cyan-400"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="admin-glass-control w-full rounded-lg px-4 py-2 focus:border-cyan-400"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave />
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      <div className="admin-glass-panel mt-6 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Checkout &amp; Cart Rules</h3>
        <form onSubmit={saveCartSettings} className="space-y-5">
          <fieldset disabled={cartSettingsLoading || cartSettingsSaving}>
            <legend className="mb-2 block text-sm font-medium text-gray-300">Coupon and cart-rule stacking</legend>
            <div role="radiogroup" aria-label="Coupon and cart-rule stacking" className="inline-flex flex-wrap gap-2">
              {[
                ['rule_first', 'Rule first'],
                ['coupon_first', 'Coupon first'],
                ['both', 'Allow both'],
              ].map(([value, label]) => (
                <label key={value} className={`cursor-pointer rounded-lg border px-3 py-2 text-sm ${cartSettings.coupon_stack_policy === value ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200' : 'border-gray-700 text-gray-400'}`}>
                  <input type="radio" name="coupon_stack_policy" value={value} checked={cartSettings.coupon_stack_policy === value} onChange={() => setCartSettings(current => ({ ...current, coupon_stack_policy: value }))} className="sr-only" />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="flex items-center justify-between gap-4 rounded-lg border border-gray-800 p-4 text-sm text-gray-200">
            <span><span className="block font-medium">Enforce cart-rule minimums</span><span className="mt-1 block text-xs text-gray-500">Block checkout below a rule’s minimum when that rule is marked enforced.</span></span>
            <input type="checkbox" checked={cartSettings.enforce_cart_rule_minimum === '1' || cartSettings.enforce_cart_rule_minimum === 1} onChange={event => setCartSettings(current => ({ ...current, enforce_cart_rule_minimum: event.target.checked ? '1' : '0' }))} className="h-4 w-4 accent-cyan-400" />
          </label>
          <div className="rounded-xl border border-gray-800 p-4">
            <label className="flex items-center justify-between gap-4 text-sm text-gray-200">
              <span><span className="block font-medium">Personal abandoned-cart coupon</span><span className="mt-1 block text-xs text-gray-500">Issue a one-use coupon tied to the signed-in customer after their cart has been inactive.</span></span>
              <input type="checkbox" checked={cartSettings.cart_abandonment_coupon_enabled === '1' || cartSettings.cart_abandonment_coupon_enabled === 1} onChange={event => setCartSettings(current => ({ ...current, cart_abandonment_coupon_enabled: event.target.checked ? '1' : '0' }))} className="h-4 w-4 accent-cyan-400" />
            </label>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['cart_abandonment_coupon_percent', 'Discount (%)', 1, 50],
                ['cart_abandonment_coupon_delay_minutes', 'Idle time (minutes)', 1, 10080],
                ['cart_abandonment_coupon_valid_days', 'Valid for (days)', 1, 30],
                ['cart_abandonment_coupon_max_discount', 'Maximum discount (₹)', 1, 100000],
              ].map(([key, label, min, max]) => <label key={key} className="text-xs text-gray-400">{label}
                <input type="number" min={min} max={max} value={cartSettings[key]} onChange={event => setCartSettings(current => ({ ...current, [key]: event.target.value }))} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm text-white"/>
              </label>)}
            </div>
          </div>
          <button type="submit" disabled={cartSettingsLoading || cartSettingsSaving} className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50">
            <FiSave />{cartSettingsSaving ? 'Saving…' : 'Save cart settings'}
          </button>
        </form>
      </div>

      <div className="admin-glass-panel mt-6 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Shipping Tiers</h3>
        <form onSubmit={saveShippingSettings} className="grid gap-4 sm:grid-cols-3">
          {[
            ['standard_charge', 'Standard delivery'],
            ['express_charge', 'Express delivery'],
            ['free_shipping_threshold', 'Free delivery threshold'],
          ].map(([key, label]) => <label key={key} className="text-sm text-gray-300">{label} (₹)
            <input type="number" min="0" value={shippingSettings[key]} onChange={event => setShippingSettings(current => ({ ...current, [key]: event.target.value }))} className="admin-glass-control mt-2 w-full rounded-lg px-3 py-2 focus:border-cyan-400"/>
          </label>)}
          <div className="sm:col-span-3"><button type="submit" disabled={cartSettingsLoading || cartSettingsSaving} className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"><FiSave/>{cartSettingsSaving ? 'Saving…' : 'Save shipping tiers'}</button></div>
        </form>
      </div>

      <div className="admin-glass-panel mt-6 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Return window</h3>
        <p className="mb-4 text-sm text-gray-400">The return option opens 30 minutes after an order is marked delivered. This setting controls how long it stays available after delivery.</p>
        <form onSubmit={saveReturnPolicy} className="flex flex-wrap items-end gap-4">
          <label className="text-sm text-gray-300">Eligible for (days after delivery)
            <input type="number" min="1" max="90" required value={returnPolicyDays} onChange={event => setReturnPolicyDays(event.target.value)} className="admin-glass-control mt-2 block w-full rounded-lg px-3 py-2 sm:w-48"/>
          </label>
          <button type="submit" disabled={cartSettingsLoading || cartSettingsSaving} className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"><FiSave/>{cartSettingsSaving ? 'Saving…' : 'Save return window'}</button>
        </form>
      </div>

      <div className="admin-glass-panel mt-6 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Site Information</h3>
        <div className="space-y-3 text-gray-400">
          <div className="flex justify-between">
            <span>Site Name:</span>
            <span className="text-white">Bhumivera</span>
          </div>
          <div className="flex justify-between">
            <span>Domain:</span>
            <span className="text-white">Bhumivera.com</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Method:</span>
            <span className="text-white">Cash on Delivery (COD)</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Types:</span>
            <span className="text-white">Standard, Express</span>
          </div>
        </div>
      </div>
    </div>
  );
}
