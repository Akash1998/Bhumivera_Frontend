import React, { useState } from 'react';
import {
  Filter,
  ChevronDown,
  Zap,
  DollarSign,
  Check,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterSection = ({ title, icon: Icon, children, isOpen, onToggle }) => (
  <div className="border-b border-white/10 pb-5 mb-5">
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center justify-between w-full mb-3 group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#070a0e] rounded-lg border border-[#d4af37]/30 text-[#fce096] group-hover:bg-gradient-to-r group-hover:from-[#d4af37] group-hover:to-[#fce096] group-hover:text-black transition-all">
          <Icon size={15} />
        </div>
        <span className="font-sub-gold text-[10px] tracking-widest">{title}</span>
      </div>
      <ChevronDown
        size={14}
        className={`text-[#94a3b8] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const RangeSlider = ({ label, min, max, unit, value, onChange }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-end">
      <label className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8]">{label}</label>
      <div className="text-xs font-mono font-bold text-[#fce096]">
        {value}
        {unit}
      </div>
    </div>
    <div className="relative h-1.5 bg-[#070a0e] border border-white/10 rounded-full">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#d4af37] to-[#fce096] rounded-full shadow-[0_0_8px_rgba(212,175,55,0.4)]"
        style={{ width: `${((value - min) / (max - min)) * 100}%` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-[#d4af37] rounded-full shadow-md"
        style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 7px)` }}
      />
    </div>
  </div>
);

export default function FilterSidebar({ onFilterChange, onApply }) {
  const [openSections, setOpenSections] = useState({
    price: true,
    specs: true,
    categories: true,
  });

  const [filters, setFilters] = useState({
    price: 5000,
    concentrationMg: 100,
    volumeMl: 200,
    categories: [],
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const toggleCategory = (cat) => {
    const newCats = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    updateFilter('categories', newCats);
  };

  const resetFilters = () => {
    const defaults = { price: 5000, concentrationMg: 100, volumeMl: 200, categories: [] };
    setFilters(defaults);
    onFilterChange?.(defaults);
  };

  const handleApplyFilters = () => {
    onFilterChange?.(filters);
    onApply?.(filters);
  };

  return (
    <div className="w-full lg:w-80 two-tone-panel-gold rounded-3xl p-6 sm:p-7 h-fit sticky top-28 shadow-xl">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal size={18} className="text-[#fce096]" />
          <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-white">Botanical Filters</h2>
        </div>
        <button
          type="button"
          onClick={resetFilters}
          title="Reset all filters"
          className="p-2 hover:bg-[#070a0e] rounded-xl text-[#94a3b8] hover:text-[#fce096] transition-all"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      <div className="custom-scrollbar pr-1">
        <FilterSection
          title="Price Range"
          icon={DollarSign}
          isOpen={openSections.price}
          onToggle={() => toggleSection('price')}
        >
          <RangeSlider
            label="Max Budget"
            min={199}
            max={10000}
            unit="₹"
            value={filters.price}
            onChange={(v) => updateFilter('price', v)}
          />
        </FilterSection>

        <FilterSection
          title="Potency & Volume"
          icon={Zap}
          isOpen={openSections.specs}
          onToggle={() => toggleSection('specs')}
        >
          <div className="space-y-6">
            <RangeSlider
              label="Botanical Phyto-Complex"
              min={50}
              max={1000}
              unit=" mg"
              value={filters.concentrationMg}
              onChange={(v) => updateFilter('concentrationMg', v)}
            />
            <RangeSlider
              label="Vessel Volume"
              min={15}
              max={500}
              unit=" ml"
              value={filters.volumeMl}
              onChange={(v) => updateFilter('volumeMl', v)}
            />
          </div>
        </FilterSection>

        <FilterSection
          title="Categories"
          icon={Filter}
          isOpen={openSections.categories}
          onToggle={() => toggleSection('categories')}
        >
          <div className="grid grid-cols-1 gap-2">
            {['Luxury Facial Cleansers', 'Luxury Hair Care', 'Night Elixirs & Serums', 'Barrier Hydration'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${
                  filters.categories.includes(cat)
                    ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#fce096] shadow-sm font-bold'
                    : 'bg-[#070a0e] border-white/10 text-[#cbd5e1] hover:border-[#d4af37]/40'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider">{cat}</span>
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    filters.categories.includes(cat)
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#fce096] border-[#d4af37]'
                      : 'border-white/20'
                  }`}
                >
                  {filters.categories.includes(cat) && <Check size={10} className="text-black" />}
                </div>
              </button>
            ))}
          </div>
        </FilterSection>
      </div>

      <button
        type="button"
        onClick={handleApplyFilters}
        className="btn-gold-luxury w-full mt-6 py-4 font-bold uppercase tracking-widest text-xs rounded-xl shadow-xl text-white"
      >
        Apply Filters
      </button>
    </div>
  );
}
