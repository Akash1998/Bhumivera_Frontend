import { useCallback, useEffect, useState } from 'react';
import { adminWallet } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoaderCircle, RefreshCw, Wallet } from 'lucide-react';

export default function WalletManagement() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('credit');
  const [bucket, setBucket] = useState('cash');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast() || {};

  const load = useCallback(async (query = '') => {
    setLoading(true);
    try {
      const { data } = await adminWallet.getAccounts({ search: query });
      const list = data?.accounts || [];
      setAccounts(list);
      setSelectedId(current => list.some(account => String(account.id) === String(current)) ? current : String(list[0]?.id || ''));
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not load customer wallets.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!selectedId) { setTransactions([]); return undefined; }
    let active = true;
    adminWallet.getTransactions(selectedId)
      .then(({ data }) => { if (active) setTransactions(data?.transactions || []); })
      .catch(error => {
        if (active) showToast?.(error.normalized?.message || 'Could not load wallet history.', 'error');
      });
    return () => { active = false; };
  }, [selectedId, showToast]);

  const submit = async event => {
    event.preventDefault();
    if (!selectedId) return showToast?.('Choose a customer wallet first.', 'error');
    setSaving(true);
    try {
      await adminWallet.adjust(selectedId, { amount: Number(amount), type, bucket, reason });
      showToast?.('Wallet balance updated and recorded.', 'success');
      setAmount('');
      setReason('');
      await load(search);
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not update the wallet.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const searchCustomers = event => {
    event.preventDefault();
    load(search);
  };

  const selectedAccount = accounts.find(account => String(account.id) === String(selectedId));

  return (
    <div className="space-y-5 text-slate-100">
      <header>
        <h2 className="text-xl font-semibold text-white">Customer wallets</h2>
        <p className="mt-1 text-sm text-slate-400">Review spendable and restricted referral balances separately. Adjustments are recorded in the selected wallet’s customer history.</p>
      </header>
      <form onSubmit={searchCustomers} className="flex gap-2">
        <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search customer name or email" aria-label="Search customer wallets" className="admin-glass-control min-w-0 flex-1 rounded-lg px-3 py-2 text-sm"/>
        <button type="submit" disabled={loading} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-slate-200 disabled:opacity-50"><RefreshCw size={15}/>Search</button>
      </form>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)]">
        <section className="overflow-hidden rounded-xl border border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <h3 className="text-sm font-semibold text-white">Customer accounts</h3>
            {loading && <LoaderCircle size={15} className="animate-spin text-emerald-300"/>}
          </div>
          {accounts.length === 0 && !loading ? <p className="p-4 text-sm text-slate-400">No matching customer wallets.</p> : (
            <div className="max-h-96 divide-y divide-white/10 overflow-y-auto">
              {accounts.map(account => (
                <button key={account.id} type="button" onClick={() => setSelectedId(String(account.id))} className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left ${String(account.id) === String(selectedId) ? 'bg-emerald-400/10' : 'hover:bg-white/[0.04]'}`}>
                  <span className="min-w-0"><span className="block truncate text-sm font-medium text-white">{account.name}</span><span className="block truncate text-xs text-slate-400">{account.email}</span></span>
                  <span className="shrink-0 text-right text-xs">
                    <span className="block font-semibold text-emerald-200">Spendable ₹{Number(account.balance || 0).toFixed(2)}</span>
                    <span className="mt-1 block text-amber-200">Referral ₹{Number(account.referral_balance || 0).toFixed(2)}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <form onSubmit={submit} className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2"><Wallet size={17} className="text-emerald-300"/><h3 className="text-sm font-semibold text-white">Adjust balance</h3></div>
          <p className="text-xs text-slate-400">{selectedAccount ? `${selectedAccount.name} · ${bucket === 'referral' ? 'Referral' : 'Spendable'} balance ₹${Number(bucket === 'referral' ? selectedAccount.referral_balance || 0 : selectedAccount.balance || 0).toFixed(2)}` : 'Choose a customer account.'}</p>
          <label className="block text-xs text-slate-300">Wallet type
            <select value={bucket} onChange={event => setBucket(event.target.value)} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"><option value="cash">Spendable wallet</option><option value="referral">Restricted referral rewards</option></select>
          </label>
          <label className="block text-xs text-slate-300">Action
            <select value={type} onChange={event => setType(event.target.value)} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"><option value="credit">Add wallet credit</option><option value="debit">Remove wallet balance</option></select>
          </label>
          <label className="block text-xs text-slate-300">Amount (₹)
            <input required type="number" min="0.01" max="1000000" step="0.01" value={amount} onChange={event => setAmount(event.target.value)} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"/>
          </label>
          <label className="block text-xs text-slate-300">Reason shown in wallet history
            <textarea required minLength="5" maxLength="200" value={reason} onChange={event => setReason(event.target.value)} className="admin-glass-control mt-1 min-h-20 w-full rounded-lg px-3 py-2 text-sm" placeholder="For example: approved customer service credit"/>
          </label>
          <button type="submit" disabled={saving || loading || !selectedAccount} className="min-h-10 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-[#071a12] disabled:opacity-50">{saving ? 'Saving…' : 'Record wallet adjustment'}</button>
        </form>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-white">Selected customer’s latest 100 wallet transactions</h3>
        {transactions.length === 0 ? <p className="rounded-xl border border-white/10 p-4 text-sm text-slate-400">No wallet transactions recorded.</p> : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[540px] text-left text-sm">
              <thead className="bg-white/[0.04] text-xs text-slate-400"><tr><th className="p-3">Date</th><th className="p-3">Wallet</th><th className="p-3">Reason</th><th className="p-3">Type</th><th className="p-3 text-right">Amount</th></tr></thead>
              <tbody className="divide-y divide-white/10">
                {transactions.map(transaction => <tr key={`${transaction.wallet_bucket || 'cash'}-${transaction.id}`}>
                  <td className="p-3 text-xs text-slate-400">{new Date(transaction.created_at).toLocaleString()}</td>
                  <td className={`p-3 text-xs ${transaction.wallet_bucket === 'cash' ? 'text-emerald-200' : 'text-amber-200'}`}>{transaction.wallet_bucket === 'shopping' ? 'Shopping reward' : transaction.wallet_bucket === 'referral' ? 'Referral reward' : 'Spendable'}</td>
                  <td className="p-3 text-slate-200">{transaction.description}</td>
                  <td className="p-3 capitalize text-slate-300">{transaction.type}</td>
                  <td className={`p-3 text-right font-medium ${transaction.type === 'credit' ? 'text-emerald-300' : 'text-rose-300'}`}>{transaction.type === 'credit' ? '+' : '−'}₹{Number(transaction.amount).toFixed(2)}</td>
                </tr>)}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
