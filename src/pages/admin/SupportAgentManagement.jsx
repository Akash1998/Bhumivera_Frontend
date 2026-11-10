import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, ExternalLink, Headphones, Search, ShieldCheck, Users } from 'lucide-react';
import { supportAgents } from '../../services/api';

const ROLE_DESCRIPTIONS = {
  agent:
    'L1 Support Agent — Live chat replies, order tracking, RMA creation, status changes (Active, Pending, Waiting for Review, Resolved). Max 10% 1-time courtesy coupon.',
  supervisor:
    'L2 Support Supervisor — All Agent rights + Order Cancellations, Goodwill Wallet Credits (up to ₹150), Chat Reassignment & Escalation Queue. Max 12% courtesy coupon.',
  manager:
    'L3 Support Manager — Full Access Control + Create/Edit Staff Logins, Role Matrix, Goodwill Wallet Credits (up to ₹250), and AI Support Feature Governance.',
};

const ROLE_BENCHMARK_TABLE = [
  {
    role: 'Agent (L1)',
    maxCoupon: '10% (1x per customer)',
    maxWalletCredit: '₹0',
    canCancelOrder: 'No',
    canDeleteTickets: 'No (SuperAdmin Only)',
    portalAccess: '/support',
  },
  {
    role: 'Supervisor (L2)',
    maxCoupon: '12% (1x per customer)',
    maxWalletCredit: '₹150 (1x per customer)',
    canCancelOrder: 'Yes',
    canDeleteTickets: 'No (SuperAdmin Only)',
    portalAccess: '/support',
  },
  {
    role: 'Manager (L3)',
    maxCoupon: '15% (1x per customer)',
    maxWalletCredit: '₹250 (1x per customer)',
    canCancelOrder: 'Yes',
    canDeleteTickets: 'No (SuperAdmin Only)',
    portalAccess: '/support & /superadminsupport',
  },
  {
    role: 'SuperAdmin / Owner',
    maxCoupon: 'Up to 50% (Unrestricted)',
    maxWalletCredit: 'Up to ₹2,000',
    canCancelOrder: 'Yes',
    canDeleteTickets: 'Yes (Single & Bulk Purge + SHA-512 Audit)',
    portalAccess: '/admin, /support & /superadminsupport',
  },
];

export default function SupportAgentManagement() {
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    role: 'agent',
    department: 'Customer Concierge',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadAgents = useCallback(async () => {
    const response = await supportAgents.list();
    setAgents(response.data.agents || []);
  }, []);

  useEffect(() => {
    loadAgents()
      .catch(requestError => setError(requestError.response?.data?.message || 'Could not load support agents.'))
      .finally(() => setLoading(false));
  }, [loadAgents]);

  const createAgent = async event => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await supportAgents.create(form);
      setForm({
        username: '',
        name: '',
        email: '',
        password: '',
        role: 'agent',
        department: 'Customer Concierge',
      });
      setMessage('Support login ID created with role-based permissions. Staff can sign in at /support.');
      await loadAgents();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not create support agent.');
    } finally {
      setBusy(false);
    }
  };

  const toggleAgent = async agent => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await supportAgents.setActive(agent.id, !agent.is_active);
      await loadAgents();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not update support agent.');
    } finally {
      setBusy(false);
    }
  };

  const changeAgentRole = async (agent, nextRole) => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await supportAgents.update(agent.id, { role: nextRole });
      setMessage(`Updated @${agent.username} role to ${nextRole.toUpperCase()}.`);
      await loadAgents();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not update support agent role.');
    } finally {
      setBusy(false);
    }
  };

  const filteredAgents = useMemo(() => {
    return agents.filter(a => {
      if (roleFilter !== 'all' && (a.role || 'agent') !== roleFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      return (
        String(a.name || '').toLowerCase().includes(q) ||
        String(a.username || '').toLowerCase().includes(q) ||
        String(a.department || '').toLowerCase().includes(q)
      );
    });
  }, [agents, roleFilter, searchQuery]);

  const handleExportAgentsCsv = () => {
    const headers = [
      'Agent ID',
      'Username',
      'Full Name',
      'Email',
      'Role',
      'Department',
      'Status',
      'Created Date',
    ];
    const escapeCell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = filteredAgents.map(a =>
      [
        a.id,
        a.username,
        a.name,
        a.email || '',
        a.role || 'agent',
        a.department || 'Customer Concierge',
        a.is_active ? 'Active' : 'Disabled',
        a.created_at || '',
      ]
        .map(escapeCell)
        .join(',')
    );
    const csv = `\uFEFF${headers.map(escapeCell).join(',')}\n${rows.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bhumivera-support-agents-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="admin-glass-panel mt-4 rounded-2xl p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Headphones size={19} className="text-[#d4af37]" />
            Support Staff Login IDs &amp; Role Access Control (Agent / Supervisor / Manager)
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            Create multiple staff login IDs for{' '}
            <Link to="/support" className="text-cyan-300 underline">
              bhumivera.com/support
            </Link>{' '}
            and assign them as <strong>Agent</strong>, <strong>Supervisor</strong>, or <strong>Manager</strong>.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportAgentsCsv}
            className="rounded-xl bg-emerald-500/15 border border-emerald-400/30 px-3.5 py-2 text-xs font-bold text-emerald-200 hover:bg-emerald-500/25 flex items-center gap-1.5"
          >
            <Download size={14} /> Export Staff CSV
          </button>
          <Link
            to="/support"
            className="rounded-xl bg-cyan-500/15 border border-cyan-400/30 px-3.5 py-2 text-xs font-bold text-cyan-200 hover:bg-cyan-500/25 flex items-center gap-1.5"
          >
            Agent Desk (/support) <ExternalLink size={12} />
          </Link>
          <Link
            to="/superadminsupport"
            className="rounded-xl bg-amber-400/20 border border-amber-400/40 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-amber-400/30 flex items-center gap-1.5"
          >
            Open SuperAdmin Support Command (/superadminsupport) →
          </Link>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl p-3">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
          {message}
        </p>
      )}

      {/* Role Governance Benchmark Matrix */}
      <div className="rounded-xl border border-white/10 bg-black/25 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-white/10 flex items-center gap-2 text-xs font-bold text-[#d4af37]">
          <ShieldCheck size={15} /> Role Benchmark &amp; Anti-Abuse Permission Matrix
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="bg-black/40 uppercase text-[10px] text-slate-400">
              <tr>
                <th className="p-3">Role Tier</th>
                <th className="p-3">Courtesy Coupon Cap</th>
                <th className="p-3">Goodwill Wallet Credit Cap</th>
                <th className="p-3">Order Cancellation</th>
                <th className="p-3">Support Ticket Deletion</th>
                <th className="p-3">Authorized Portals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {ROLE_BENCHMARK_TABLE.map(row => (
                <tr key={row.role}>
                  <td className="p-3 font-bold text-white">{row.role}</td>
                  <td className="p-3 text-amber-200">{row.maxCoupon}</td>
                  <td className="p-3 text-emerald-300">{row.maxWalletCredit}</td>
                  <td className="p-3 text-slate-300">{row.canCancelOrder}</td>
                  <td className="p-3 text-rose-200">{row.canDeleteTickets}</td>
                  <td className="p-3 font-mono text-cyan-300">{row.portalAccess}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <form onSubmit={createAgent} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <input
          required
          minLength={3}
          maxLength={50}
          pattern="[A-Za-z0-9._@-]+"
          value={form.username}
          onChange={event => setForm(current => ({ ...current, username: event.target.value }))}
          placeholder="Login ID (e.g. agent.riya)"
          className="admin-glass-control rounded-lg px-3 py-2 text-sm text-white"
        />
        <input
          required
          maxLength={100}
          value={form.name}
          onChange={event => setForm(current => ({ ...current, name: event.target.value }))}
          placeholder="Full name"
          className="admin-glass-control rounded-lg px-3 py-2 text-sm text-white"
        />
        <input
          maxLength={100}
          value={form.department}
          onChange={event => setForm(current => ({ ...current, department: event.target.value }))}
          placeholder="Department"
          className="admin-glass-control rounded-lg px-3 py-2 text-sm text-white"
        />
        <select
          value={form.role}
          onChange={event => setForm(current => ({ ...current, role: event.target.value }))}
          className="admin-glass-control rounded-lg px-3 py-2 text-sm text-white font-semibold"
        >
          <option value="agent">Role: Agent (L1)</option>
          <option value="supervisor">Role: Supervisor (L2)</option>
          <option value="manager">Role: Manager (L3)</option>
        </select>
        <input
          required
          minLength={8}
          maxLength={128}
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={event => setForm(current => ({ ...current, password: event.target.value }))}
          placeholder="Password (8+ chars)"
          className="admin-glass-control rounded-lg px-3 py-2 text-sm text-white"
        />
        <button
          disabled={busy}
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          {busy ? 'Saving…' : `Create ${form.role.toUpperCase()} ID`}
        </button>
      </form>

      <p className="text-xs text-gray-400">{ROLE_DESCRIPTIONS[form.role]}</p>

      {/* Filter & Expanded 8-Column Roster Table */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Users size={14} className="text-cyan-300" /> Provisioned Support Staff Accounts ({filteredAgents.length})
          </span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search staff name or @id…"
                className="rounded-xl border border-white/15 bg-black/40 pl-8 pr-3 py-1.5 text-xs text-white"
              />
            </div>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="rounded-xl border border-white/15 bg-black/40 px-3 py-1.5 text-xs text-white"
            >
              <option value="all">All Roles</option>
              <option value="agent">Agent (L1)</option>
              <option value="supervisor">Supervisor (L2)</option>
              <option value="manager">Manager (L3)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full min-w-[820px] text-left text-xs">
            <thead className="bg-black/40 uppercase text-[10px] text-slate-400">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Staff Name</th>
                <th className="p-3">Login ID</th>
                <th className="p-3">Department</th>
                <th className="p-3">Assigned Role</th>
                <th className="p-3">Created</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-6 text-center text-sm text-gray-500">
                    Loading support staff accounts…
                  </td>
                </tr>
              ) : (
                filteredAgents.map(agent => (
                  <tr key={agent.id} className="hover:bg-white/[0.02]">
                    <td className="p-3 font-mono text-slate-500">#{agent.id}</td>
                    <td className="p-3 font-semibold text-white">{agent.name}</td>
                    <td className="p-3 font-mono text-cyan-300">@{agent.username}</td>
                    <td className="p-3 text-slate-300">{agent.department || 'Customer Concierge'}</td>
                    <td className="p-3">
                      <select
                        disabled={busy}
                        value={agent.role || 'agent'}
                        onChange={e => changeAgentRole(agent, e.target.value)}
                        className="admin-glass-control rounded-lg px-2.5 py-1 text-xs text-white"
                      >
                        <option value="agent">Agent (L1)</option>
                        <option value="supervisor">Supervisor (L2)</option>
                        <option value="manager">Manager (L3)</option>
                      </select>
                    </td>
                    <td className="p-3 text-slate-400">
                      {agent.created_at ? new Date(agent.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-3">
                      <span className={agent.is_active ? 'text-emerald-300 font-bold' : 'text-rose-300'}>
                        {agent.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => toggleAgent(agent)}
                        className={`rounded-lg border px-3 py-1.5 text-xs disabled:opacity-50 ${
                          agent.is_active
                            ? 'border-emerald-400/30 text-emerald-300'
                            : 'border-rose-400/30 text-rose-300'
                        }`}
                      >
                        {agent.is_active ? 'Disable access' : 'Enable access'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {!loading && !filteredAgents.length && (
                <tr>
                  <td colSpan="8" className="py-6 text-center text-sm text-gray-500">
                    No support-agent accounts match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
