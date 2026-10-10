import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf, Droplets, Sparkles, ShieldCheck, Heart, Feather, RefreshCw, Activity, Zap, Terminal, ArrowRight, Briefcase, Mic } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function About() {
  const { scrollYProgress } = useScroll();
  const yPos = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const location = useLocation();

  // Scroll to hash logic for footer links
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300); // small delay to ensure DOM
      }
    }
  }, [location]);

  return (
    <div className="bg-[#faf8f5] text-[#2c2c2c] font-sans selection:bg-emerald-500/30 selection:text-white overflow-hidden">
      
      {/* 1. HERO SECTION: BOTANICAL AUTHORITY */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
        <motion.div 
          style={{ y: yPos }}
          className="absolute inset-0 z-0 opacity-40"
        >
          <img 
            src="/assets/images/aloeverascience.webp" 
            alt="Bhumivera Botanical Science" 
            className="w-full h-full object-cover mix-blend-luminosity scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/80" />
        </motion.div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-20">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md mb-8"
          >
            <Sparkles size={14} className="text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-400">A considered point of view</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-9xl font-serif text-white tracking-tight mb-8 drop-shadow-2xl"
          >
            Care, <span className="italic font-light text-gray-500">with context.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto tracking-wider leading-relaxed"
          >
            We are curious about the living world and the ingredients used in everyday care. Our aim is to make room for botanical inspiration, clear product information and considered choices.
          </motion.p>
        </div>
      </section>

      {/* 2. OUR STORY: THE GENESIS */}
      <section className="py-32 px-6 relative bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="relative group"
          >
            <div className="absolute -top-4 -left-4 font-mono text-[8px] text-emerald-600 tracking-[0.5em] uppercase z-20 bg-white px-2 py-1">
              A STORY GROUNDED IN NATURE
            </div>
            <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-2xl relative">
              <img 
                src="/assets/images/aloeveradna.webp" 
                alt="A close study of a botanical leaf"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                onError={(e) => { e.target.src = '/logo.webp'; }}
              />
              <div className="absolute inset-0 bg-emerald-950/10 mix-blend-overlay group-hover:opacity-0 transition-opacity" />
            </div>
          </motion.div>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="space-y-8"
          >
            <motion.h2 variants={fadeInUp} className="text-xs font-bold text-emerald-600 uppercase tracking-[0.4em]">Our point of view</motion.h2>
            <motion.h3 variants={fadeInUp} className="text-4xl md:text-6xl font-serif text-[#1a1a1a] leading-tight">
              Inspired by the <span className="italic underline underline-offset-8 decoration-emerald-500/30">living world.</span>
            </motion.h3>
            <motion.div variants={fadeInUp} className="space-y-6 text-gray-500 font-light text-lg leading-relaxed">
              <p>
                Bhumivera began with curiosity about how everyday care can feel more considered. The natural world offers a rich source of botanical forms, textures and stories worth exploring.
              </p>
              <p>
                We pair that curiosity with respect for the details: what an individual product contains, how it is described and the information someone needs to make a choice that suits them.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. PHILOSOPHY: DEEP OBSIDIAN SHIFT */}
      <section className="py-32 bg-[#050505] text-white relative px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-24">
            <h2 className="text-xs font-bold text-emerald-500 uppercase tracking-[0.4em] mb-4">Core Constraints</h2>
            <h3 className="text-4xl md:text-5xl font-serif">The Bhumivera Standard</h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Leaf size={24} />, title: "Product-specific clarity", desc: "Ingredient information and directions should be checked on the page and packaging for the individual product." },
              { icon: <Zap size={24} />, title: "Botanical context", desc: "Plant names can invite curiosity; they do not, on their own, tell the full story of a finished formula." },
              { icon: <Activity size={24} />, title: "Considered choices", desc: "We aim to describe products with care and leave room for different preferences and individual needs." }
            ].map((pillar, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="bg-[#0d0d0d] p-10 rounded-sm border border-white/5 hover:border-emerald-500/40 transition-all group">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-8 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                  {pillar.icon}
                </div>
                <h4 className="text-sm font-bold uppercase tracking-widest mb-4 font-mono text-emerald-400">{pillar.title}</h4>
                <p className="text-gray-500 text-sm font-light leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#dccfb8] bg-[#f6f0e4] px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end md:gap-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-700">Botanicals, with context</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-[#1e2921] sm:text-4xl">A plant can inspire a story. A product deserves its own facts.</h2>
          </div>
          <div>
            <p className="max-w-2xl text-sm leading-7 text-[#4a574a] sm:text-base">
              We are building a clearer way to explore botanical names and product information. Ingredient presence and directions vary by item, so check the individual product page and packaging before choosing.
            </p>
            <Link to="/science" className="mt-6 inline-flex min-h-11 items-center gap-2 border-b border-[#536b4d]/40 pb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#354933]">
              Explore botanical science <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CAREERS & PRESS (TARGET ANCHORS) */}
      <section className="py-32 px-6 bg-[#ebe1d1] border-y border-[#dccfb8]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* CAREERS SECTION */}
          <div id="careers" className="bg-[#f6f0e4] p-12 rounded-sm border border-[#dccfb8] shadow-sm scroll-mt-32">
            <div className="w-16 h-16 bg-[#6b4226] text-[#f6f0e4] flex items-center justify-center rounded-full mb-8">
              <Briefcase size={28} />
            </div>
            <h3 className="text-3xl font-serif text-[#1e1510] mb-4">Work with us.</h3>
            <p className="text-[#4a3628] font-light leading-relaxed mb-8">
              We welcome thoughtful formulators, digital specialists and creative collaborators who care about clear information and considered product experiences.
            </p>
            <a href="mailto:careers@bhumivera.com" className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b4226] hover:text-[#1e1510] transition-colors">
              View Open Roles <ArrowRight size={14} />
            </a>
          </div>

          {/* PRESS SECTION */}
          <div id="press" className="bg-[#f6f0e4] p-12 rounded-sm border border-[#dccfb8] shadow-sm scroll-mt-32">
            <div className="w-16 h-16 bg-[#1e1510] text-[#f6f0e4] flex items-center justify-center rounded-full mb-8">
              <Mic size={28} />
            </div>
            <h3 className="text-3xl font-serif text-[#1e1510] mb-4">Press & Media.</h3>
            <p className="text-[#4a3628] font-light leading-relaxed mb-8">
              For media inquiries, brand information and interview requests, please contact our team.
            </p>
            <a href="mailto:press@bhumivera.com" className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b4226] hover:text-[#1e1510] transition-colors">
              Download Media Kit <ArrowRight size={14} />
            </a>
          </div>

        </div>
      </section>

      {/* 6. FOUNDER'S NOTE: THE MANIFESTO */}
      <section className="relative py-48 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/images/foundermanifesto.webp" 
            alt="Founder Manifesto Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
        </div>
        <div className="max-w-4xl mx-auto relative z-10 text-center px-6">
          <div className="inline-flex items-center gap-2 mb-12 text-[10px] font-mono text-emerald-500 tracking-[0.4em] uppercase border-b border-emerald-500/20 pb-2">
            <Terminal size={12} /> A note from our founder
          </div>
          <h3 className="text-3xl md:text-5xl font-serif text-white mb-10 leading-tight italic">"Bhumivera began with curiosity about the natural world and how it can inspire more considered everyday care."</h3>
          <div className="w-12 h-0.5 bg-emerald-500 mx-auto mb-8" />
          <p className="text-emerald-400 font-bold uppercase tracking-[0.4em] text-sm mb-2">Akash Prasad</p>
          <p className="text-gray-600 font-light text-[10px] uppercase tracking-widest font-mono">Founder, Bhumivera</p>
        </div>
      </section>

    </div>
  );
}
