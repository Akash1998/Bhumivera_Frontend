import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const CategoryCard = ({ category }) => {
  return (
    <Link 
      to={category?.id ? `/shop?category=${category.id}` : `/shop`}
      className="two-tone-card group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-[#0d1520] border border-[#d4af37]/25 transition-all duration-700 hover:border-[#d4af37]/70 hover:shadow-[0_0_50px_rgba(212,175,55,0.15)]"
    >
      {/* Background Image */}
      <img 
        src={category.image} 
        alt={category.name}
        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070a0e] via-[#070a0e]/50 to-transparent opacity-85 transition-opacity duration-500 group-hover:opacity-95" />
      
      {/* Top Badge */}
      <div className="absolute top-5 left-5 opacity-0 translate-y-3 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-[#d4af37]/40 text-[#fce096] text-[10px] font-mono font-bold uppercase tracking-[0.2em] backdrop-blur-md">
          <Sparkles size={11} className="text-[#d4af37]" />
          <span>Curated Ritual</span>
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-7 transform transition-transform duration-500 group-hover:translate-y-[-4px]">
        <div className="relative z-10">
          <span className="font-sub-gold block text-[10px] tracking-[0.25em] mb-2">
            {category.count}+ Formulations
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight mb-3 group-hover:text-[#fce096] transition-colors duration-300">
            {category.name}
          </h3>
          
          <div className="flex items-center gap-2 text-[#cbd5e1] text-xs font-mono font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-6px] group-hover:translate-x-0">
            <span>Explore Collection</span>
            <ArrowRight size={14} className="text-[#d4af37]" />
          </div>
        </div>
      </div>

      {/* Subtle Gold Ambient Glow */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#d4af37]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </Link>
  );
};

export default CategoryCard;
