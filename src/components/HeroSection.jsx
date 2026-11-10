import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Zap, ShieldCheck, Globe, ArrowRight, ShoppingBag, Compass, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const slides = [
  {
    title: "Rooted in Nature, Made With Care",
    subtitle: "The Transparent Maison · Est. 2016 Lineage",
    description: "Cold-pressed Indian botanicals (<28°C), Niacinamide, Hyaluronic Acid, and 100% active milligram-disclosed formulations crafted in Asansol, West Bengal.",
    image: "/assets/images/seabuckthorn nature.webp",
    cta: "Explore the Collection",
    link: "/shop",
  },
  {
    title: "Where Botanical Science, Meets Pure Soil",
    subtitle: "100% Active Percentage & Milligram Disclosure",
    description: "Every formulation pairs heritage plant intelligence from MPG E-Business (Est. 2016) with precision modern actives and full label transparency at bhumivera.com.",
    image: "/assets/images/aloeverascience.webp",
    cta: "Explore Our Science",
    link: "/science",
  },
  {
    title: "Pure Care, Rooted In Its Source",
    subtitle: "10 Years of Group Heritage",
    description: "From Dilip Prasad Nonia's 2016 herbal supply-chain foundation to Akash Prasad's digital cosmetic maison under Bhumivera Organics India Private Limited.",
    image: "/assets/images/plant tree.webp",
    cta: "Inspect Our Heritage",
    link: "/about",
  }
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="relative h-[85vh] min-h-[620px] w-full overflow-hidden bg-[#070a0e] group">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#070a0e] via-[#070a0e]/85 to-transparent z-10 pointer-events-none" />
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
            loading={idx === current ? 'eager' : 'lazy'}
            fetchPriority={idx === current ? 'high' : 'low'}
            decoding="async"
          />
        </div>
      ))}

      <div className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <div className="font-sub-gold inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#070a0e] border border-[#d4af37]/40 text-[10px] tracking-[0.2em] mb-3 shadow-md">
            <Zap size={13} className="text-[#d4af37]" />
            {slides[current].subtitle}
          </div>

          <div
            role="region"
            aria-label="Bhumivera Brand Trust Bar"
            className="mb-5 inline-flex items-center gap-2 rounded-xl border border-[#d4af37]/50 bg-[#070a0e]/90 px-4 py-2 font-mono text-[11px] font-bold tracking-wider text-[#fce096] shadow-lg"
          >
            <Award size={14} className="text-[#d4af37] shrink-0" />
            <span>10 Years of Group Heritage | 100% Active Ingredients | Cold-Pressed Under 28°C | Asansol, West Bengal</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif uppercase tracking-wider font-normal leading-tight text-white mb-4">
            {slides[current].title.split(',').map((part, i) => (
              <span key={i} className={`block ${i === 0 ? 'font-headline-gold' : 'font-headline-silver'}`}>
                {part.trim()}
              </span>
            ))}
          </h1>
          <div className="gold-hairline my-4 max-w-xs" />

          <p className="text-sm sm:text-base text-[#cbd5e1] mb-8 max-w-xl leading-relaxed font-normal">
            {slides[current].description}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to={slides[current].link}
              className="btn-gold-luxury px-8 py-3.5 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all duration-300 flex items-center gap-3 shadow-xl"
            >
              <ShoppingBag size={18} />
              {slides[current].cta}
            </Link>
            <button
              type="button"
              onClick={() => navigate('/about')}
              className="btn-silver-luxury px-8 py-3.5 text-[#cbd5e1] font-semibold uppercase tracking-wider text-xs rounded-xl transition-all duration-300 flex items-center gap-3"
            >
              <Compass size={18} className="text-[#d4af37]" />
              Explore Our 2016 Genesis
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-16 right-10 z-30 flex items-center gap-5">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                i === current ? 'w-12 bg-gradient-to-r from-[#d4af37] to-[#fce096]' : 'w-3 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
            className="p-3 rounded-xl border border-white/15 bg-[#070a0e]/80 backdrop-blur-md text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#fce096] transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
            className="p-3 rounded-xl border border-white/15 bg-[#070a0e]/80 backdrop-blur-md text-[#cbd5e1] hover:border-[#d4af37] hover:text-[#fce096] transition-all"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full z-20 border-t border-[#d4af37]/20 bg-[#070a0e]/90 backdrop-blur-md py-4 hidden lg:block">
        <div className="container mx-auto px-6 flex justify-between items-center text-[#94a3b8] font-mono uppercase tracking-widest text-[10px]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={16} className="text-[#d4af37]" />
            <span className="text-[#cbd5e1]">10 Years of Group Heritage (Est. 2016)</span>
          </div>
          <div className="w-px h-3 bg-white/15" />
          <div className="flex items-center gap-2.5">
            <Globe size={16} className="text-[#d4af37]" />
            <span className="text-[#cbd5e1]">100% Active Ingredients · Milligram Disclosed</span>
          </div>
          <div className="w-px h-3 bg-white/15" />
          <div className="flex items-center gap-2.5">
            <Zap size={16} className="text-[#d4af37]" />
            <span className="text-[#cbd5e1]">Cold-Pressed Under 28°C · Asansol, West Bengal</span>
          </div>
          <div className="w-px h-3 bg-white/15" />
          <Link to="/about" className="flex items-center gap-2 text-[#fce096] hover:text-white transition-colors">
            <span>Discover MPG &amp; Bhumivera Heritage</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
