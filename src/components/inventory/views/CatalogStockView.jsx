import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Search,
  Filter,
  Plus,
  Edit3,
  MapPin,
  Barcode,
  Sparkles,
  AlertTriangle,
  Package,
} from 'lucide-react';

export default function CatalogStockView({
  items = [],
  velocityData,
  onEditItem,
  onAdjustStock,
  onPrintBarcode,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');

  // Categories
  const categories = useMemo(() => {
    const set = new Set(items.map(i => i.cat).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [items]);

  // Velocity Map
  const velocityMap = useMemo(() => {
    const map = {};
    if (velocityData?.forecasts) {
      for (const f of velocityData.forecasts) {
        map[f.sku] = f;
      }
    }
    return map;
  }, [velocityData]);

  // Filtered items
  const filteredItems = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return items.filter(i => {
      const matchCat = selectedCat === 'ALL' || i.cat === selectedCat;
      const matchQ =
        !q ||
        i.name?.toLowerCase().includes(q) ||
        i.sku?.toLowerCase().includes(q) ||
        i.barcode?.includes(q) ||
        i.binCode?.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [items, searchTerm, selectedCat]);

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[220px] max-w-md flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by SKU, Product Name, EAN-13, Bin Code..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-medium transition ${
                  selectedCat === cat
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onEditItem(null)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Master SKU
        </button>
      </div>

      {/* Products Stock Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Product Name & Category</th>
                <th className="px-4 py-3">SKU & Barcode</th>
                <th className="px-4 py-3">Bin Location</th>
                <th className="px-4 py-3 text-center">Physical Stock</th>
                <th className="px-4 py-3 text-center">Shop / Vault</th>
                <th className="px-4 py-3 text-center">AI Velocity (DOC)</th>
                <th className="px-4 py-3 text-right">Pricing (MRP/Sale)</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const vel = velocityMap[item.sku];
                  const doc = vel?.daysOfCover ?? 45;
                  const isLow = (item.qty || item.physicalStock) <= (item.minStock || 20);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 line-clamp-1">{item.name}</div>
                        <div className="text-[10px] text-slate-400">{item.cat} • {item.uom}</div>
                      </td>

                      <td className="px-4 py-3 font-mono">
                        <div className="font-semibold text-slate-800">{item.sku}</div>
                        <div className="text-[10px] text-slate-400">{item.barcode}</div>
                      </td>

                      <td className="px-4 py-3 font-mono">
                        <div className="flex items-center gap-1 font-bold text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>{item.binCode || 'ASN-DEFAULT'}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans">{item.rackLocation || 'Zone A'}</div>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black font-mono ${
                          isLow
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          {item.qty ?? item.physicalStock ?? 0}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center text-[11px] text-slate-600">
                        <div>Shop: <strong>{item.shopDisplayStock || 0}</strong></div>
                        <div className="text-[10px] text-slate-400">Vault: {item.warehouseVaultStock || 0}</div>
                      </td>

                      {/* AI Velocity Days-of-Cover Badge */}
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          doc <= 15
                            ? 'bg-rose-100 text-rose-800'
                            : doc <= 30
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {doc}d Cover
                        </span>
                        {vel && (
                          <div className="text-[9px] text-slate-400 mt-0.5 font-mono">
                            {vel.dailyRunRate}/day
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="font-bold text-slate-900 font-mono">₹{item.price}</div>
                        <div className="text-[10px] text-slate-400 line-through">₹{item.mrp}</div>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onAdjustStock(item)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                            title="Quick Stock Adjustment"
                          >
                            Adjust
                          </button>
                          <button
                            onClick={() => onEditItem(item)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                            title="Edit Master Product Meta"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    <Boxes className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No products matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
