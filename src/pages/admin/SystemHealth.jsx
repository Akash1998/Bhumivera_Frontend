import React, { useCallback, useEffect, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, CircleHelp, Download, Pause, Play, RefreshCw, Server, ShieldAlert, X } from 'lucide-react';
import { systemAdmin } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const statusLabel = status => String(status || 'unknown').replaceAll('_', ' ');
const statusClass = status => {
  if (['healthy', 'enabled', 'configured', 'redis_configured', 'no_recent_errors'].includes(status)) {
    return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300';
  }
  if (status === 'paused') return 'border-amber-500/25 bg-amber-500/10 text-amber-200';
  return 'border-rose-500/25 bg-rose-500/10 text-rose-300';
};

export default function SystemHealth() {
  const { token } = useAuth();
  const toast = useToast();
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [updatingModule, setUpdatingModule] = useState('');
  const [requestFilter, setRequestFilter] = useState('');
  const [requestSearch, setRequestSearch] = useState('');

  const loadHealth = useCallback(async ({ quiet = false } = {}) => {
    if (!quiet) setLoading(true);
    setLoadError('');
    try {
      const response = await systemAdmin.getHealth();
      setHealth(response.data);
    } catch (error) {
      const message = error.normalized?.message || error.response?.data?.message || 'System health could not be loaded.';
      setLoadError(message);
      if (!quiet) toast.error(message);
    } finally {
      if (!quiet) setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!token) return undefined;
    loadHealth();
    const timer = window.setInterval(() => loadHealth({ quiet: true }), 30000);
    return () => window.clearInterval(timer);
  }, [token, loadHealth]);

  const toggleModule = async module => {
    const enabled = !module.enabled;
    if (!enabled && !window.confirm(`Pause ${module.name}?\n\n${module.impact}\n\nRequests to this module's API endpoints will return a maintenance response until resumed.`)) {
      return;
    }
    setUpdatingModule(module.id);
    try {
      await systemAdmin.setModuleEnabled(module.id, enabled);
      await loadHealth({ quiet: true });
      toast.success(`${module.name} ${enabled ? 'resumed' : 'paused'}.`);
    } catch (error) {
      toast.error(error.normalized?.message || error.response?.data?.message || `Could not ${enabled ? 'resume' : 'pause'} ${module.name}.`);
    } finally {
      setUpdatingModule('');
    }
  };

  const services = health?.services || {};
  const metrics = health?.requestMetrics || {};
  const filteredRequests = (metrics.recentRequests || []).filter(request => {
    if (requestFilter === 'errors' && request.statusCode < 500) return false;
    const query = requestSearch.trim().toLowerCase();
    return !query || `${request.method} ${request.path} ${request.statusCode} ${request.requestId}`.toLowerCase().includes(query);
  });
  const exportRequests = () => {
    if (!filteredRequests.length) return;
    const csvCell = value => {
      const text = String(value ?? '');
      const safeText = /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text;
      return `"${safeText.replaceAll('"', '""')}"`;
    };
    const rows = [
      ['Time (UTC)', 'Method', 'Path (query omitted)', 'HTTP status', 'Duration (ms)', 'Request ID'],
      ...filteredRequests.map(request => [
        request.occurredAt,
        request.method,
        request.path,
        request.statusCode,
        request.durationMs,
        request.requestId,
      ]),
    ];
    const blob = new Blob([rows.map(row => row.map(csvCell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-requests-${new Date().toISOString().replaceAll(':', '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const selectRequestFilter = filter => {
    setRequestFilter(current => current === filter ? '' : filter);
    setRequestSearch('');
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10 text-slate-200">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d4af37]">Operations</p>
          <h2 className="mt-1 flex items-center gap-2 text-2xl font-semibold text-white">
            <Activity size={23} className="text-emerald-400" /> System health
            {health && <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${statusClass(health.status)}`}>{statusLabel(health.status)}</span>}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">Live backend checks, recent server errors, and controls for registered API modules.</p>
        </div>
        <button type="button" onClick={() => loadHealth()} disabled={loading} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white hover:bg-white/10 disabled:opacity-60">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </header>

      {loadError && <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">{loadError}</div>}

      {health && (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ['Database', services.database?.status],
              ['Email configuration', services.email?.status],
              ['Payments configuration', services.payments?.status],
              ['Rate-limit store', services.rateLimits?.status],
            ].map(([label, status]) => (
              <article key={label} className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs font-medium text-slate-400">{label}</p>
                <span className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(status)}`}>{statusLabel(status)}</span>
                {label === 'Email configuration' && <p className="mt-2 text-xs leading-5 text-slate-500">{services.email?.note}</p>}
                {label === 'Email configuration' && services.email?.deliveryMetrics && (
                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    {services.email.deliveryMetrics.acceptedCount} accepted · {services.email.deliveryMetrics.failedCount} failed · {services.email.deliveryMetrics.recipientCount} recipients since this process started.
                    {services.email.deliveryMetrics.lastFailureCode ? ` Last failure: ${services.email.deliveryMetrics.lastFailureCode}.` : ''}
                  </p>
                )}
                {label === 'Rate-limit store' && services.rateLimits?.note && <p className="mt-2 text-xs leading-5 text-slate-500">{services.rateLimits.note}</p>}
              </article>
            ))}
          </section>

          <section className="grid gap-3 sm:grid-cols-3">
            {[
              { key: 'all', label: 'Requests · 15 min', value: metrics.requestCount ?? 0 },
              { key: 'errors', label: 'Server errors · 15 min', value: metrics.serverErrorCount ?? 0 },
              { key: 'errors', label: 'Error rate · 15 min', value: `${metrics.serverErrorRatePercent ?? 0}%` },
            ].map(({ key, label, value }, index) => (
              <button
                key={`${label}-${index}`}
                type="button"
                onClick={() => selectRequestFilter(key)}
                aria-pressed={requestFilter === key}
                className={`rounded-xl border p-4 text-left transition hover:border-cyan-400/50 hover:bg-cyan-400/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${requestFilter === key ? 'border-cyan-400/60 bg-cyan-400/[0.08]' : 'border-white/10 bg-white/[0.035]'}`}
              >
                <span className="block text-xs font-medium text-slate-400">{label} · click to inspect</span>
                <span className="mt-2 block text-2xl font-semibold text-white">{value}</span>
              </button>
            ))}
          </section>

          {requestFilter && (
            <section className="overflow-hidden rounded-xl border border-cyan-400/20 bg-white/[0.035]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
                <div>
                  <h3 className="font-semibold text-white">{requestFilter === 'errors' ? 'Recent HTTP 5xx requests' : 'Recent API requests'}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    {metrics.sampleRecordCount || 0} recent request records shown (maximum {metrics.sampleLimit || 100}); counts include repeated polls/retries and are not a visitor count.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    aria-label="Filter request records"
                    value={requestSearch}
                    onChange={event => setRequestSearch(event.target.value)}
                    placeholder="Filter path, status, request ID"
                    className="min-h-9 w-full rounded-lg border border-white/10 bg-[#081b15] px-3 text-xs text-white outline-none focus:border-cyan-400 sm:w-64"
                  />
                  <button type="button" onClick={exportRequests} disabled={!filteredRequests.length} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-emerald-400/30 px-3 text-xs font-semibold text-emerald-200 hover:bg-emerald-400/10 disabled:opacity-50">
                    <Download size={14} /> Export CSV
                  </button>
                  <button type="button" onClick={() => setRequestFilter('')} aria-label="Close request details" className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/5">
                    <X size={15} />
                  </button>
                </div>
              </div>
              {metrics.sampleIsCapped && (
                <p role="status" className="border-b border-amber-400/10 bg-amber-400/[0.04] px-4 py-2 text-xs text-amber-100">
                  This request sample is capped; the displayed/exported rows are not every request in the 15-minute count.
                </p>
              )}
              {!filteredRequests.length ? (
                <p className="p-5 text-sm text-slate-400">No request records match this filter in the current sample.</p>
              ) : (
                <div className="overflow-auto">
                  <table className="w-full min-w-[820px] border-collapse text-left text-xs">
                    <thead className="sticky top-0 bg-[#081b15] text-[10px] uppercase tracking-wider text-slate-500">
                      <tr><th className="p-3">Time</th><th className="p-3">Status</th><th className="p-3">Request path</th><th className="p-3">Duration</th><th className="p-3">Request ID</th></tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map(request => (
                        <tr key={request.requestId} className="border-t border-slate-800 align-top">
                          <td className="whitespace-nowrap p-3 text-slate-400">{new Date(request.occurredAt).toLocaleString()}</td>
                          <td className={`p-3 font-semibold ${request.statusCode >= 500 ? 'text-rose-200' : 'text-slate-300'}`}>{request.statusCode}</td>
                          <td className="break-all p-3 text-slate-200">{request.method} {request.path}</td>
                          <td className="whitespace-nowrap p-3 text-slate-400">{request.durationMs} ms</td>
                          <td className="break-all p-3 font-mono text-slate-500">{request.requestId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          <section className="rounded-xl border border-white/10 bg-white/[0.035] p-4 sm:p-5">
            <div className="mb-4 flex items-start gap-3">
              <CircleHelp size={18} className="mt-0.5 shrink-0 text-[#d4af37]" />
              <p className="text-sm leading-6 text-slate-300">{health.limitations} Metrics cover this running backend process only; configuration checks do not send test email or payment requests.</p>
            </div>
            {metrics.sampleIsCapped && <p role="status" className="mb-3 text-xs leading-5 text-amber-200">The detailed request list reached its {metrics.sampleLimit} record display cap. The total request and server-error counters are counted separately in one-second buckets.</p>}
            <p className="mb-3 text-xs leading-5 text-slate-400">Request totals count HTTP requests completed by this backend process, including this dashboard’s refreshes, health checks, repeat calls, and retries. They do not represent unique people. The diagnostics do not collect IP addresses, location, Wi-Fi names, device fingerprints, or customer profiles.</p>
            <p className="text-xs text-slate-500">Checked {health.checkedAt ? new Date(health.checkedAt).toLocaleString() : '—'} · uptime {Math.floor((health.process?.uptimeSeconds || 0) / 60)} minutes</p>
          </section>

          <section>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-white">API modules</h3>
                <p className="mt-1 text-sm text-slate-400">Pausing blocks the listed module's API requests and returns HTTP 503. Admin health controls remain available.</p>
              </div>
              <span className="text-xs text-slate-500">Changes take effect on the next API request.</span>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {(health.modules || []).map(module => (
                <article key={module.id} className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Server size={16} className="shrink-0 text-slate-400" />
                        <h4 className="font-semibold text-white">{module.name}</h4>
                        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${statusClass(module.status)}`}>{statusLabel(module.status)}</span>
                      </div>
                      <p className="mt-2 text-sm leading-5 text-slate-400">{module.description}</p>
                      <p className="mt-2 text-xs leading-5 text-slate-500"><strong className="text-slate-400">Impact:</strong> {module.impact}</p>
                      <p className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusClass(module.healthStatus)}`}>
                        {module.recentServerErrorCount ? `${module.recentServerErrorCount} recent server error(s)` : 'No recent server errors'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleModule(module)}
                      disabled={updatingModule === module.id}
                      aria-label={`${module.enabled ? 'Pause' : 'Resume'} ${module.name} module`}
                      className={`inline-flex min-h-9 shrink-0 items-center gap-2 rounded-lg border px-3 text-xs font-semibold transition disabled:cursor-wait disabled:opacity-60 ${module.enabled ? 'border-amber-500/30 text-amber-200 hover:bg-amber-500/10' : 'border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/10'}`}
                    >
                      {updatingModule === module.id ? <RefreshCw size={14} className="animate-spin" /> : module.enabled ? <Pause size={14} /> : <Play size={14} />}
                      {module.enabled ? 'Pause' : 'Resume'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-white/[0.035] p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              {metrics.serverErrorCount ? <ShieldAlert size={17} className="text-rose-300" /> : <CheckCircle2 size={17} className="text-emerald-300" />}
              <h3 className="font-semibold text-white">Recent server errors</h3>
            </div>
            {!metrics.recentServerErrors?.length ? (
              <p className="text-sm text-slate-400">No HTTP 5xx responses recorded by this process in the last 15 minutes.</p>
            ) : (
              <div className="space-y-2">
                {metrics.recentServerErrors.map(error => (
                  <div key={error.requestId} className="grid gap-1 rounded-lg border border-rose-500/15 bg-rose-500/[0.04] p-3 text-xs sm:grid-cols-[1fr_auto] sm:items-center">
                    <p className="break-all text-rose-100"><strong>{error.statusCode}</strong> {error.method} {error.path}</p>
                    <p className="text-slate-500">{new Date(error.occurredAt).toLocaleTimeString()} · {error.requestId}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {!health && loading && <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-slate-400"><RefreshCw size={18} className="animate-spin" /> Checking backend health…</div>}
      {!health && !loading && !loadError && <p className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm text-amber-100"><AlertTriangle className="mr-2 inline" size={16} />No health data is available yet.</p>}
    </div>
  );
}
