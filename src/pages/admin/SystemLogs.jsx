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
  const [systemEvents, setSystemEvents] = useState([]);
  const [providerLogs, setProviderLogs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  const loadLogs = useCallback(async (quiet = false) => {
    setLoading(true);
    setLoadError('');
    try {
      if (activeView === 'server' || activeView === 'providers') {
        const logsPromise = systemAdmin.getLogs(100);
        if (activeView === 'server') {
          const [healthResponse, logsResponse] = await Promise.all([systemAdmin.getHealth(), logsPromise]);
          setServerErrors(healthResponse.data?.requestMetrics?.recentServerErrors || []);
          setRequestMetrics(healthResponse.data?.requestMetrics || null);
          setSystemEvents(logsResponse.data?.events || []);
          setProviderLogs(logsResponse.data?.providers || null);
        } else {
          const logsResponse = await logsPromise;
          setSystemEvents(logsResponse.data?.events || []);
          setProviderLogs(logsResponse.data?.providers || null);
        }
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

  const filteredServerErrors = useMemo(() => systemEvents.filter(error => {
    const query = search.trim().toLowerCase();
    return !query || [
      error.source, error.method, error.endpoint, error.http_status, error.request_id,
      error.error_code, error.sql_state, error.sql_template, error.sql_fingerprint,
    ].some(value => String(value || '').toLowerCase().includes(query));
  }), [systemEvents, search]);
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
          ['providers', 'Railway / Vercel'],
        ].map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={activeView === id} onClick={() => setActiveView(id)} className={`border-b-2 px-4 py-3 text-xs font-semibold ${activeView === id ? 'border-cyan-400 text-cyan-200' : 'border-transparent text-slate-500 hover:text-slate-200'}`}>
            {label}
          </button>
        ))}
      </nav>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.035]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              {activeView === 'server' ? 'Persistent backend failures' : activeView === 'client' ? 'Browser error reports' : 'Live provider records'}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {activeView === 'server'
                ? `MySQL · 30-day retention · current process observed ${requestMetrics?.requestCount || 0} requests in the last ${requestMetrics?.windowMinutes || 15} minutes`
                : activeView === 'client' ? 'Most recent browser and failed API request reports' : 'Provider APIs checked when this view refreshes'}
            </p>
          </div>
          {activeView !== 'providers' && (
            <label className="relative block w-full sm:w-72">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input aria-label="Search logs" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search errors" className="w-full rounded-lg border border-slate-700 bg-[#081b15] py-2 pl-9 pr-3 text-xs text-white outline-none focus:border-cyan-500" />
            </label>
          )}
        </div>

        {loadError ? (
          <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <AlertTriangle size={28} className="text-rose-300" />
            <p className="max-w-xl text-sm text-rose-200">{loadError}</p>
            <button type="button" onClick={() => loadLogs()} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/5">Retry</button>
          </div>
        ) : loading && !serverErrors.length && !clientErrors.length && !systemEvents.length && !providerLogs ? (
          <div className="flex flex-1 items-center justify-center gap-2 p-6 text-sm text-slate-400"><RefreshCw size={16} className="animate-spin" /> Loading logs…</div>
        ) : activeView === 'providers' ? (
          <div className="min-h-0 flex-1 space-y-4 overflow-auto p-4">
            {providerLogs && ['railway', 'vercelRuntime', 'vercelEvents'].map(provider => {
              const data = providerLogs[provider];
              const configKey = provider.startsWith('vercel') ? 'vercel' : provider;
              const config = providerLogs.configuration?.[configKey];
              const label = provider === 'railway'
                ? 'Railway HTTP request logs'
                : provider === 'vercelRuntime' ? 'Vercel runtime logs' : 'Vercel deployment/build events';
              return (
                <section key={provider} className="rounded-lg border border-white/10 bg-black/10 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-white">{label}</h4>
                      <p className="mt-1 text-xs text-slate-400">{data?.source}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${data?.error ? 'bg-rose-500/10 text-rose-200' : data?.configured ? 'bg-emerald-500/10 text-emerald-200' : 'bg-amber-500/10 text-amber-200'}`}>
                      {data?.error ? 'Provider request failed' : data?.configured ? 'Connected' : 'Not configured'}
                    </span>
                  </div>
                  {data?.error ? (
                    <p className="mt-3 text-xs text-rose-200">{data.error}</p>
                  ) : !data?.configured ? (
                    <p className="mt-3 text-xs text-slate-400">Missing backend variables: {config?.missing?.join(', ') || 'provider credentials'}. Add these to the Railway backend service variables.</p>
                  ) : data.records?.length ? (
                    <div className="mt-3 overflow-auto">
                      {data.sampleWindowMs ? (
                        <p className="mb-2 text-[11px] text-slate-500">Stream sampled until idle ({(data.sampleWindowMs / 1000).toFixed(1)}s); records shown are the events returned during this sample.</p>
                      ) : null}
                      <table className="w-full min-w-[600px] text-left text-xs">
                        <thead className="text-[10px] uppercase tracking-wider text-slate-500">
                          <tr><th className="p-2">Time</th><th className="p-2">Type / Status</th><th className="p-2">Details</th></tr>
                        </thead>
                        <tbody>
                          {data.records.map((record, index) => (
                            <tr key={`${record.occurredAt || 'record'}-${index}`} className="border-t border-slate-800 align-top">
                              <td className="whitespace-nowrap p-2 text-slate-400">{record.occurredAt ? new Date(record.occurredAt).toLocaleString() : '—'}</td>
                              <td className="p-2 text-rose-200">{record.statusCode || record.severity || 'Event'}{record.method ? ` · ${record.method}` : ''}</td>
                              <td className="break-all p-2 text-slate-300">{record.path || record.message || 'No additional provider details.'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-slate-400">
                      {provider === 'railway'
                        ? 'No failing HTTP requests were returned for the last hour.'
                        : provider === 'vercelRuntime'
                          ? `No runtime log events were received in the ${((data.sampleWindowMs || 1500) / 1000).toFixed(1)}-second stream sample. This does not confirm that the deployment had no logs.`
                          : 'No records were returned for this deployment.'}
                    </p>
                  )}
                </section>
              );
            })}
            <p className="text-xs leading-5 text-amber-100/70">
              Railway access logs show request status and endpoint but may not identify the internal cause. Vercel runtime logs are scoped to one deployment and capped at 200 returned records. Backend variables are read by Railway; Vercel-only variables are not shared with the backend.
            </p>
          </div>
        ) : activeView === 'server' ? (
          filteredServerErrors.length ? (
            <div className="min-h-0 flex-1 overflow-auto">
              <table className="w-full min-w-[900px] border-collapse text-left text-xs">
                <thead className="sticky top-0 bg-[#081b15] text-[10px] uppercase tracking-wider text-slate-500">
                  <tr><th className="p-3">Time</th><th className="p-3">Source</th><th className="p-3">Cause / Code</th><th className="p-3">Request / DB detail</th><th className="p-3">Request ID</th></tr>
                </thead>
                <tbody>
                  {filteredServerErrors.map(error => (
                    <tr key={error.id} className="border-t border-slate-800 align-top">
                      <td className="whitespace-nowrap p-3 text-slate-400">{new Date(error.occurred_at).toLocaleString()}</td>
                      <td className="p-3 text-cyan-200">{error.source}{error.http_status ? ` · ${error.http_status}` : ''}</td>
                      <td className="break-all p-3 font-semibold text-rose-200"><ShieldAlert className="mr-1 inline" size={13} />{error.error_code || error.sql_state || 'Failure'}{error.sql_fingerprint ? <span className="block font-normal text-slate-500">SQL fingerprint: {error.sql_fingerprint.slice(0, 12)}</span> : null}</td>
                      <td className="break-all p-3 text-slate-300">{error.method ? `${error.method} ` : ''}{error.endpoint || error.sql_template || '—'}</td>
                      <td className="break-all p-3 font-mono text-slate-500">{error.request_id || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center text-slate-400">
              <Activity size={28} className="text-emerald-300" />
              <p className="text-sm">No persisted backend failures were recorded during the retention window.</p>
              <p className="max-w-lg text-xs leading-5 text-slate-500">The in-memory request summary is local to this backend process. Persistent records are shared through MySQL and retained for 30 days.</p>
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
