import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supportAgents } from '../../services/api';

const ROLE_DESCRIPTIONS = {
  agent: 'L1 Support Agent — Live chat replies, order tracking, RMA creation, status changes (Active, Pending, Waiting for Review, Resolved).',
  supervisor: 'L2 Support Supervisor — All Agent rights + Order Cancellations, Goodwill Wallet Credits, Chat Reassignment & Escalation Queue.',
  manager: 'L3 Support Manager — Full Access Control + Create/Edit Staff Logins, Role Matrix, and AI Support Feature Governance.',
};

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

  return (
    <section className="admin-glass-panel mt-6 rounded-2xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Support Staff Login IDs & Role Access Control (Agent / Supervisor / Manager)
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            Create multiple staff login IDs for{' '}
            <a href="/support" className="text-cyan-300 underline">
              bhumivera.com/support
            </a>{' '}
            and assign them as <strong>Agent</strong>, <strong>Supervisor</strong>, or <strong>Manager</strong>.
          </p>
        </div>
        <Link
          to="/superadminsupport"
          className="rounded-xl bg-amber-400/20 border border-amber-400/40 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-amber-400/30"
        >
          Open SuperAdmin Support Command (/superadminsupport) →
        </Link>
      </div>

      {error && (
        <p role="alert" className="mb-3 text-sm text-rose-300">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="mb-3 text-sm text-emerald-300">
          {message}
        </p>
      )}

      <form onSubmit={createAgent} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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

      <p className="mt-2 text-xs text-gray-400">{ROLE_DESCRIPTIONS[form.role]}</p>

      <div className="mt-5 divide-y divide-gray-800 border-y border-gray-800">
        {loading ? (
          <p className="py-4 text-sm text-gray-500">Loading support staff accounts…</p>
        ) : (
          agents.map(agent => (
            <div key={agent.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
              <div>
                <p className="font-medium text-white">
                  {agent.name}{' '}
                  <span className="text-cyan-300 font-mono text-xs">@{agent.username}</span>{' '}
                  <span className="ml-2 rounded bg-white/10 px-2 py-0.5 text-[11px] uppercase tracking-wider text-amber-300">
                    {agent.role || 'agent'}
                  </span>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Department: {agent.department || 'Customer Concierge'} · Created{' '}
                  {new Date(agent.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  disabled={busy}
                  value={agent.role || 'agent'}
                  onChange={e => changeAgentRole(agent, e.target.value)}
                  className="admin-glass-control rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="agent">Agent (L1)</option>
                  <option value="supervisor">Supervisor (L2)</option>
                  <option value="manager">Manager (L3)</option>
                </select>
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
              </div>
            </div>
          ))
        )}
        {!loading && !agents.length && (
          <p className="py-4 text-sm text-gray-500">No support-agent accounts have been created yet.</p>
        )}
      </div>
    </section>
  );
}
