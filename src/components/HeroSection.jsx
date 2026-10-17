import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, ShieldCheck, Globe, ArrowRight, Play, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BhumiveraVideo from './BhumiveraVideo';

const slides = [
  {
    title: "Rooted in Nature, Made With Care",
    subtitle: "Himalayan Botanical Formulations",
    description: "Cold-pressed Sea Buckthorn, Niacinamide, Hyaluronic Acid, and heritage Ayurvedic extracts crafted for daily skin and hair rituals.",
    video: "/assets/videos/hero-seabuckthorn.mp4",
    poster: "/assets/images/seabuckthorn.webp",
    cta: "Explore the Collection",
    link: "/products",
    accent: "emerald"
  },
  {
    title: "Where Botanical Science, Meets Pure Soil",
    subtitle: "Dermatological Active Synergy",
    description: "Every formulation pairs heritage plant intelligence with precision modern actives and full label transparency.",
    video: "/assets/videos/aloe-science-lab.mp4",
    poster: "/assets/images/aloeverascience.webp",
    cta: "Explore the Collection",
    link: "/products",
    accent: "blue"
  },
  {
    title: "Care Returned, To Its Source",
    subtitle: "Living Earth Stewardship",
    description: "Follow our verified stewardship ledger, 360° quality seal guarantee, and zero-friction courtesy protection.",
    video: "/assets/videos/planting-vision.mp4",
    poster: "/assets/images/plant tree.webp",
    cta: "Explore the Collection",
    link: "/products",
    accent: "purple"
  }
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-slate-950 group">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-all duration-1000 ease-out transform ${
            idx === current ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none" />
          <BhumiveraVideo
            src={slide.video}
            poster={slide.poster}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
            containerClassName="relative w-full h-full overflow-hidden"
          />
        </div>
      ))}

      <div className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-6 animate-fade-in">
            <Zap size={14} />
            {slides[current].subtitle}
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-6 tracking-tighter">
            {slides[current].title.split(',').map((part, i) => (
              <span key={i} className="block last:text-transparent last:bg-clip-text last:bg-gradient-to-r last:from-emerald-400 last:to-cyan-400">
                {part}
              </span>
            ))}
          </h1>

          <p className="text-xl text-slate-300 mb-10 max-w-xl leading-relaxed font-medium">
            {slides[current].description}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to={slides[current].link}
              className="px-8 py-4 bg-emerald-500 hover:bg-white text-black font-black uppercase tracking-wider rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              <ShoppingBag size={20} />
              {slides[current].cta}
            </Link>
            <button
              type="button"
              onClick={() => navigate('/about')}
              className="px-8 py-4 bg-slate-900/50 hover:bg-slate-800 backdrop-blur-md border border-slate-800 text-white font-black uppercase tracking-wider rounded-2xl transition-all duration-300 flex items-center gap-3"
            >
              <Play size={20} className="fill-current" />
              Explore Our Craft
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 right-12 z-30 flex items-center gap-6">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                i === current ? 'w-12 bg-emerald-500' : 'w-3 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
            className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl text-white hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all duration-300"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
            className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl text-white hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all duration-300"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full z-20 border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-xl py-6 hidden lg:block">
        <div className="container mx-auto px-6 flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-emerald-500" />
            Dedicated Customer Support
          </div>
          <div className="w-px h-4 bg-slate-800" />
          <div className="flex items-center gap-3">
            <Globe size={18} className="text-emerald-500" />
            PAN India Delivery Support
          </div>
          <div className="w-px h-4 bg-slate-800" />
          <div className="flex items-center gap-3">
            <Zap size={18} className="text-emerald-500" />
            Next-Day Dispatch Guaranteed
          </div>
          <div className="w-px h-4 bg-slate-800" />
          <Link to="/about" className="flex items-center gap-3 group/link hover:text-emerald-400 transition-colors">
            Learn More About Our Quality
            <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
