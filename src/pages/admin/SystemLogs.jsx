import React, { useState, useEffect, useRef } from 'react';
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

const MOCK_SOURCES = ['api-gateway', 'auth-service', 'db-cluster', 'payment-worker', 'img-processor'];
const MOCK_MESSAGES = [
  { level: 'INFO', msg: 'User session established successfully', src: 'auth-service' },
  { level: 'INFO', msg: 'Cache payload refreshed for route /api/products', src: 'api-gateway' },
  { level: 'SYSTEM', msg: 'Garbage collection cycle completed (1.2ms)', src: 'api-gateway' },
  { level: 'WARN', msg: 'High latency detected on query execution (850ms)', src: 'db-cluster' },
  { level: 'ERROR', msg: 'Connection timeout pooling primary replica', src: 'db-cluster' },
  { level: 'SEC', msg: 'Rate limit exceeded for IP 192.168.1.104', src: 'auth-service' },
  { level: 'INFO', msg: 'Payment intent pi_3J9Z... confirmed', src: 'payment-worker' },
  { level: 'WARN', msg: 'Image processing queue buildup (45 pending)', src: 'img-processor' },
  { level: 'ERROR', msg: 'Failed to sync vector embeddings', src: 'api-gateway' },
  { level: 'SEC', msg: 'Invalid JWT signature detected', src: 'auth-service' }
];

export default function SystemLogs() {
  const [logs, setLogs] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [metrics, setMetrics] = useState({ cpu: 42, ram: 68, net: 124, errRate: 0.05 });
  const logEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const initLogs = Array.from({ length: 15 }).map((_, i) => generateLog(new Date(Date.now() - (15 - i) * 2000)));
    setLogs(initLogs);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLogs = [...prev, generateLog(new Date())];
        return newLogs.length > 200 ? newLogs.slice(newLogs.length - 200) : newLogs;
      });
      setMetrics({
        cpu: Math.floor(Math.random() * 20) + 30,
        ram: Math.floor(Math.random() * 10) + 65,
        net: Math.floor(Math.random() * 150) + 50,
        errRate: (Math.random() * 0.1).toFixed(2)
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (!isPaused && scrollContainerRef.current) {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isPaused]);

  const generateLog = (timestamp) => {
    const template = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
    const id = Math.random().toString(36).substr(2, 9);
    return { id, timestamp, ...template, reqId: `req_${Math.random().toString(36).substr(2, 6)}` };
  };

  const filteredLogs = logs.filter(log => {
    if (activeFilter !== 'ALL' && log.level !== activeFilter) return false;
    if (search && !log.msg.toLowerCase().includes(search.toLowerCase()) && !log.src.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
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
  );
}
