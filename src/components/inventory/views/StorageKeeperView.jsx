import React, { useState } from 'react';
import {
  Warehouse,
  Search,
  Plus,
  ArrowLeftRight,
  Edit3,
  MapPin,
  CheckCircle2,
  Package,
} from 'lucide-react';

export default function StorageKeeperView({
  bins = [],
  onEditBin,
  onOpenTransfer,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState('ALL');

  const zones = ['ALL', ...Array.from(new Set(bins.map(b => b.zone || b.zone_name).filter(Boolean)))];

  const filteredBins = bins.filter(b => {
    const bZone = b.zone || b.zone_name || '';
    const matchZone = zoneFilter === 'ALL' || bZone === zoneFilter;
    const q = searchTerm.trim().toLowerCase();
    const matchQ =
      !q ||
      b.binCode?.toLowerCase().includes(q) ||
      b.bin_code?.toLowerCase().includes(q) ||
      bZone.toLowerCase().includes(q) ||
      b.rackLocation?.toLowerCase().includes(q) ||
      b.binLabel?.toLowerCase().includes(q);
    return matchZone && matchQ;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-150 w-full max-w-full overflow-x-hidden">
      {/* Controls Bar */}
      <div className="bg-[#0c261b] p-4 rounded-2xl border border-emerald-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          <div className="relative min-w-[220px] max-w-md flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search storage bins, rack location, zone..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#071711] text-white border border-emerald-500/40 rounded-xl focus:border-emerald-400 focus:outline-none font-medium placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full scrollbar-thin">
            {zones.map((z) => (
              <button
                key={z}
                onClick={() => setZoneFilter(z)}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-bold transition ${
                  zoneFilter === z
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                    : 'bg-[#071711] text-slate-300 hover:text-white hover:bg-emerald-950/50 border border-emerald-500/25'
                }`}
              >
                {z}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenTransfer}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <ArrowLeftRight className="w-4 h-4 text-emerald-400" /> Move Stock
          </button>
          <button
            onClick={() => onEditBin(null)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-emerald-950/50"
          >
            <Plus className="w-4 h-4" /> New Bin
          </button>
        </div>
      </div>

      {/* Bins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full max-w-full">
        {filteredBins.map((bin) => {
          const code = bin.binCode || bin.bin_code;
          const zone = bin.zone || bin.zone_name || 'Zone A';
          const rack = bin.rack || bin.rack_no || '01';
          const capacity = bin.capacity || bin.capacity_units || 500;
          const occupied = bin.occupied || bin.occupied_units || 0;
          const percent = Math.min(100, Math.round((occupied / Math.max(1, capacity)) * 100));

          return (
            <div
              key={bin.id}
              className="bg-[#0c261b] p-4 rounded-2xl border border-emerald-500/30 shadow-lg space-y-3 hover:border-emerald-400 transition group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-mono font-black text-sm text-white tracking-wide">{code}</span>
                  </div>
                  <div className="text-[11px] text-emerald-300/80 font-medium mt-0.5">
                    {zone} • Rack {rack}
                  </div>
                </div>
                <button
                  onClick={() => onEditBin(bin)}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-emerald-900/40 rounded-lg transition"
                  title="Configure Storage Bin"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              {bin.bin_label && (
                <div className="text-xs text-slate-200 line-clamp-1 font-medium bg-[#071711] px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  {bin.bin_label}
                </div>
              )}

              {/* Progress & Occupancy Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-slate-300 uppercase">Occupancy</span>
                  <span className="font-mono font-bold text-white text-xs">
                    {occupied} / {capacity} units ({percent}%)
                  </span>
                </div>
                <div className="w-full bg-[#071711] h-2 rounded-full overflow-hidden border border-emerald-500/25">
                  <div
                    className={`h-full transition-all duration-300 ${
                      percent >= 90
                        ? 'bg-rose-500'
                        : percent >= 70
                        ? 'bg-amber-500'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-emerald-500/20">
                <span>Temp: <strong className="text-slate-200">{bin.temperature_target || bin.temperatureTarget || 'Ambient'}</strong></span>
                <span>Keeper: <strong className="text-slate-200">{bin.keeper_name || bin.keeperName || 'Rahul Sharma'}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
