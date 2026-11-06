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
      b.rackLocation?.toLowerCase().includes(q);
    return matchZone && matchQ;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[220px] max-w-md flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search storage bins, rack location..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
            {zones.map((z) => (
              <button
                key={z}
                onClick={() => setZoneFilter(z)}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-medium transition ${
                  zoneFilter === z
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {z}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTransfer}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition shrink-0"
          >
            <ArrowLeftRight className="w-4 h-4" /> Move Stock
          </button>
          <button
            onClick={() => onEditBin(null)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" /> New Bin
          </button>
        </div>
      </div>

      {/* Bins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-indigo-400 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1 font-mono font-bold text-sm text-slate-900">
                    <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{code}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {zone} • Rack {rack}
                  </div>
                </div>
                <button
                  onClick={() => onEditBin(bin)}
                  className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Capacity Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Occupancy</span>
                  <span className="font-mono">{occupied} / {capacity} units ({percent}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      percent > 85 ? 'bg-rose-500' : percent > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
