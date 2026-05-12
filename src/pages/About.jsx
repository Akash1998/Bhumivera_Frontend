import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf, Droplets, Sparkles, ShieldCheck, Heart, Sun, Feather, RefreshCw, Activity, Zap, Terminal } from 'lucide-react';

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
                src="/assets/images/aloeveradna.jpg" 
                alt="Biological DNA Origins" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
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
                Bhumivera was founded on a simple realization: modern skincare has lost its way. We returned to the base code of nature to bridge the gap between ancient Ayurvedic wisdom and modern molecular precision.
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
          <div className="space-y-32">
            {/* Multani Mitti */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="w-full lg:w-1/2 aspect-square rounded-sm overflow-hidden bg-gray-100 relative group">
                <img src="/assets/images/multanimittibeaker.webp" className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-110 transition-transform duration-[3000ms]" alt="Multani Mitti" />
                <div className="absolute top-4 left-4 font-mono text-[8px] text-black/40 tracking-[0.5em] uppercase">Element: Earth_Mineral</div>
              </div>
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-600/10 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full font-mono"><Sun size={12} /> ION_EXCHANGE_ACTIVE</div>
                <h4 className="text-4xl font-serif text-[#1a1a1a]">Multani Mitti</h4>
                <p className="text-gray-500 leading-relaxed font-light text-lg">Finely milled clay that acts as a magnetic adsorber for deep environmental toxins.</p>
                <div className="flex gap-10 mt-8 border-t border-gray-100 pt-8">
                   <div><span className="block text-[8px] text-emerald-600 font-bold uppercase tracking-widest mb-1">Density</span><span className="text-sm font-mono font-bold">98.4 μm</span></div>
                   <div><span className="block text-[8px] text-emerald-600 font-bold uppercase tracking-widest mb-1">Rate</span><span className="text-sm font-mono font-bold">CAT+</span></div>
                </div>
              </div>
            </motion.div>

            {/* Aloe Vera */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex flex-col lg:flex-row-reverse gap-16 items-center">
              <div className="w-full lg:w-1/2 aspect-square rounded-sm overflow-hidden bg-emerald-50 relative group">
                <img src="/assets/images/aloeveradrop.webp" className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-[3000ms]" alt="Aloe Vera" />
                <div className="absolute top-4 right-4 font-mono text-[8px] text-emerald-900/40 tracking-[0.5em] uppercase">Element: Bio_Fluid</div>
              </div>
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-600/10 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full font-mono"><Droplets size={12} /> ENZYMATIC_SYNC</div>
                <h4 className="text-4xl font-serif text-[#1a1a1a]">Pure Aloe Extract</h4>
                <p className="text-gray-500 leading-relaxed font-light text-lg">Cold-pressed polysaccharides that accelerate cellular hydration and repair.</p>
                <div className="flex gap-10 mt-8 border-t border-gray-100 pt-8">
                   <div><span className="block text-[8px] text-emerald-600 font-bold uppercase tracking-widest mb-1">Bio-Index</span><span className="text-sm font-mono font-bold">94/100</span></div>
                   <div><span className="block text-[8px] text-emerald-600 font-bold uppercase tracking-widest mb-1">Status</span><span className="text-sm font-mono font-bold">OPTIMIZED</span></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. FOUNDER'S NOTE: THE MANIFESTO (Visual Logic Fix) */}
      <section className="relative py-48 bg-[#0a0a0a] overflow-hidden">
        {/* Background Layer (Image 1) */}
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
          <h3 className="text-3xl md:text-5xl font-serif text-white mb-10 leading-tight italic">
            "We aren't just creating skincare. We are reviving a forgotten dialogue between human skin and the natural world."
          </h3>
          <div className="w-12 h-0.5 bg-emerald-500 mx-auto mb-8" />
          <p className="text-emerald-400 font-bold uppercase tracking-[0.4em] text-sm mb-2">Akash Prasad</p>
          <p className="text-gray-600 font-light text-[10px] uppercase tracking-widest font-mono">Principal Architect // Bhumivera Eco-Labs</p>
        </div>
      </section>

      {/* 6. CALL TO ACTION: INITIALIZATION (Full Frame Fix) */}
      <section className="relative py-60 px-6 bg-white overflow-hidden">
        {/* Background Layer (Image 2) */}
        <div className="absolute inset-0 z-0 opacity-10">
          <img 
            src="/assets/images/transformationcta.webp" 
            alt="Transformation CTA Background" 
            className="w-full h-full object-cover"
          />
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-5xl mx-auto text-center relative z-10">
          <ShieldCheck size={48} className="text-emerald-600 mx-auto mb-8" />
          <h2 className="text-4xl md:text-6xl font-serif text-[#1a1a1a] mb-8 tracking-tighter">Ready to Synchronize?</h2>
          <p className="text-lg text-gray-500 font-light max-w-2xl mx-auto mb-12 leading-relaxed italic">
            "Begin your botanical transformation with a batch audited for molecular purity. Experience the difference of true clinical luxury."
          </p>
          <motion.a 
            href="/shop" 
            whileHover={{ scale: 1.05, backgroundColor: "#0a0a0a" }}
            whileTap={{ scale: 0.98 }}
            className="inline-block px-12 py-5 bg-emerald-700 text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-full shadow-2xl transition-all duration-500"
          >
            Initialize Transformation
          </motion.a>
        </motion.div>
      </section>

    </div>
  );
}
