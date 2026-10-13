import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, AlertTriangle, ExternalLink, RefreshCw, Search, ShieldAlert } from 'lucide-react';
import { clientErrors as clientErrorsApi, systemAdmin } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function SystemLogs() {
  const { token } = useAuth();
  const [activeView, setActiveView] = useState('server');
  const [search, setSearch] = useState('');
  const [serverErrors, setServerErrors] = useState([]);
  const [requestMetrics, setRequestMetrics] = useState(null);
  const [clientErrors, setClientErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  const loadLogs = useCallback(async (quiet = false) => {
    setLoading(true);
    setLoadError('');
    try {
      if (activeView === 'server') {
        const response = await systemAdmin.getHealth();
        setServerErrors(response.data?.requestMetrics?.recentServerErrors || []);
        setRequestMetrics(response.data?.requestMetrics || null);
      } else {
        const response = await clientErrorsApi.getAllAdmin(100);
        setClientErrors(response.data?.data || []);
      }
    } catch (error) {
      const message = error.normalized?.message || error.response?.data?.message || 'Could not load system logs.';
      setLoadError(message);
      if (!quiet) console.error('[ADMIN_SYSTEM_LOGS_LOAD]', error);
    } finally {
      setLoading(false);
    }
  }, [activeView]);

  useEffect(() => {
    if (!token) return undefined;
    loadLogs();
    const timer = window.setInterval(() => loadLogs(true), 30000);
    return () => window.clearInterval(timer);
  }, [token, activeView, loadLogs]);

  const filteredServerErrors = useMemo(() => serverErrors.filter(error => {
    const query = search.trim().toLowerCase();
    return !query || `${error.method} ${error.path} ${error.statusCode} ${error.requestId}`.toLowerCase().includes(query);
  }), [serverErrors, search]);
  const filteredClientErrors = useMemo(() => clientErrors.filter(error => {
    const query = search.trim().toLowerCase();
    return !query || [error.message, error.source, error.page_url].some(value => String(value || '').toLowerCase().includes(query));
  }), [clientErrors, search]);

  return (
    <div className="flex min-h-[60vh] flex-col gap-5 text-slate-200">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-white"><Activity size={22} className="text-cyan-300" /> System logs</h2>
          <p className="mt-1 text-sm text-slate-400">Real HTTP server failures and browser reports. No simulated telemetry.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/admin/dashboard/system-health" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#d4af37]/30 px-3 text-sm text-[#f3d77b] hover:bg-[#d4af37]/10">
            System health <ExternalLink size={14} />
          </Link>
          <button type="button" onClick={() => loadLogs()} disabled={loading} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white hover:bg-white/10 disabled:opacity-60">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </header>

      <nav role="tablist" aria-label="System log views" className="flex gap-2 border-b border-slate-800">
        {[
          ['server', 'Server errors'],
          ['client', 'Browser errors'],
        ].map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={activeView === id} onClick={() => setActiveView(id)} className={`border-b-2 px-4 py-3 text-xs font-semibold ${activeView === id ? 'border-cyan-400 text-cyan-200' : 'border-transparent text-slate-500 hover:text-slate-200'}`}>
            {label}
          </button>
        ))}
      </nav>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.035]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
          <div>
            <h3 className="text-sm font-semibold text-white">{activeView === 'server' ? 'HTTP 5xx responses' : 'Browser error reports'}</h3>
            <p className="mt-1 text-xs text-slate-500">{activeView === 'server' ? `Current process · last ${requestMetrics?.windowMinutes || 15} minutes · ${requestMetrics?.requestCount || 0} requests observed` : 'Most recent browser reports'}</p>
          </div>
          <label className="relative block w-full sm:w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input aria-label="Search logs" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search errors" className="w-full rounded-lg border border-slate-700 bg-[#081b15] py-2 pl-9 pr-3 text-xs text-white outline-none focus:border-cyan-500" />
          </label>
        </div>

        {loadError ? (
          <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <AlertTriangle size={28} className="text-rose-300" />
            <p className="max-w-xl text-sm text-rose-200">{loadError}</p>
            <button type="button" onClick={() => loadLogs()} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/5">Retry</button>
          </div>
        ) : loading && !serverErrors.length && !clientErrors.length ? (
          <div className="flex flex-1 items-center justify-center gap-2 p-6 text-sm text-slate-400"><RefreshCw size={16} className="animate-spin" /> Loading logs…</div>
        ) : activeView === 'server' ? (
          filteredServerErrors.length ? (
            <div className="min-h-0 flex-1 overflow-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-xs">
                <thead className="sticky top-0 bg-[#081b15] text-[10px] uppercase tracking-wider text-slate-500">
                  <tr><th className="p-3">Time</th><th className="p-3">Status</th><th className="p-3">Request</th><th className="p-3">Request ID</th></tr>
                </thead>
                <tbody>
                  {filteredServerErrors.map(error => (
                    <tr key={error.requestId} className="border-t border-slate-800 align-top">
                      <td className="whitespace-nowrap p-3 text-slate-400">{new Date(error.occurredAt).toLocaleString()}</td>
                      <td className="p-3 font-semibold text-rose-200"><ShieldAlert className="mr-1 inline" size={13} />{error.statusCode}</td>
                      <td className="break-all p-3 text-slate-200">{error.method} {error.path}</td>
                      <td className="break-all p-3 font-mono text-slate-500">{error.requestId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center text-slate-400">
              <Activity size={28} className="text-emerald-300" />
              <p className="text-sm">No server errors recorded in the current process during the last 15 minutes.</p>
              <p className="max-w-lg text-xs leading-5 text-slate-500">This is an in-memory rolling window and resets when the backend restarts. It does not include other Railway replicas.</p>
            </div>
          )
        ) : filteredClientErrors.length ? (
          <div className="min-h-0 flex-1 overflow-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-xs">
              <thead className="sticky top-0 bg-[#081b15] text-[10px] uppercase tracking-wider text-slate-500">
                <tr><th className="p-3">Time</th><th className="p-3">Page</th><th className="p-3">Error</th><th className="p-3">Source</th><th className="p-3">Details</th></tr>
              </thead>
              <tbody>
                {filteredClientErrors.map(error => (
                  <tr key={error.id} className="border-t border-slate-800 align-top text-slate-300">
                    <td className="whitespace-nowrap p-3 text-slate-500">{new Date(error.created_at).toLocaleString()}</td>
                    <td className="max-w-40 truncate p-3" title={error.page_url || ''}>{error.page_url || '—'}</td>
                    <td className="max-w-md break-words p-3 text-rose-200">{error.message}</td>
                    <td className="max-w-48 truncate p-3 text-slate-500" title={error.source || ''}>{error.source || '—'}{error.line_number ? `:${error.line_number}` : ''}</td>
                    <td className="p-3">{error.stack ? <details><summary className="cursor-pointer text-cyan-300">Stack</summary><pre className="mt-2 max-w-xl whitespace-pre-wrap break-words text-[10px] text-slate-400">{error.stack}</pre></details> : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center gap-2 p-8 text-sm text-slate-400"><CheckCircle2Fallback /> No browser error reports found.</div>
        )}
      </section>
    </div>
  );
}

function CheckCircle2Fallback() {
  return <Activity size={18} className="text-emerald-300" aria-hidden="true" />;
}
