import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf, Droplets, Sparkles, ShieldCheck, Heart, Sun, Feather, RefreshCw } from 'lucide-react';

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
  const yPos = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="bg-[#faf8f5] text-[#2c2c2c] font-sans selection:bg-[#8b5a2b] selection:text-white overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-[#1a1a1a]">
        <motion.div 
          style={{ y: yPos }}
          className="absolute inset-0 z-0 opacity-40"
        >
          <img 
            src="/assets/images/pomelli_creative_image_9_16_0422.png" 
            alt="Bhumivera Earth Background" 
            className="w-full h-full object-cover mix-blend-luminosity"
            onError={(e) => { e.target.src = '/logo.webp'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-[#1a1a1a]/50" />
        </motion.div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-20">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#8b5a2b]/30 bg-[#1a1a1a]/50 backdrop-blur-md mb-8"
          >
            <Sparkles size={14} className="text-[#8b5a2b]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#e8dcc4]">100% Earth-Derived</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-8xl font-serif text-[#f4eedc] tracking-wide mb-8 drop-shadow-2xl"
          >
            Return to Nature.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-2xl text-[#e8dcc4] font-light max-w-3xl mx-auto tracking-wider leading-relaxed"
          >
            We believe that the earth provides everything the skin needs to heal, glow, and thrive. No compromises. No synthetics. Just pure botanical power.
          </motion.p>
        </div>
      </section>

      {/* 2. OUR STORY */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl"
          >
            <img 
              src="/assets/images/SOAP_AD (11).png" 
              alt="Bhumivera Origin" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2000ms]"
              onError={(e) => { e.target.src = '/logo.webp'; }}
            />
            <div className="absolute inset-0 border border-[#8b5a2b]/20 rounded-2xl pointer-events-none" />
          </motion.div>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="space-y-8"
          >
            <motion.h2 variants={fadeInUp} className="text-xs font-bold text-[#8b5a2b] uppercase tracking-[0.4em]">Genesis</motion.h2>
            <motion.h3 variants={fadeInUp} className="text-4xl md:text-6xl font-serif text-[#1a1a1a] leading-tight">
              Born from the Soil.
            </motion.h3>
            <motion.div variants={fadeInUp} className="w-16 h-0.5 bg-[#8b5a2b]" />
            <motion.div variants={fadeInUp} className="space-y-6 text-[#5c4a3d] font-light text-lg leading-relaxed">
              <p>
                The journey of Bhumivera began with a simple, yet profound realization: modern skincare has lost its way. Aisles are flooded with synthetic chemicals, artificial fragrances, and harsh preservatives that strip the skin of its natural vitality. 
              </p>
              <p>
                We asked ourselves: Why alter what nature has already perfected? Why introduce toxins when the earth offers remedies that have been trusted for millennia?
              </p>
              <p>
                Bhumivera was established to bridge the gap between ancient Ayurvedic wisdom and modern self-care rituals. We scour the finest soils to source therapeutic-grade Multani Mitti, and cultivate the most resilient Aloe Vera to extract pure, unadulterated hydration. Every bar of soap, every formulation, is a testament to the uncompromising purity of the natural world.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. THE PHILOSOPHY / PILLARS */}
      <section className="py-32 bg-[#1a1a1a] text-[#f4eedc] relative px-6 border-y border-[#8b5a2b]/30">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center mb-24"
          >
            <h2 className="text-xs font-bold text-[#8b5a2b] uppercase tracking-[0.4em] mb-4">Our Ethos</h2>
            <h3 className="text-4xl md:text-5xl font-serif">The Bhumivera Standard</h3>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {[
              {
                icon: <Leaf size={32} />,
                title: "100% Plant & Earth Sourced",
                desc: "If it doesn't come from the earth, it doesn't go into our products. We strictly formulate without parabens, sulfates, silicones, or artificial dyes."
              },
              {
                icon: <Feather size={32} />,
                title: "Cruelty-Free & Ethical",
                desc: "Compassion is at our core. We never test on animals, and we ensure our botanical harvesting processes respect local ecosystems and communities."
              },
              {
                icon: <RefreshCw size={32} />,
                title: "Small-Batch Handcrafted",
                desc: "Mass production dilutes quality. Our soaps and treatments are crafted in small, controlled batches to ensure maximum potency and freshness of the active ingredients."
              }
            ].map((pillar, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="bg-[#2a2a2a] p-10 rounded-3xl border border-[#8b5a2b]/20 hover:border-[#8b5a2b]/60 transition-colors">
                <div className="w-16 h-16 bg-[#8b5a2b]/10 rounded-full flex items-center justify-center text-[#8b5a2b] mb-8">
                  {pillar.icon}
                </div>
                <h4 className="text-xl font-bold uppercase tracking-wider mb-4">{pillar.title}</h4>
                <p className="text-gray-400 font-light leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. CORE INGREDIENTS SPOTLIGHT */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center mb-24 max-w-3xl mx-auto"
          >
            <h2 className="text-xs font-bold text-[#8b5a2b] uppercase tracking-[0.4em] mb-4">Materia Medica</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-[#1a1a1a] mb-6">The Heroes of Our Formulations</h3>
            <p className="text-[#5c4a3d] font-light text-lg">We don't believe in filler ingredients. Every single element in a Bhumivera product serves a specific, therapeutic purpose for your skin.</p>
          </motion.div>

          <div className="space-y-24">
            {/* Multani Mitti */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
              className="flex flex-col md:flex-row gap-12 items-center bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-[#e8dcc4]"
            >
              <div className="w-full md:w-1/2 aspect-square rounded-[2rem] overflow-hidden bg-[#faf8f5]">
                <img src="/assets/images/SOAP_AD (8).png" className="w-full h-full object-cover mix-blend-multiply opacity-90" alt="Multani Mitti" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8b5a2b]/10 text-[#8b5a2b] text-[10px] font-bold uppercase tracking-widest rounded-full">
                  <Sun size={12} /> Earth Element
                </div>
                <h4 className="text-3xl md:text-4xl font-serif text-[#1a1a1a]">Multani Mitti (Fuller's Earth)</h4>
                <p className="text-[#5c4a3d] leading-relaxed font-light">
                  A miracle clay revered in Indian skincare for centuries. Highly porous and mineral-rich, our finely milled Multani Mitti acts as a magnetic exfoliator. It draws out deep-seated impurities, excess sebum, and environmental toxins without stripping the skin's natural lipid barrier. The result is a visibly refined pore structure and a clarified, luminous complexion.
                </p>
              </div>
            </motion.div>

            {/* Aloe Vera */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
              className="flex flex-col md:flex-row-reverse gap-12 items-center bg-[#f4eedc] p-8 md:p-12 rounded-[3rem] shadow-xl border border-[#e8dcc4]"
            >
              <div className="w-full md:w-1/2 aspect-square rounded-[2rem] overflow-hidden bg-white">
                <img src="/assets/images/SOAP_AD (13).png" className="w-full h-full object-cover mix-blend-multiply opacity-90" alt="Aloe Vera" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4a6b4a]/10 text-[#4a6b4a] text-[10px] font-bold uppercase tracking-widest rounded-full">
                  <Droplets size={12} /> Water Element
                </div>
                <h4 className="text-3xl md:text-4xl font-serif text-[#1a1a1a]">Pure Aloe Vera Extract</h4>
                <p className="text-[#5c4a3d] leading-relaxed font-light">
                  Known as the "Plant of Immortality," our cold-pressed Aloe Vera retains its full spectrum of vitamins, enzymes, and amino acids. It provides profound, multi-layer cellular hydration. Its intense soothing properties dramatically reduce inflammation, accelerate micro-healing, and leave the skin feeling extraordinarily supple and calm.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. FOUNDER'S NOTE */}
      <section className="py-24 bg-[#1a1a1a] text-center px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#8b5a2b] opacity-10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <Heart size={40} className="text-[#8b5a2b] mx-auto mb-8 opacity-50" />
          <h3 className="text-3xl md:text-5xl font-serif text-[#f4eedc] mb-10 leading-tight">
            "We aren't just creating skincare. We are reviving a forgotten dialogue between human skin and the natural world."
          </h3>
          <div className="w-12 h-0.5 bg-[#8b5a2b] mx-auto mb-8" />
          <p className="text-[#e8dcc4] font-bold uppercase tracking-[0.3em] text-sm mb-2">Akash Prasad</p>
          <p className="text-gray-500 font-light text-xs uppercase tracking-widest">Founder, Bhumivera</p>
        </div>
      </section>

      {/* 6. OUR PROMISE CTA */}
      <section className="py-32 px-6">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="max-w-5xl mx-auto text-center"
        >
          <ShieldCheck size={48} className="text-[#8b5a2b] mx-auto mb-8" />
          <h2 className="text-4xl md:text-5xl font-serif text-[#1a1a1a] mb-8">The Bhumivera Promise</h2>
          <p className="text-lg text-[#5c4a3d] font-light max-w-2xl mx-auto mb-12 leading-relaxed">
            Every product that reaches your hands has been audited, tested, and crafted with an obsessive attention to purity. We promise to never compromise on the integrity of our ingredients. Experience the difference of true botanical luxury.
          </p>
          <a href="/shop" className="inline-block px-12 py-5 bg-[#8b5a2b] text-white font-bold uppercase tracking-[0.2em] text-xs rounded-full hover:bg-[#1a1a1a] transition-all duration-300 shadow-xl hover:-translate-y-1">
            Explore the Collection
          </a>
        </motion.div>
      </section>

    </div>
  );
}
