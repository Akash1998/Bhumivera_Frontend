import { useCallback, useEffect, useState } from 'react';
import { supportAgents } from '../../services/api';

export default function SupportAgentManagement() {
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({ username: '', name: '', password: '' });
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
      setForm({ username: '', name: '', password: '' });
      setMessage('Support agent created. Share the user ID and temporary password securely.');
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

  return (
    <section className="admin-glass-panel mt-6 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white">Support agent access</h3>
      <p className="mb-4 mt-1 text-sm text-gray-400">Create and disable staff accounts for the separate <a href="/support" className="text-cyan-300 underline">Support Desk</a>. Agents can view customer profiles and orders, reply to support cases, email customers, and send password-reset links.</p>
      {error && <p role="alert" className="mb-3 text-sm text-rose-300">{error}</p>}
      {message && <p role="status" className="mb-3 text-sm text-emerald-300">{message}</p>}
      <form onSubmit={createAgent} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input required minLength={3} maxLength={50} pattern="[A-Za-z0-9._-]+" value={form.username} onChange={event => setForm(current => ({ ...current, username: event.target.value }))} placeholder="Support user ID" className="admin-glass-control rounded-lg px-3 py-2 text-sm text-white"/>
        <input required maxLength={100} value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} placeholder="Agent name" className="admin-glass-control rounded-lg px-3 py-2 text-sm text-white"/>
        <input required minLength={12} maxLength={128} type="password" autoComplete="new-password" value={form.password} onChange={event => setForm(current => ({ ...current, password: event.target.value }))} placeholder="Temporary password (12+ chars)" className="admin-glass-control rounded-lg px-3 py-2 text-sm text-white"/>
        <button disabled={busy} className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50">{busy ? 'Saving…' : 'Create support account'}</button>
      </form>
      <div className="mt-5 divide-y divide-gray-800 border-y border-gray-800">
        {loading ? <p className="py-4 text-sm text-gray-500">Loading agents…</p> : agents.map(agent => (
          <div key={agent.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
            <div><p className="font-medium text-white">{agent.name} <span className="text-gray-500">@{agent.username}</span></p><p className="mt-1 text-xs text-gray-500">Created {new Date(agent.created_at).toLocaleDateString()}</p></div>
            <button type="button" disabled={busy} onClick={() => toggleAgent(agent)} className={`rounded-lg border px-3 py-2 text-xs disabled:opacity-50 ${agent.is_active ? 'border-emerald-400/30 text-emerald-300' : 'border-rose-400/30 text-rose-300'}`}>{agent.is_active ? 'Disable access' : 'Enable access'}</button>
          </div>
        ))}
        {!loading && !agents.length && <p className="py-4 text-sm text-gray-500">No support-agent accounts have been created yet.</p>}
      </div>
    </section>
  );
}
