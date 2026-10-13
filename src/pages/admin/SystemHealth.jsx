import React, { useCallback, useEffect, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, CircleHelp, Pause, Play, RefreshCw, Server, ShieldAlert } from 'lucide-react';
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
              ['Requests · 15 min', metrics.requestCount ?? 0],
              ['Server errors · 15 min', metrics.serverErrorCount ?? 0],
              ['Error rate · 15 min', `${metrics.serverErrorRatePercent ?? 0}%`],
            ].map(([label, value]) => (
              <article key={label} className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs font-medium text-slate-400">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
              </article>
            ))}
          </section>

          <section className="rounded-xl border border-white/10 bg-white/[0.035] p-4 sm:p-5">
            <div className="mb-4 flex items-start gap-3">
              <CircleHelp size={18} className="mt-0.5 shrink-0 text-[#d4af37]" />
              <p className="text-sm leading-6 text-slate-300">{health.limitations} Metrics cover this running backend process only; configuration checks do not send test email or payment requests.</p>
            </div>
            {metrics.sampleIsCapped && <p role="status" className="mb-3 text-xs leading-5 text-amber-200">The request sample reached its {metrics.sampleLimit} entry cap; request totals and error rates may be undercounted in this high-traffic window.</p>}
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
