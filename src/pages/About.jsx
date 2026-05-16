import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf, Droplets, Sparkles, ShieldCheck, Heart, Sun, Feather, RefreshCw, Activity, Zap, Terminal, ArrowRight, Briefcase, Mic } from 'lucide-react';

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
        }, 300); // small delay to ensure DOM and animations have painted
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
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-400">Somatic Protocol v2.1</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-9xl font-serif text-white tracking-tight mb-8 drop-shadow-2xl"
          >
            Nature, <span className="italic font-light text-gray-500">Architected.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto tracking-wider leading-relaxed"
          >
            Decoding millennial botanical intelligence to solve modern dermal equations. No synthetics. Just pure molecular power from the soil of Asansol.
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
              REF: BATCH_DNA_ORIGIN
            </div>
            <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-2xl relative">
              <img 
                src="/assets/images/aloeveradna.webp" 
                alt="Biological DNA Origins" 
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
            <motion.h2 variants={fadeInUp} className="text-xs font-bold text-emerald-600 uppercase tracking-[0.4em]">Project Genesis</motion.h2>
            <motion.h3 variants={fadeInUp} className="text-4xl md:text-6xl font-serif text-[#1a1a1a] leading-tight">
              Born from the <span className="italic underline underline-offset-8 decoration-emerald-500/30">Molecular Soil.</span>
            </motion.h3>
            <motion.div variants={fadeInUp} className="space-y-6 text-gray-500 font-light text-lg leading-relaxed">
              <p>
                The journey of Bhumivera began with a rejection of "legacy errors" in skincare. While aisles were flooded with synthetic preservatives that delete the logic of skin vitality, we looked toward the earth's base code.
              </p>
              <p>
                We asked: Why alter what nature has already perfected? Why introduce toxins when the earth offers remedies trusted for millennia? Bhumivera bridges the gap between ancient Ayurvedic wisdom and modern molecular precision.
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
              { icon: <Leaf size={24} />, title: "0% Logic Deletion", desc: "No parabens or sulfates. If it disrupts your skin's biological logic, it is purged." },
              { icon: <Zap size={24} />, title: "Ethical Recursion", desc: "Cruelty-free extraction that respects local ecosystems and communities." },
              { icon: <Activity size={24} />, title: "1,008 HR Cured", desc: "Small-batch soaps cured for 6 weeks to maximize enzymatic vitality." }
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

      {/* 4. MATERIA MEDICA: BOTANICAL MATRIX */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-[0.4em] mb-4">Materia Medica</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-[#1a1a1a] mb-6">The Extraction Heroes</h3>
            <p className="text-gray-500 font-light">Biological data sheets for our primary actives. No fillers. Just authentic botanical efficacy.</p>
          </div>

          <div className="space-y-32">
            {/* --- MULTANI MITTI --- */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="flex flex-col lg:flex-row gap-24 items-center"
            >
              <div className="w-full lg:w-[55%] aspect-square rounded-sm overflow-hidden bg-white shadow-2xl shadow-stone-900/5 relative group border border-stone-100">
                <img 
                  src="/assets/images/multanimittibeaker.webp" 
                  className="w-full h-full object-cover transition-transform duration-[5000ms] ease-out group-hover:scale-110 opacity-95" 
                  alt="Bhumivera Multani Mitti Extraction" 
                />
                <div className="absolute top-8 left-8 font-mono text-[9px] text-stone-900/40 tracking-[0.6em] uppercase vertical-text">Elemental_Purification_v1.0</div>
              </div>

              <div className="w-full lg:w-[45%] space-y-10">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-stone-900/10 text-stone-800 text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm shadow-sm font-mono">
                    <Sun size={14} strokeWidth={1.5} className="text-amber-600" /> Ion_Exchange_Active
                  </div>
                  <h4 className="text-6xl font-serif text-[#1a1a1a] leading-[1.1] tracking-tight">Multani <br /><span className="italic text-stone-500 font-light">Mitti Clay</span></h4>
                  <p className="text-gray-500 leading-relaxed font-light text-xl max-w-md">Harvested from mineral-rich reserves, this ultra-refined clay operates as a molecular magnet, drawing out impurities while preserving your skin's vital barrier.</p>
                </div>
                <div className="relative py-6 border-y border-gray-200/60 text-[#1a1a1a] font-serif italic text-2xl leading-snug">
                  "Purity is not merely the absence of toxins; it is the absolute calibration of earth's rarest elements."
                </div>
                <div className="grid grid-cols-2 gap-16 pt-4">
                  <div className="space-y-2"><span className="block text-[10px] text-stone-700 font-bold uppercase tracking-[0.2em]">Particle Density</span><div className="flex items-baseline gap-1 font-mono"><span className="text-3xl font-light tracking-tighter">0.45</span><span className="text-xs text-gray-400">μm</span></div></div>
                  <div className="space-y-2"><span className="block text-[10px] text-stone-700 font-bold uppercase tracking-[0.2em]">Ionic Charge</span><span className="block text-2xl font-mono font-light tracking-widest uppercase text-amber-700">Cationic+</span></div>
                </div>
              </div>
            </motion.div>

            {/* --- ALOE VERA --- */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="flex flex-col lg:flex-row-reverse gap-24 items-center"
            >
              <div className="w-full lg:w-[55%] aspect-square rounded-sm overflow-hidden bg-white shadow-2xl shadow-emerald-900/5 relative group">
                <img 
                  src="/assets/images/aloeveradrop.webp" 
                  className="w-full h-full object-cover transition-transform duration-[5000ms] ease-out group-hover:scale-110" 
                  alt="Bhumivera Aloe Extraction" 
                />
                <div className="absolute top-8 right-8 font-mono text-[9px] text-emerald-900/30 tracking-[0.6em] uppercase vertical-text">Molecular_Hydration_v2.0</div>
              </div>

              <div className="w-full lg:w-[45%] space-y-10">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-emerald-900/10 text-emerald-800 text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm shadow-sm font-mono">
                    <Droplets size={14} strokeWidth={1.5} className="text-emerald-500" /> Enzymatic_Sync
                  </div>
                  <h4 className="text-6xl font-serif text-[#1a1a1a] leading-[1.1] tracking-tight">Pure Aloe <br /><span className="italic text-emerald-800/90 font-light">Vera Extract</span></h4>
                  <p className="text-gray-500 leading-relaxed font-light text-xl max-w-md">Cold-pressed polysaccharides that accelerate cellular hydration and repair, refined by science to become a masterpiece of self-care.</p>
                </div>
                <div className="relative py-6 border-y border-gray-200/60 text-[#1a1a1a] font-serif italic text-2xl leading-snug">"True luxury is found in the raw intelligence of nature."</div>
                <div className="grid grid-cols-2 gap-16 pt-4">
                  <div className="space-y-2"><span className="block text-[10px] text-emerald-700 font-bold uppercase tracking-[0.2em]">Bio-Vitality</span><div className="flex items-baseline gap-1 font-mono"><span className="text-3xl font-light tracking-tighter">94.00</span><span className="text-xs text-gray-400">/100</span></div></div>
                  <div className="space-y-2"><span className="block text-[10px] text-emerald-700 font-bold uppercase tracking-[0.2em]">Status</span><span className="block text-2xl font-mono font-light tracking-widest uppercase text-emerald-900">Optimized</span></div>
                </div>
              </div>
            </motion.div>
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
            <h3 className="text-3xl font-serif text-[#1e1510] mb-4">Join the Eco-Lab.</h3>
            <p className="text-[#4a3628] font-light leading-relaxed mb-8">
              We are constantly seeking visionary formulators, digital architects, and holistic experts to help us redefine botanical luxury. If you believe in zero-regression ethics and pure formulations, we want to hear from you.
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
              For media inquiries, brand kits, and interview requests regarding our unique approach to Ayurvedic molecular science and e-commerce infrastructure, please contact our relations desk.
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
            <Terminal size={12} /> Root_Log: Founding_Manifesto
          </div>
          <h3 className="text-3xl md:text-5xl font-serif text-white mb-10 leading-tight italic">"We aren't just creating skincare. We are reviving a forgotten dialogue between human skin and the natural world."</h3>
          <div className="w-12 h-0.5 bg-emerald-500 mx-auto mb-8" />
          <p className="text-emerald-400 font-bold uppercase tracking-[0.4em] text-sm mb-2">Akash Prasad</p>
          <p className="text-gray-600 font-light text-[10px] uppercase tracking-widest font-mono">Principal Architect // Bhumivera Eco-Labs</p>
        </div>
      </section>

    </div>
  );
}
