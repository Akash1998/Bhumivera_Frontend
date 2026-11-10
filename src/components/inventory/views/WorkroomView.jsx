import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Edit3, LoaderCircle, RefreshCw, UserPlus, Users, X } from 'lucide-react';
import api from '../../../services/api';

const authConfig = token => ({
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});

const errorMessage = error => error.response?.data?.message || error.message || 'Request failed.';

export default function WorkroomView({ authToken, viewer }) {
  const [workers, setWorkers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [error, setError] = useState('');
  const [accountError, setAccountError] = useState('');
  const [message, setMessage] = useState('');
  const [permissionDefinitions, setPermissionDefinitions] = useState({});
  const [accountEditor, setAccountEditor] = useState(null);
  const [form, setForm] = useState({ username: '', password: '', fullName: '', role: 'cashier' });
  const isAdmin = viewer?.role === 'admin' || viewer?.fullAllAccess === true;

  const loadWorkers = useCallback(async () => {
    try {
      const { data } = await api.get('/inventory-software/workroom/presence', authConfig(authToken));
      const currentWorkers = data?.workers || data?.activeWorkers;
      if (!data?.success || !Array.isArray(currentWorkers)) {
        throw new Error(data?.message || 'Live workroom returned an invalid response.');
      }
      setWorkers(currentWorkers);
      setError('');
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoadingWorkers(false);
    }
  }, [authToken]);

  const loadAccounts = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingAccounts(true);
    try {
      const { data } = await api.get('/inventory-software/iam/users', authConfig(authToken));
      if (!data?.success || !Array.isArray(data.users)) {
        throw new Error(data?.message || 'Staff account list returned an invalid response.');
      }
      setAccounts(data.users);
      setPermissionDefinitions(data.permissionDefinitions || {});
      setAccountError('');
    } catch (requestError) {
      setAccountError(errorMessage(requestError));
    } finally {
      setLoadingAccounts(false);
    }
  }, [authToken, isAdmin]);

  useEffect(() => {
    loadWorkers();
    const timer = window.setInterval(loadWorkers, 15000);
    return () => window.clearInterval(timer);
  }, [loadWorkers]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const createAccount = async event => {
    event.preventDefault();
    setAccountError('');
    setMessage('');
    try {
      const { data } = await api.post('/inventory-software/iam/users', {
        ...form,
        requireOnboarding: true,
      }, authConfig(authToken));
      if (!data?.success) throw new Error(data?.message || 'Account creation failed.');
      setMessage(data.message || `Created ${form.username}.`);
      setForm({ username: '', password: '', fullName: '', role: 'cashier' });
      await loadAccounts();
    } catch (requestError) {
      setAccountError(errorMessage(requestError));
    }
  };

  const updateAccount = async (account, changes) => {
    setAccountError('');
    setMessage('');
    try {
      const { data } = await api.patch(`/inventory-software/iam/users/${account.id}`, changes, authConfig(authToken));
      if (!data?.success) throw new Error(data?.message || 'Account update failed.');
      setMessage(data.message || `Updated ${account.username}.`);
      setAccountEditor(null);
      await loadAccounts();
    } catch (requestError) {
      setAccountError(errorMessage(requestError));
    }
  };

  const resetPassword = async account => {
    const newPassword = window.prompt(`Enter a new temporary password for ${account.username} (at least 6 characters):`);
    if (newPassword === null) return;
    setAccountError('');
    setMessage('');
    try {
      const { data } = await api.post(
        `/inventory-software/iam/users/${account.id}/reset-password`,
        { newPassword },
        authConfig(authToken)
      );
      if (!data?.success) throw new Error(data?.message || 'Password reset failed.');
      setMessage(data.message || `Password reset for ${account.username}.`);
      await loadAccounts();
    } catch (requestError) {
      setAccountError(errorMessage(requestError));
    }
  };

  const editAccount = account => {
    setAccountEditor({
      id: account.id,
      username: account.username,
      fullName: account.fullName,
      role: account.role,
      status: account.status,
      permissions: { ...(account.permissions || {}) },
      fullAllAccess: Boolean(account.fullAllAccess),
    });
  };

  const saveAccountEditor = event => {
    event.preventDefault();
    const account = accounts.find(item => item.id === accountEditor?.id);
    if (!account || !accountEditor) return;
    updateAccount(account, {
      username: accountEditor.username,
      fullName: accountEditor.fullName,
      role: accountEditor.role,
      status: accountEditor.status,
      permissions: accountEditor.permissions,
      fullAllAccess: accountEditor.fullAllAccess,
    });
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-emerald-500/30 bg-[#0c261b] p-5 text-white shadow-lg">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Users className="text-emerald-300" size={22} />
            <div>
              <h2 className="font-black">Live PWA Workroom</h2>
              <p className="text-xs text-slate-400">Presence and packing progress are memory-backed. Staff accounts are read only when an administrator opens or refreshes the account list.</p>
            </div>
          </div>
          <button type="button" onClick={loadWorkers} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-bold hover:bg-white/5">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {error && <p role="alert" className="mb-3 flex items-center gap-2 rounded-lg bg-rose-400/10 p-3 text-xs text-rose-200"><AlertCircle size={15} />{error}</p>}
        {loadingWorkers ? (
          <div className="flex items-center gap-2 py-6 text-sm text-slate-300"><LoaderCircle className="animate-spin" size={17} /> Loading live staff status…</div>
        ) : workers.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-black/10 p-5 text-center text-sm text-slate-400">No scanner staff sessions have been recorded since the backend started.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {workers.map(worker => {
              const savedOrders = Array.isArray(worker.savedBulkOrders) ? worker.savedBulkOrders : [];
              const activeItems = Array.isArray(worker.activeOrderItems) ? worker.activeOrderItems : [];
              const recentUploads = Array.isArray(worker.recentUploads) ? worker.recentUploads : [];
              return (
                <article key={worker.username} className="rounded-xl border border-emerald-500/20 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold">{worker.fullName || worker.username}</h3>
                      <p className="font-mono text-[11px] text-slate-400">@{worker.username} · {worker.deviceName || 'Scanner'}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${worker.onWork ? 'bg-emerald-400/15 text-emerald-200' : 'bg-slate-400/15 text-slate-300'}`}>{worker.onWork ? worker.mode || 'IDLE' : 'OFF WORK'}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-white/5 p-2"><strong className="block text-lg">{worker.scannedUnits || 0}/{worker.expectedUnits || 0}</strong><span className="text-[9px] uppercase text-slate-400">Current scan</span></div>
                    <div className="rounded-lg bg-white/5 p-2"><strong className="block text-lg">{worker.packedOrders || 0}</strong><span className="text-[9px] uppercase text-slate-400">Uploaded orders</span></div>
                    <div className="rounded-lg bg-white/5 p-2"><strong className="block text-lg">{worker.packedItems || 0}</strong><span className="text-[9px] uppercase text-slate-400">Uploaded units</span></div>
                  </div>
                  {worker.activeOrder && <p className="mt-3 text-xs text-amber-200">Packing order #{worker.activeOrder}</p>}
                  {activeItems.length > 0 && (
                    <div className="mt-3 space-y-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Live item verification</p>
                      {activeItems.map(item => (
                        <div key={item.orderItemId} className="flex items-center justify-between gap-3 text-xs">
                          <span className="min-w-0 truncate text-slate-200">{item.name}<span className="ml-1 font-mono text-[9px] text-slate-500">{item.sku}</span></span>
                          <strong className={item.scannedUnits === item.expectedUnits ? 'text-emerald-300' : 'text-amber-200'}>{item.scannedUnits}/{item.expectedUnits}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                  {savedOrders.length > 0 && (
                    <p className="mt-2 text-xs leading-5 text-sky-200">
                      Saved on device ({savedOrders.length}): {savedOrders.map(order => `#${order.orderNumber}`).join(', ')}
                    </p>
                  )}
                  {recentUploads.length > 0 && (
                    <div className="mt-3 rounded-lg border border-emerald-400/10 bg-emerald-400/[0.04] p-3">
                      <p className="mb-1.5 text-[9px] font-black uppercase tracking-wider text-emerald-300">Recent uploads</p>
                      {recentUploads.slice(0, 5).map(upload => (
                        <p key={`${upload.orderId}-${upload.uploadedAt}`} className="flex justify-between gap-2 text-[10px] text-slate-300">
                          <span>#{upload.orderNumber}</span><span>{upload.verifiedUnits} units · {new Date(upload.uploadedAt).toLocaleTimeString()}</span>
                        </p>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 text-[10px] text-slate-500">Last update: {worker.lastSeenAt ? new Date(worker.lastSeenAt).toLocaleTimeString() : '—'}</p>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-emerald-500/30 bg-[#0c261b] p-5 text-white shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <UserPlus className="text-emerald-300" size={21} />
          <div>
            <h2 className="font-black">PWA Staff Accounts</h2>
            <p className="text-xs text-slate-400">Choose each login ID yourself. The scanner authenticates from the backend's in-memory roster.</p>
          </div>
          {isAdmin && <button type="button" onClick={loadAccounts} disabled={loadingAccounts} className="ml-auto inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-bold hover:bg-white/5 disabled:opacity-50"><RefreshCw size={14} className={loadingAccounts ? 'animate-spin' : ''} /> Refresh roster</button>}
        </div>
        {!isAdmin ? (
          <p className="rounded-lg border border-white/10 bg-black/10 p-4 text-sm text-slate-400">Staff account management is available to Inventory Software administrators.</p>
        ) : (
          <>
            {accountError && <p role="alert" className="mb-3 flex items-center gap-2 rounded-lg bg-rose-400/10 p-3 text-xs text-rose-200"><AlertCircle size={15} />{accountError}</p>}
            {message && <p role="status" className="mb-3 flex items-center gap-2 rounded-lg bg-emerald-400/10 p-3 text-xs text-emerald-100"><CheckCircle2 size={15} />{message}</p>}
            <form onSubmit={createAccount} className="grid gap-3 rounded-xl border border-white/10 bg-black/10 p-4 sm:grid-cols-2">
              <label className="text-xs text-slate-300">Manual login ID
                <input required autoComplete="off" value={form.username} onChange={event => setForm({ ...form, username: event.target.value })} className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#071711] px-3 text-sm text-white outline-none focus:border-emerald-400" />
              </label>
              <label className="text-xs text-slate-300">Password
                <input required minLength={6} autoComplete="new-password" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#071711] px-3 text-sm text-white outline-none focus:border-emerald-400" />
              </label>
              <label className="text-xs text-slate-300">Staff name
                <input required value={form.fullName} onChange={event => setForm({ ...form, fullName: event.target.value })} className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#071711] px-3 text-sm text-white outline-none focus:border-emerald-400" />
              </label>
              <label className="text-xs text-slate-300">Account role
                <select value={form.role} onChange={event => setForm({ ...form, role: event.target.value })} className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#071711] px-3 text-sm text-white outline-none">
                  <option value="cashier">Cashier / Packer</option>
                  <option value="manager">Manager</option>
                  <option value="keeper">Keeper</option>
                  <option value="auditor">Auditor</option>
                </select>
              </label>
              <p className="text-[11px] leading-5 text-slate-400 sm:col-span-2">Login IDs are not auto-generated. Set the exact ID and password that you will give to the staff member; assign detailed permissions after creation.</p>
              <button type="submit" className="min-h-10 rounded-lg bg-emerald-500 px-4 font-black text-emerald-950 sm:col-span-2">Create staff account</button>
            </form>

            <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
              {loadingAccounts ? (
                <div className="flex items-center gap-2 p-5 text-sm text-slate-300"><LoaderCircle className="animate-spin" size={16} /> Loading accounts…</div>
              ) : (
                <table className="w-full min-w-[660px] text-left text-xs">
                  <thead className="bg-black/20 text-[10px] uppercase text-slate-400">
                    <tr><th className="p-3">Staff</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {accounts.map(account => (
                      <tr key={account.id}>
                        <td className="p-3"><strong>{account.fullName}</strong><span className="block font-mono text-[10px] text-slate-400">@{account.username}</span></td>
                        <td className="p-3 capitalize">{account.role}{account.fullAllAccess && <span className="ml-1 text-amber-300">· full access</span>}</td>
                        <td className="p-3 capitalize">{account.status}</td>
                        <td className="space-x-2 p-3 text-right">
                          <button type="button" onClick={() => editAccount(account)} className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2.5 py-1.5 font-bold hover:bg-white/5"><Edit3 size={12} /> Edit access</button>
                          <button type="button" onClick={() => resetPassword(account)} className="rounded-md border border-white/15 px-2.5 py-1.5 font-bold hover:bg-white/5">Reset password</button>
                          <button type="button" onClick={() => updateAccount(account, { status: account.status === 'active' ? 'suspended' : 'active' })} className="rounded-md border border-white/15 px-2.5 py-1.5 font-bold hover:bg-white/5">{account.status === 'active' ? 'Suspend' : 'Activate'}</button>
                        </td>
                      </tr>
                    ))}
                    {accounts.length === 0 && <tr><td colSpan="4" className="p-5 text-center text-slate-400">No staff accounts found.</td></tr>}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </section>

      {accountEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <form onSubmit={saveAccountEditor} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-emerald-500/30 bg-[#0c261b] p-5 text-white shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div><h2 className="text-lg font-black">Edit staff account</h2><p className="text-xs text-slate-400">Change the login ID, role, activation state, and exact permission set.</p></div>
              <button type="button" aria-label="Close" onClick={() => setAccountEditor(null)} className="rounded-lg p-2 hover:bg-white/10"><X size={17} /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-slate-300">Manual login ID
                <input required minLength={3} maxLength={32} autoComplete="off" value={accountEditor.username} onChange={event => setAccountEditor({ ...accountEditor, username: event.target.value })} className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#071711] px-3 text-sm text-white outline-none focus:border-emerald-400" />
              </label>
              <label className="text-xs text-slate-300">Staff name
                <input required value={accountEditor.fullName} onChange={event => setAccountEditor({ ...accountEditor, fullName: event.target.value })} className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#071711] px-3 text-sm text-white outline-none focus:border-emerald-400" />
              </label>
              <label className="text-xs text-slate-300">Role
                <select value={accountEditor.role} onChange={event => setAccountEditor({ ...accountEditor, role: event.target.value })} className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#071711] px-3 text-sm text-white">
                  <option value="cashier">Cashier / Packer</option><option value="manager">Manager</option><option value="keeper">Keeper</option><option value="auditor">Auditor</option><option value="admin">Admin</option>
                </select>
              </label>
              <label className="text-xs text-slate-300">Account status
                <select value={accountEditor.status} onChange={event => setAccountEditor({ ...accountEditor, status: event.target.value })} className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#071711] px-3 text-sm text-white">
                  <option value="active">Active</option><option value="suspended">Suspended</option>
                </select>
              </label>
            </div>
            <label className="mt-4 flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-sm">
              <input type="checkbox" checked={accountEditor.fullAllAccess} onChange={event => setAccountEditor({
                ...accountEditor,
                fullAllAccess: event.target.checked,
                permissions: { ...accountEditor.permissions, full_all_access: event.target.checked },
              })} className="mt-0.5 accent-amber-400" />
              <span><strong>Grant full access</strong><span className="block text-xs text-slate-400">Overrides individual permissions. Use only for trusted administrators.</span></span>
            </label>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {Object.entries(permissionDefinitions).filter(([key]) => key !== 'full_all_access').map(([key, definition]) => (
                <label key={key} className="flex items-start gap-2 rounded-lg border border-white/10 bg-black/10 p-3 text-xs">
                  <input type="checkbox" checked={Boolean(accountEditor.permissions[key])} onChange={event => setAccountEditor({
                    ...accountEditor,
                    permissions: { ...accountEditor.permissions, [key]: event.target.checked },
                  })} className="mt-0.5 accent-emerald-400" />
                  <span><strong>{definition.label || key}</strong><span className="mt-1 block text-slate-400">{definition.desc || ''}</span></span>
                </label>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setAccountEditor(null)} className="min-h-10 rounded-lg border border-white/15 px-4 text-sm font-bold">Cancel</button>
              <button type="submit" className="min-h-10 rounded-lg bg-emerald-500 px-4 text-sm font-black text-emerald-950">Save account &amp; permissions</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
