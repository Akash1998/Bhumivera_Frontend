import React, { useEffect, useState } from 'react';
import { auth as authApi, settings as settingsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { isPasskeySupported, registerPasskey } from '../../utils/webauthnClient';
import { FiLock, FiSave, FiAlertCircle, FiCheckCircle, FiShield, FiKey, FiTrash2 } from 'react-icons/fi';
import SupportAgentManagement from './SupportAgentManagement';

export default function AdminSettings() {
  const { adminOtpVerify } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [cartSettings, setCartSettings] = useState({
    coupon_stack_policy: 'both',
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
  const [securityLoading, setSecurityLoading] = useState(true);
  const [securityBusy, setSecurityBusy] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorStatusAvailable, setTwoFactorStatusAvailable] = useState(false);
  const [twoFactorSetup, setTwoFactorSetup] = useState(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [adminPasskeys, setAdminPasskeys] = useState([]);

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
          coupon_stack_policy: values.coupon_stack_policy || 'both',
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

  useEffect(() => {
    let active = true;
    Promise.allSettled([authApi.getAdminSecurity(), authApi.listPasskeys('admin')])
      .then(([securityResult, passkeyResult]) => {
        if (!active) return;
        const errors = [];
        if (securityResult.status === 'fulfilled') {
          setTwoFactorEnabled(Boolean(securityResult.value.data?.twoFactorEnabled));
          setTwoFactorStatusAvailable(true);
        } else {
          errors.push(securityResult.reason.response?.data?.message || 'Could not load two-factor status.');
        }
        if (passkeyResult.status === 'fulfilled') {
          setAdminPasskeys(passkeyResult.value.data?.passkeys || []);
        } else {
          errors.push(passkeyResult.reason.response?.data?.message || 'Could not load admin passkeys.');
        }
        if (errors.length) setError(errors.join(' '));
      })
      .finally(() => { if (active) setSecurityLoading(false); });
    return () => { active = false; };
  }, []);

  const refreshSecurity = async () => {
    const [securityResponse, passkeyResponse] = await Promise.all([
      authApi.getAdminSecurity(),
      authApi.listPasskeys('admin'),
    ]);
    setTwoFactorEnabled(Boolean(securityResponse.data?.twoFactorEnabled));
    setTwoFactorStatusAvailable(true);
    setAdminPasskeys(passkeyResponse.data?.passkeys || []);
  };

  const startTwoFactorSetup = async () => {
    setSecurityBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await authApi.startAdminTwoFactorSetup();
      setTwoFactorSetup(response.data);
      setTwoFactorCode('');
    } catch (setupError) {
      setError(setupError.response?.data?.message || 'Could not start authenticator setup.');
    } finally {
      setSecurityBusy(false);
    }
  };

  const enableTwoFactor = async event => {
    event.preventDefault();
    if (!twoFactorSetup?.secret || !/^\d{6}$/.test(twoFactorCode)) {
      setError('Enter the 6-digit code shown in your authenticator app.');
      return;
    }
    setSecurityBusy(true);
    setError(null);
    setMessage(null);
    try {
      await authApi.enableAdminTwoFactor({ secret: twoFactorSetup.secret, token: twoFactorCode });
      setTwoFactorEnabled(true);
      setTwoFactorSetup(null);
      setTwoFactorCode('');
      setMessage('Authenticator two-factor protection is now enabled for admin sign-in.');
    } catch (enableError) {
      setError(enableError.response?.data?.message || 'Could not enable two-factor authentication.');
    } finally {
      setSecurityBusy(false);
    }
  };

  const disableTwoFactor = async event => {
    event.preventDefault();
    setSecurityBusy(true);
    setError(null);
    setMessage(null);
    try {
      await authApi.disableAdminTwoFactor({ currentPassword: disablePassword, token: disableCode });
      setTwoFactorEnabled(false);
      setDisablePassword('');
      setDisableCode('');
      setTwoFactorSetup(null);
      setMessage('Two-factor authentication is disabled.');
    } catch (disableError) {
      setError(disableError.response?.data?.message || 'Could not disable two-factor authentication.');
    } finally {
      setSecurityBusy(false);
    }
  };

  const addAdminPasskey = async () => {
    setSecurityBusy(true);
    setError(null);
    setMessage(null);
    try {
      await registerPasskey({
        accountType: 'admin',
        name: `Admin passkey (${navigator.platform || 'Device'})`,
      });
      await refreshSecurity();
      setMessage('Admin passkey registered.');
    } catch (passkeyError) {
      setError(passkeyError.response?.data?.message || passkeyError.message || 'Could not register admin passkey.');
    } finally {
      setSecurityBusy(false);
    }
  };

  const removeAdminPasskey = async id => {
    setSecurityBusy(true);
    setError(null);
    setMessage(null);
    try {
      await authApi.deletePasskey(id, 'admin');
      setAdminPasskeys(current => current.filter(passkey => passkey.id !== id));
      setMessage('Admin passkey removed.');
    } catch (passkeyError) {
      setError(passkeyError.response?.data?.message || 'Could not remove admin passkey.');
    } finally {
      setSecurityBusy(false);
    }
  };

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
      setError('New password must be at least 8 characters');
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
    <div className="p-6 max-w-3xl">
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

      <section id="admin-account-security" className="admin-glass-panel mt-6 scroll-mt-6 rounded-2xl p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
              <FiShield className="text-cyan-400" aria-hidden="true" /> Admin account security
            </h3>
            <p className="mt-1 text-sm text-gray-400">Protect admin sign-in and manage the credentials registered to this account.</p>
          </div>
          <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${twoFactorEnabled ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : 'border-amber-400/30 bg-amber-400/10 text-amber-200'}`}>
            {securityLoading ? 'Checking…' : !twoFactorStatusAvailable ? 'Status unavailable' : twoFactorEnabled ? '2FA enabled' : '2FA not enabled'}
          </span>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
          <h4 className="font-semibold text-white">Authenticator app</h4>
          <p className="mt-1 text-sm text-gray-400">Require an authenticator code after your password and email verification on admin sign-in.</p>
          {securityLoading ? (
            <p className="mt-4 text-sm text-gray-500">Loading security status…</p>
          ) : twoFactorEnabled ? (
            <form onSubmit={disableTwoFactor} className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-gray-400">Current admin password
                <input type="password" autoComplete="current-password" required value={disablePassword} onChange={event => setDisablePassword(event.target.value)} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm text-white" />
              </label>
              <label className="text-xs text-gray-400">Current authenticator code
                <input type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={disableCode} onChange={event => setDisableCode(event.target.value.replace(/\D/g, '').slice(0, 6))} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm text-white" />
              </label>
              <button type="submit" disabled={securityBusy} className="rounded-lg border border-rose-400/30 px-4 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-400/10 disabled:opacity-50 sm:col-span-2">
                {securityBusy ? 'Updating…' : 'Disable two-factor authentication'}
              </button>
            </form>
          ) : twoFactorSetup ? (
            <form onSubmit={enableTwoFactor} className="mt-4 grid gap-4 sm:grid-cols-[160px_1fr]">
              {twoFactorSetup.qrCode && <img src={twoFactorSetup.qrCode} alt="Authenticator setup QR code" className="h-40 w-40 rounded-lg bg-white p-2" />}
              <div>
                <p className="text-sm text-gray-300">Scan the QR code with your authenticator app. If scanning is unavailable, enter this setup key manually:</p>
                <code className="mt-2 block break-all rounded-lg bg-black/30 p-3 text-sm text-cyan-200">{twoFactorSetup.secret}</code>
                <label className="mt-4 block text-xs text-gray-400">6-digit authenticator code
                  <input type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={twoFactorCode} onChange={event => setTwoFactorCode(event.target.value.replace(/\D/g, '').slice(0, 6))} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm text-white" />
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="submit" disabled={securityBusy || twoFactorCode.length !== 6} className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50">{securityBusy ? 'Verifying…' : 'Verify and enable 2FA'}</button>
                  <button type="button" disabled={securityBusy} onClick={() => { setTwoFactorSetup(null); setTwoFactorCode(''); }} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/5">Cancel</button>
                </div>
              </div>
            </form>
          ) : (
            <button type="button" disabled={securityBusy || !twoFactorStatusAvailable} onClick={startTwoFactorSetup} className="mt-4 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50">
              {securityBusy ? 'Preparing setup…' : 'Set up authenticator 2FA'}
            </button>
          )}
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-black/10 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-white"><FiKey className="text-cyan-400" aria-hidden="true" /> Passkeys</h4>
              <p className="mt-1 text-sm text-gray-400">Use a device passkey, fingerprint, Face ID, or security key for admin access.</p>
            </div>
            <button type="button" disabled={securityBusy || securityLoading || !isPasskeySupported()} onClick={addAdminPasskey} className="rounded-lg border border-cyan-400/30 px-3 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-400/10 disabled:opacity-50">
              Add passkey
            </button>
          </div>
          {adminPasskeys.length ? (
            <ul className="mt-4 divide-y divide-white/10">
              {adminPasskeys.map(passkey => (
                <li key={passkey.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{passkey.device_name || 'Admin passkey'}</p>
                    <p className="text-xs text-gray-500">Added {passkey.created_at ? new Date(passkey.created_at).toLocaleDateString() : 'recently'}</p>
                  </div>
                  <button type="button" disabled={securityBusy} onClick={() => removeAdminPasskey(passkey.id)} aria-label={`Remove ${passkey.device_name || 'admin passkey'}`} className="rounded-lg p-2 text-gray-400 hover:bg-rose-400/10 hover:text-rose-300 disabled:opacity-50">
                    <FiTrash2 aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{securityLoading ? 'Loading passkeys…' : 'No admin passkeys registered yet.'}</p>
          )}
        </div>
      </section>

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
            ['express_charge', 'Premium delivery'],
            ['free_shipping_threshold', 'Free delivery threshold'],
          ].map(([key, label]) => <label key={key} className="text-sm text-gray-300">{label} (₹)
            <input type="number" min="0" value={shippingSettings[key]} onChange={event => setShippingSettings(current => ({ ...current, [key]: event.target.value }))} className="admin-glass-control mt-2 w-full rounded-lg px-3 py-2 focus:border-cyan-400"/>
          </label>)}
          <div className="sm:col-span-3"><button type="submit" disabled={cartSettingsLoading || cartSettingsSaving} className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"><FiSave/>{cartSettingsSaving ? 'Saving…' : 'Save shipping tiers'}</button></div>
        </form>
      </div>

      <div className="admin-glass-panel mt-6 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Store Return Policy: 100% Non-Returnable</h3>
        <p className="mb-4 text-sm text-gray-400">All Bhumivera formulations are intimate personal care cosmetics and are strictly non-returnable across the storefront once delivered. Pre-dispatch cancellations are allowed only before orders are packed and shipped.</p>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
          Customer self-service returns are disabled. Transit damage claims require an uncut 360° unboxing video within 48 hours for direct replacement or refund without physical return.
        </div>
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
        <SupportAgentManagement />
      </div>
    </div>
  );
}
