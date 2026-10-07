import React, { useState, useEffect, useRef } from 'react';
import { clientErrors as clientErrorsApi } from '../../services/api';
import { 
  Terminal, AlertTriangle, Info, XCircle, Activity, 
  Cpu, HardDrive, Wifi, Download, Search, Filter, 
  Pause, Play, Trash2, Server, ShieldCheck, Database
} from 'lucide-react';

const LOG_LEVELS = {
  INFO: { color: 'text-cyan-400', icon: Info, bg: 'bg-cyan-500/10' },
  WARN: { color: 'text-amber-400', icon: AlertTriangle, bg: 'bg-amber-500/10' },
  ERROR: { color: 'text-rose-400', icon: XCircle, bg: 'bg-rose-500/10' },
  SYSTEM: { color: 'text-emerald-400', icon: Server, bg: 'bg-emerald-500/10' },
  SEC: { color: 'text-purple-400', icon: ShieldCheck, bg: 'bg-purple-500/10' }
};

export default function SystemLogs() {
  const [logs, setLogs] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [activeView, setActiveView] = useState('telemetry');
  const [clientErrors, setClientErrors] = useState([]);
  const [clientErrorsLoading, setClientErrorsLoading] = useState(false);
  const [clientErrorsLoadError, setClientErrorsLoadError] = useState('');
  const [clientErrorsRefresh, setClientErrorsRefresh] = useState(0);
  const [metrics, setMetrics] = useState({ cpu: 42, ram: 68, net: 124, errRate: 0.05 });
  const logEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    setLogs([]);
    setMetrics({ cpu: 0, ram: 0, net: 0, errRate: 0 });
  }, []);

  useEffect(() => {
    if (!isPaused && scrollContainerRef.current) {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isPaused]);

  useEffect(() => {
    if (activeView !== 'client-errors') return undefined;
    let active = true;
    setClientErrorsLoading(true);
    setClientErrorsLoadError('');
    clientErrorsApi.getAllAdmin(100)
      .then(response => {
        if (active) setClientErrors(response.data?.data || []);
      })
      .catch(error => {
        if (active) setClientErrorsLoadError(error.normalized?.message || 'Failed to load client errors.');
      })
      .finally(() => {
        if (active) setClientErrorsLoading(false);
      });
    return () => { active = false; };
  }, [activeView, clientErrorsRefresh]);

  const filteredLogs = logs.filter(log => {
    if (activeFilter !== 'ALL' && log.level !== activeFilter) return false;
    if (search && !log.msg.toLowerCase().includes(search.toLowerCase()) && !log.src.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filteredClientErrors = clientErrors.filter(error => {
    if (!search) return true;
    const query = search.toLowerCase();
    return [error.message, error.source, error.page_url].some(value => value?.toLowerCase().includes(query));
  });

  const exportLogs = () => {
    const csv = filteredLogs.map(l => `${l.timestamp.toISOString()},${l.level},${l.src},${l.reqId},"${l.msg}"`).join('\n');
    const blob = new Blob([`TIMESTAMP,LEVEL,SOURCE,REQ_ID,MESSAGE\n${csv}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telemetry_${new Date().getTime()}.csv`;
    a.click();
  };

  const statCards = [
    { label: 'CPU Load', value: `${metrics.cpu}%`, icon: Cpu, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Memory Usage', value: `${metrics.ram}%`, icon: HardDrive, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Network I/O', value: `${metrics.net} MB/s`, icon: Wifi, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Error Rate', value: `${metrics.errRate}%`, icon: Activity, color: metrics.errRate > 0.08 ? 'text-rose-400' : 'text-cyan-400', bg: metrics.errRate > 0.08 ? 'bg-rose-500/10' : 'bg-cyan-500/10' }
  ];

  return (
    <div className="space-y-6 max-w-full overflow-hidden flex flex-col h-[calc(100vh-6rem)]">
      <style>{`
        .terminal-scroll::-webkit-scrollbar { width: 6px; }
        .terminal-scroll::-webkit-scrollbar-track { background: #050810; }
        .terminal-scroll::-webkit-scrollbar-thumb { background-color: rgba(34, 211, 238, 0.3); border-radius: 4px; }
        .terminal-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(34, 211, 238, 0.6); }
      `}</style>

      <div role="tablist" aria-label="System log views" className="flex gap-2 border-b border-slate-800">
        <button role="tab" aria-selected={activeView === 'telemetry'} onClick={() => setActiveView('telemetry')} className={`border-b-2 px-4 py-3 text-xs font-bold ${activeView === 'telemetry' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-500'}`}>
          Live Telemetry
        </button>
        <button role="tab" aria-selected={activeView === 'client-errors'} onClick={() => setActiveView('client-errors')} className={`border-b-2 px-4 py-3 text-xs font-bold ${activeView === 'client-errors' ? 'border-rose-400 text-rose-300' : 'border-transparent text-slate-500'}`}>
          Client Errors
        </button>
      </div>

      {activeView === 'telemetry' ? (
      <div className="flex min-h-0 flex-1 flex-col gap-6">

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-4 rounded-2xl flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{stat.label}</p>
              <p className="text-xl font-black text-white font-mono tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-2xl flex flex-col flex-1 overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-slate-800/50 gap-4 bg-slate-950/50">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Grep logs..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />
            </div>
            <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-1">
              {['ALL', 'ERROR', 'WARN', 'SEC'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setActiveFilter(lvl)}
                  className={`px-3 py-1.5 text-xs font-mono font-bold rounded-md transition-all ${activeFilter === lvl ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button 
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all border ${isPaused ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'}`}
            >
              {isPaused ? <Play size={14} /> : <Pause size={14} />}
              {isPaused ? 'RESUME' : 'PAUSE'}
            </button>
            <button onClick={() => setLogs([])} className="p-2 bg-slate-950 border border-slate-800 hover:border-rose-500/50 hover:text-rose-400 rounded-lg text-slate-400 transition-all">
              <Trash2 size={16} />
            </button>
            <button onClick={exportLogs} className="p-2 bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 rounded-lg text-slate-400 transition-all">
              <Download size={16} />
            </button>
          </div>
        </div>

        <div className="bg-[#050810] flex-1 overflow-y-auto terminal-scroll p-4 font-mono text-xs" ref={scrollContainerRef}>
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-600">
              <Terminal size={32} className="mb-2 opacity-50" />
              <p>No telemetry data matches parameters.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {filteredLogs.map((log) => {
                const config = LOG_LEVELS[log.level];
                const Icon = config.icon;
                return (
                  <div key={log.id} className="flex items-start gap-3 hover:bg-slate-800/30 p-1.5 rounded transition-colors group">
                    <span className="text-slate-600 flex-shrink-0 w-24">
                      {log.timestamp.toISOString().split('T')[1].replace('Z', '')}
                    </span>
                    <div className={`flex items-center gap-1.5 flex-shrink-0 w-20 ${config.color}`}>
                      <Icon size={12} />
                      <span className="font-bold">{log.level}</span>
                    </div>
                    <span className="text-slate-500 flex-shrink-0 w-28 truncate" title={log.src}>
                      [{log.src}]
                    </span>
                    <span className="text-slate-700 flex-shrink-0 w-20 hidden sm:block">
                      {log.reqId}
                    </span>
                    <span className="text-slate-300 break-words flex-1 group-hover:text-white transition-colors">
                      {log.msg}
                    </span>
                  </div>
                );
              })}
              <div ref={logEndRef} />
            </div>
          )}
        </div>
      </div>
      </div>
      ) : (
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between gap-4 border-b border-slate-800 p-4">
            <div>
              <h2 className="text-sm font-bold text-white">Client Errors</h2>
              <p className="mt-1 text-xs text-slate-500">Most recent browser error reports</p>
            </div>
            <div className="flex items-center gap-2">
              <input aria-label="Search client errors" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search errors" className="w-44 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-cyan-500" />
              <button onClick={() => setClientErrorsRefresh(value => value + 1)} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-cyan-500 hover:text-white">Refresh</button>
            </div>
          </div>
          {clientErrorsLoading ? (
            <div className="p-6 text-sm text-slate-400">Loading client errors…</div>
          ) : clientErrorsLoadError ? (
            <div role="alert" className="p-6 text-sm text-rose-300">{clientErrorsLoadError}</div>
          ) : filteredClientErrors.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">No client error reports found.</div>
          ) : (
            <div className="min-h-0 flex-1 overflow-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-xs">
                <thead className="sticky top-0 bg-slate-950 text-[10px] uppercase tracking-wider text-slate-500">
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
          )}
        </section>
      )}
    </div>
  );
}
