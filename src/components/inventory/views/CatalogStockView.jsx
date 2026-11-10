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
  QrCode,
} from 'lucide-react';

export default function CatalogStockView({
  items = [],
  velocityData,
  onEditItem,
  onAdjustStock,
  onPrintBarcode,
  onGenerateBatchQr,
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
        i.gstHsnCode?.includes(q) ||
        i.binCode?.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [items, searchTerm, selectedCat]);

  return (
    <div className="space-y-4 animate-in fade-in duration-150 w-full max-w-full overflow-x-hidden">
      {/* Top Search & Filter Bar */}
      <div className="bg-[#0c261b] p-4 rounded-2xl border border-emerald-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          <div className="relative min-w-[220px] max-w-md flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by SKU, Product Name, HSN (30049011), EAN-13, Bin Code..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#071711] text-white border border-emerald-500/40 rounded-xl focus:border-emerald-400 focus:outline-none font-medium placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-bold transition ${
                  selectedCat === cat
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                    : 'bg-[#071711] text-slate-300 hover:text-white hover:bg-emerald-950/50 border border-emerald-500/25'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onGenerateBatchQr ? onGenerateBatchQr(null) : onEditItem(null)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-600 rounded-xl text-xs font-bold transition shadow-sm"
            title="Generate and print batch barcodes / QR stickers for mobile scanner"
          >
            <QrCode className="w-4 h-4 text-emerald-400" /> Batch Barcodes / QR
          </button>
          <button
            onClick={() => onEditItem(null)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-emerald-950/50"
          >
            <Plus className="w-4 h-4" /> Add Master SKU
          </button>
        </div>
      </div>

      {/* Products Stock Table */}
      <div className="bg-[#0c261b] rounded-2xl border border-emerald-500/30 shadow-xl overflow-hidden w-full max-w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead className="bg-[#071711] text-emerald-300 uppercase font-bold text-[10px] tracking-wider border-b border-emerald-500/30">
              <tr>
                <th className="px-4 py-3">Product Formulation &amp; Category</th>
                <th className="px-4 py-3">SKU &amp; Barcode</th>
                <th className="px-4 py-3 text-center">HSN &amp; GST</th>
                <th className="px-4 py-3">Bin Location</th>
                <th className="px-4 py-3 text-center">Physical Stock</th>
                <th className="px-4 py-3 text-center">Shop / Vault</th>
                <th className="px-4 py-3 text-center">Velocity (DOC)</th>
                <th className="px-4 py-3 text-right">Pricing (MRP/Sale)</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/15">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const vel = velocityMap[item.sku];
                  const doc = vel?.daysOfCover ?? 45;
                  const isLow = (item.qty || item.physicalStock) <= (item.minStock || 20);

                  return (
                    <tr key={item.id} className="hover:bg-emerald-950/30 transition">
                      <td className="px-4 py-3">
                        <div className="font-bold text-white line-clamp-1">{item.name}</div>
                        <div className="text-[10px] text-slate-300 font-medium">{item.cat} • {item.uom}</div>
                      </td>

                      <td className="px-4 py-3 font-mono">
                        <div className="font-semibold text-emerald-300">{item.sku}</div>
                        <div className="text-[10px] text-slate-400">{item.barcode}</div>
                      </td>

                      {/* Prominent HSN Code & Tax Column */}
                      <td className="px-4 py-3 text-center font-mono">
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[11px]">
                          {item.gstHsnCode || '30049011'}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-sans">
                          {item.gstRate || 5}% GST
                        </div>
                      </td>

                      <td className="px-4 py-3 font-mono">
                        <div className="flex items-center gap-1 font-bold text-slate-200">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{item.binCode || 'ASN-DEFAULT'}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans">{item.rackLocation || 'Zone A'}</div>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black font-mono shadow-sm ${
                          isLow
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {item.qty ?? item.physicalStock ?? 0}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center text-[11px] text-slate-300">
                        <div>Shop: <strong className="text-white">{item.shopDisplayStock || 0}</strong></div>
                        <div className="text-[10px] text-slate-400">Vault: {item.warehouseVaultStock || 0}</div>
                      </td>

                      {/* AI Velocity Days-of-Cover Badge */}
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          doc <= 15
                            ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                            : doc <= 30
                            ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
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
                        <div className="font-bold text-white font-mono text-sm">₹{item.price}</div>
                        <div className="text-[10px] text-slate-400 line-through">₹{item.mrp}</div>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onGenerateBatchQr ? onGenerateBatchQr(item) : onEditItem(item)}
                            className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-800/40 rounded-lg transition"
                            title="Generate Batch Barcode / QR Sticker for Android Scanner"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onAdjustStock(item)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition border border-slate-600"
                            title="Quick Stock +/- Adjustment"
                          >
                            Adjust
                          </button>
                          <button
                            onClick={() => onEditItem(item)}
                            className="p-1.5 text-slate-300 hover:text-white hover:bg-emerald-800/40 rounded-lg transition"
                            title="Edit Master Product Meta & HSN"
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
                  <td colSpan={9} className="text-center py-10 text-slate-300">
                    <Boxes className="w-8 h-8 mx-auto text-emerald-400/60 mb-2" />
                    No formulations matching search criteria.
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
