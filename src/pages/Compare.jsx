import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  Check,
  Sparkles,
  Star,
  ArrowRight,
  FlaskConical,
  Droplets,
  ShieldCheck,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';
import { FALLBACK_CATALOG_PRODUCTS, HOME_VISUAL_ASSETS } from '../data/bhumiveraUniqueData';

export default function Compare() {
  const { addToCart } = useCart() || {};
  const { compareItems = [], addToCompare, removeFromCompare } = useCompare() || {};
  const [selectedIds, setSelectedIds] = useState([101, 102, 103, 104]);

  // Combine user's compareItems with our pre-loaded signature formulations so the page is NEVER empty or broken!
  const activeProducts =
    compareItems && compareItems.length > 0
      ? compareItems.map((item) => {
          const match = FALLBACK_CATALOG_PRODUCTS.find(
            (p) => String(p.id) === String(item.id || item._id) || p.name === item.name
          );
          return match ? { ...match, ...item, image_url: match.image_url } : item;
        })
      : FALLBACK_CATALOG_PRODUCTS.filter((p) => selectedIds.includes(p.id));

  const toggleProductSelection = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else if (selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds([...selectedIds.slice(1), id]);
    }
  };

  const rows = [
    { label: 'Formulation Price (INR)', key: 'price', render: (p) => `₹${p.discount_price || p.price} (MRP ₹${p.price})` },
    { label: 'Ritual Category', key: 'category_name', render: (p) => p.category_name || 'Botanical Care' },
    { label: 'Calibrated pH Window', key: 'phLevel', render: (p) => p.phLevel || 'pH 5.5 Balanced' },
    { label: 'Primary Botanical Extracts', key: 'primaryBotanicals', render: (p) => p.primaryBotanicals || 'Cold-Pressed Himalayan Botanicals' },
    { label: 'Clinical & Dermatological Actives', key: 'clinicalActives', render: (p) => p.clinicalActives || 'Niacinamide & Hyaluronic Acid' },
    { label: 'Skin / Scalp Compatibility', key: 'skinTypeCompatibility', render: (p) => p.skinTypeCompatibility || 'All Skin Types (24h Patch Test)' },
    { label: 'Cleansing / Carrier Matrix', key: 'surfactantSystem', render: (p) => p.surfactantSystem || 'Sulfate-Free Plant Glucoside' },
    { label: 'Recommended AM / PM Ritual', key: 'ritualTiming', render: (p) => p.ritualTiming || 'AM & PM Daily Ritual' },
    { label: 'Apothecary Vessel & Volume', key: 'volume', render: (p) => p.volume || '100 ml UV-Protected Vessel' },
    { label: 'Reference Batch & QC Code', key: 'batchCode', render: (p) => p.batchCode || 'BV-QC-2026' },
  ];

  return (
    <main className="min-h-screen bg-[#070a0e] text-[#e2e8f0] py-20 px-4 sm:px-8 font-sans selection:bg-[#d4af37]/30 selection:text-white">
      <SEO
        title="Compare Botanical Formulations Side-by-Side | Bhumivera"
        description="Compare Bhumivera facial cleansers, Kumkumadi night elixir, hair cleanser, and barrier hydro-gel across pH level, active concentrations, and skin types."
        route="/compare"
      />

      <div className="mx-auto max-w-7xl">
        {/* Header Banner */}
        <div className="rounded-3xl two-tone-panel-gold p-8 sm:p-12 text-white shadow-2xl mb-10 border border-[#d4af37]/40">
          <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#070a0e] px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fce096]">
                <FlaskConical size={13} className="text-[#d4af37]" /> Side-by-Side Formulation &amp; INCI Matrix
              </span>
              <h1 className="mt-4 font-serif text-3xl sm:text-5xl text-white">
                <span className="font-headline-gold">Compare</span> <span className="font-headline-silver">Botanical Formulations</span>
              </h1>
              <div className="gold-hairline my-4 max-w-xs" />
              <p className="font-sub-silver text-xs tracking-[0.2em] uppercase mb-3 text-[#fce096]/90">
                pH calibration · INCI potency · Skin compatibility
              </p>
              <p className="mt-3 max-w-2xl text-xs sm:text-sm leading-6 text-[#cbd5e1]">
                Inspect calibrated pH levels, exact botanical percentages, clinical co-actives, and surfactant systems side-by-side to choose the right ritual for your skin and scalp.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {FALLBACK_CATALOG_PRODUCTS.map((prod) => {
                  const active = activeProducts.some((p) => String(p.id) === String(prod.id));
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => toggleProductSelection(prod.id)}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                        active
                          ? 'border-[#d4af37] btn-gold-luxury text-white'
                          : 'border-[#d4af37]/30 bg-[#070a0e] text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#fce096]'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {prod.name.replace(/^Bhumivera\s+/i, '')}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#d4af37]/30 bg-[#070a0e] shadow-lg">
              <img
                src={HOME_VISUAL_ASSETS.realLifeFieldStudies[3].image}
                alt="Four natural skincare formulation swatches on frosted glass"
                className="h-52 w-full object-cover"
              />
              <div className="p-3.5 text-[11px] text-[#cbd5e1] border-t border-[#d4af37]/20 bg-[#0d1520]/80">
                <strong className="text-[#fce096]">Real-Life Texture Swatch Plate:</strong> Sea Buckthorn Amber Gel, Activated Bamboo Charcoal, Kashmiri Saffron Kumkumadi Oil, and Aloe-Gotu Kola Hydro-Gel.
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-3xl two-tone-card border border-[#d4af37]/30 shadow-2xl">
          <table className="w-full min-w-[920px] border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#d4af37]/25 bg-[#070a0e]">
                <th className="w-56 p-6 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]">
                  Formulation Parameter
                </th>
                {activeProducts.map((product) => (
                  <th key={product.id || product._id} className="w-64 border-l border-[#d4af37]/20 p-6 align-top bg-[#070a0e]/60">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#070a0e] border border-[#d4af37]/25 mb-4">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <Link
                      to={`/product/${product.slug || product.id}`}
                      className="font-serif text-lg font-bold text-white hover:text-[#fce096] block leading-snug transition-colors"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-2 flex items-center gap-1 text-[#d4af37] text-xs font-semibold">
                      <Star size={13} className="fill-current" />
                      <span className="text-[#fce096]">{product.rating || 4.9}</span>
                      <span className="text-[#94a3b8]">({product.reviews || 90} reviews)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart?.(product, 1)}
                      className="btn-gold-luxury mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg"
                    >
                      <ShoppingCart size={14} /> Add to Bag · ₹{product.discount_price || product.price}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d4af37]/15">
              {rows.map((row) => (
                <tr key={row.key} className="hover:bg-[#0d1520]/60 transition-colors">
                  <td className="p-5 font-semibold text-white bg-[#070a0e]/80">{row.label}</td>
                  {activeProducts.map((product) => (
                    <td key={`${product.id}-${row.key}`} className="border-l border-[#d4af37]/15 p-5 text-[#cbd5e1] leading-relaxed">
                      {row.render(product)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
