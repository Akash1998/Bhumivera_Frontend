import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { adminWallet } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Download, LoaderCircle, RefreshCw, TrendingUp, Users, Wallet } from 'lucide-react';

export default function WalletManagement() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [bucketFilter, setBucketFilter] = useState('all');
  const [selectedId, setSelectedId] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('credit');
  const [bucket, setBucket] = useState('cash');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast() || {};

  const load = useCallback(
    async (query = '') => {
      setLoading(true);
      try {
        const { data } = await adminWallet.getAccounts({ search: query });
        const list = data?.accounts || [];
        setAccounts(list);
        setSelectedId(current =>
          list.some(account => String(account.id) === String(current)) ? current : String(list[0]?.id || '')
        );
      } catch (error) {
        showToast?.(error.normalized?.message || 'Could not load customer wallets.', 'error');
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!selectedId) {
      setTransactions([]);
      return undefined;
    }
    let active = true;
    adminWallet
      .getTransactions(selectedId)
      .then(({ data }) => {
        if (active) setTransactions(data?.transactions || []);
      })
      .catch(error => {
        if (active) showToast?.(error.normalized?.message || 'Could not load wallet history.', 'error');
      });
    return () => {
      active = false;
    };
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

  const walletKpis = useMemo(() => {
    let totalSpendable = 0;
    let totalReferral = 0;
    let fundedAccounts = 0;
    accounts.forEach(acc => {
      const sp = Number(acc.balance || 0);
      const rf = Number(acc.referral_balance || 0);
      totalSpendable += sp;
      totalReferral += rf;
      if (sp > 0 || rf > 0) fundedAccounts += 1;
    });
    return {
      totalAccounts: accounts.length,
      fundedAccounts,
      totalSpendable,
      totalReferral,
      combinedFloat: totalSpendable + totalReferral,
    };
  }, [accounts]);

  const filteredTransactions = useMemo(() => {
    if (bucketFilter === 'all') return transactions;
    return transactions.filter(t => (t.wallet_bucket || 'cash') === bucketFilter);
  }, [transactions, bucketFilter]);

  const handleExportWalletsCsv = () => {
    const headers = [
      'Customer ID',
      'Customer Name',
      'Customer Email',
      'Spendable Cash Wallet (INR)',
      'Restricted Referral Wallet (INR)',
      'Combined Wallet Liability (INR)',
      'Account Status',
    ];
    const escapeCell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = accounts.map(a => {
      const sp = Number(a.balance || 0);
      const rf = Number(a.referral_balance || 0);
      return [
        a.id,
        a.name,
        a.email,
        sp.toFixed(2),
        rf.toFixed(2),
        (sp + rf).toFixed(2),
        sp + rf > 0 ? 'Funded' : 'Zero Balance',
      ]
        .map(escapeCell)
        .join(',');
    });
    const csv = `\uFEFF${headers.map(escapeCell).join(',')}\n${rows.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bhumivera-customer-wallets-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-slate-100">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">
            100X Customer Float &amp; Store Credit Treasury
          </p>
          <h2 className="text-xl font-semibold text-white mt-1">Customer wallets</h2>
          <p className="mt-1 text-sm text-slate-400">
            Review spendable and restricted referral balances separately. Adjustments are recorded in the selected
            wallet’s customer history.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportWalletsCsv}
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-3.5 py-2 text-xs font-bold text-emerald-200 hover:bg-emerald-500/25"
        >
          <Download size={14} />
          Export Wallet Ledger CSV
        </button>
      </header>

      {/* 5-Card Wallet Treasury Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Users size={13} className="text-emerald-300" /> Loaded Accounts
          </span>
          <strong className="text-lg font-black text-white">{walletKpis.totalAccounts}</strong>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <span className="text-[11px] text-slate-400 block">Active Funded Wallets</span>
          <strong className="text-lg font-black text-cyan-300">{walletKpis.fundedAccounts}</strong>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <span className="text-[11px] text-slate-400 block">Spendable Balance Float</span>
          <strong className="text-lg font-black text-emerald-300 font-mono">
            ₹{walletKpis.totalSpendable.toFixed(2)}
          </strong>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <span className="text-[11px] text-slate-400 block">Referral Reward Float</span>
          <strong className="text-lg font-black text-amber-300 font-mono">
            ₹{walletKpis.totalReferral.toFixed(2)}
          </strong>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <TrendingUp size={13} className="text-[#d4af37]" /> Total Treasury Liability
          </span>
          <strong className="text-lg font-black text-[#d4af37] font-mono">
            ₹{walletKpis.combinedFloat.toFixed(2)}
          </strong>
        </div>
      </div>

      <form onSubmit={searchCustomers} className="flex gap-2">
        <input
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Search customer name or email"
          aria-label="Search customer wallets"
          className="admin-glass-control min-w-0 flex-1 rounded-lg px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-slate-200 disabled:opacity-50"
        >
          <RefreshCw size={15} />
          Search
        </button>
      </form>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)]">
        <section className="overflow-hidden rounded-xl border border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <h3 className="text-sm font-semibold text-white">Customer accounts</h3>
            {loading && <LoaderCircle size={15} className="animate-spin text-emerald-300" />}
          </div>
          {accounts.length === 0 && !loading ? (
            <p className="p-4 text-sm text-slate-400">No matching customer wallets.</p>
          ) : (
            <div className="max-h-96 divide-y divide-white/10 overflow-y-auto">
              {accounts.map(account => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => setSelectedId(String(account.id))}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left ${
                    String(account.id) === String(selectedId) ? 'bg-emerald-400/10' : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-white">
                      #{account.id} · {account.name}
                    </span>
                    <span className="block truncate text-xs text-slate-400">{account.email}</span>
                  </span>
                  <span className="shrink-0 text-right text-xs">
                    <span className="block font-semibold text-emerald-200">
                      Spendable ₹{Number(account.balance || 0).toFixed(2)}
                    </span>
                    <span className="mt-1 block text-amber-200">
                      Referral ₹{Number(account.referral_balance || 0).toFixed(2)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <form onSubmit={submit} className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2">
            <Wallet size={17} className="text-emerald-300" />
            <h3 className="text-sm font-semibold text-white">Adjust balance</h3>
          </div>
          <p className="text-xs text-slate-400">
            {selectedAccount
              ? `${selectedAccount.name} · ${bucket === 'referral' ? 'Referral' : 'Spendable'} balance ₹${Number(
                  bucket === 'referral' ? selectedAccount.referral_balance || 0 : selectedAccount.balance || 0
                ).toFixed(2)}`
              : 'Choose a customer account.'}
          </p>
          <label className="block text-xs text-slate-300">
            Wallet type
            <select
              value={bucket}
              onChange={event => setBucket(event.target.value)}
              className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"
            >
              <option value="cash">Spendable wallet</option>
              <option value="referral">Restricted referral rewards</option>
            </select>
          </label>
          <label className="block text-xs text-slate-300">
            Action
            <select
              value={type}
              onChange={event => setType(event.target.value)}
              className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"
            >
              <option value="credit">Add wallet credit</option>
              <option value="debit">Remove wallet balance</option>
            </select>
          </label>
          <label className="block text-xs text-slate-300">
            Amount (₹)
            <input
              required
              type="number"
              min="0.01"
              max="1000000"
              step="0.01"
              value={amount}
              onChange={event => setAmount(event.target.value)}
              className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs text-slate-300">
            Reason shown in wallet history
            <textarea
              required
              minLength="5"
              maxLength="200"
              value={reason}
              onChange={event => setReason(event.target.value)}
              className="admin-glass-control mt-1 min-h-20 w-full rounded-lg px-3 py-2 text-sm"
              placeholder="For example: approved customer service credit"
            />
          </label>
          <button
            type="submit"
            disabled={saving || loading || !selectedAccount}
            className="min-h-10 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-[#071a12] disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Record wallet adjustment'}
          </button>
        </form>
      </div>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-white">Selected customer’s latest 100 wallet transactions</h3>
          <div className="flex items-center gap-1.5 text-xs">
            {['all', 'cash', 'referral', 'shopping'].map(b => (
              <button
                key={b}
                type="button"
                onClick={() => setBucketFilter(b)}
                className={`px-2.5 py-1 rounded-lg border capitalize ${
                  bucketFilter === b
                    ? 'bg-emerald-400 text-[#071a12] font-bold border-emerald-400'
                    : 'border-white/10 text-slate-400'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
        {filteredTransactions.length === 0 ? (
          <p className="rounded-xl border border-white/10 p-4 text-sm text-slate-400">
            No wallet transactions recorded.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[740px] text-left text-sm">
              <thead className="bg-white/[0.04] text-xs text-slate-400">
                <tr>
                  <th className="p-3">Tx ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Wallet</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Type</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredTransactions.map(transaction => {
                  const type = String(transaction.type || '').toLowerCase();
                  const isCredit = type === 'credit';
                  const isDebit = type === 'debit';
                  return (
                    <tr key={`${transaction.wallet_bucket || 'cash'}-${transaction.id}`}>
                      <td className="p-3 font-mono text-xs text-slate-500">#{transaction.id}</td>
                      <td className="p-3 text-xs text-slate-400">
                        {new Date(transaction.created_at).toLocaleString()}
                      </td>
                      <td
                        className={`p-3 text-xs ${
                          transaction.wallet_bucket === 'cash' ? 'text-emerald-200' : 'text-amber-200'
                        }`}
                      >
                        {transaction.wallet_bucket === 'shopping'
                          ? 'Shopping reward'
                          : transaction.wallet_bucket === 'referral'
                          ? 'Referral reward'
                          : 'Spendable'}
                      </td>
                      <td className="p-3 text-slate-200">{transaction.description}</td>
                      <td className={`p-3 capitalize ${isCredit ? 'text-emerald-300' : isDebit ? 'text-rose-300' : 'text-slate-300'}`}>{type || 'unknown'}</td>
                      <td
                        className={`p-3 text-right font-medium ${
                          isCredit ? 'text-emerald-300' : isDebit ? 'text-rose-300' : 'text-slate-300'
                        }`}
                      >
                        {isCredit ? '+' : isDebit ? '−' : ''}₹{Math.abs(Number(transaction.amount) || 0).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
