import React from 'react';
import { motion } from 'framer-motion';
import { 
  Beaker, 
  Leaf, 
  Droplets, 
  ShieldCheck, 
  Cpu, 
  Microscope, 
  Atom, 
  ArrowRight 
} from 'lucide-react';

const BhumiveraScience = () => {
  // Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30">
      
      {/* SECTION 01: HERO ARCHITECTURE */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-900/20 blur-[120px] rounded-full"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-mono tracking-widest mb-6">
              PROTOCOL V.1.0 // BOTANICAL INTELLIGENCE
            </span>
            <h1 className="text-6xl md:text-8xl font-light tracking-tighter mb-8 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent italic">
              Bhumivera Science
            </h1>
            <p className="max-w-2xl mx-auto text-gray-400 text-lg leading-relaxed mb-10">
              "Nature is a relentless architect; her designs are perfected over millennia. Our role is not to improve upon them, but to decode them for the modern world."
            </p>
            <div className="flex justify-center gap-4">
              <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-black transition-all rounded-sm font-bold tracking-widest text-xs uppercase flex items-center gap-2">
                Explore Lab Data <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Hero Image (aloeverascience) - 100% Fit */}
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-[#0a0a0a] to-transparent z-20"></div>
        <img 
          src="/assets/images/aloeverascience.webp" 
          alt="Bhumivera Botanical Science" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity"
        />
      </section>

      {/* SECTION 02: THE ALOE ALGORITHM (Bio-Code) */}
      <section className="py-32 bg-[#0d0d0d] relative border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch">
            <motion.div {...fadeInUp} className="flex flex-col justify-center">
              <h2 className="text-4xl font-light mb-8 flex items-center gap-4">
                <Leaf className="text-emerald-500" /> 01. The Aloe Algorithm
              </h2>
              <div className="space-y-6 text-gray-400 leading-relaxed">
                <p>
                  At the molecular core of our formula is the <span className="text-white italic">Aloe Barbadensis Miller</span>. 
                  Most brands treat Aloe as a marketing buzzword; we treat it as a biological data center. 
                  Our extraction process focuses on preserving **Acemannan**, a long-chain polysaccharide that acts as the "logic" for skin cell communication.
                </p>
                <blockquote className="pl-6 border-l-2 border-emerald-500 italic py-2 text-white">
                  "In the lab, as in the garden, patience is the ultimate catalyst for potency."
                </blockquote>
                <ul className="grid grid-cols-2 gap-4 pt-4">
                  <li className="flex items-center gap-2 text-sm border border-white/10 p-3 rounded-sm">
                    <Droplets className="text-emerald-500" size={16} /> 99% Bio-Active
                  </li>
                  <li className="flex items-center gap-2 text-sm border border-white/10 p-3 rounded-sm">
                    <ShieldCheck className="text-emerald-500" size={16} /> pH Balanced (5.5)
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Beaker Image (aloeverabeaker) - 100% Fit */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group min-h-[500px]"
            >
              <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] group-hover:bg-emerald-500/20 transition-all z-0"></div>
              <img 
                src="/assets/images/aloeverabeaker.webp" 
                alt="Botanical Laboratory Extraction" 
                className="absolute inset-0 w-full h-full object-cover rounded-sm border border-white/10 opacity-80 hover:opacity-100 transition-all duration-700 shadow-2xl mix-blend-lighten z-10"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 03: THE MINERAL LOGIC (Multani Mitti Adsorption) */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <motion.h2 {...fadeInUp} className="text-4xl font-light mb-4">02. Mineral Adsorption Logic</motion.h2>
            <motion.p {...fadeInUp} className="text-gray-500 max-w-xl mx-auto italic">
              "Mapping the lattice structure of Multani Mitti to solve the equation of environmental toxicity."
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -10 }} className="p-8 bg-[#111] border border-white/5 rounded-sm hover:border-emerald-500/40 transition-all group">
              <div className="mb-6 p-4 w-fit bg-emerald-500/10 rounded-full group-hover:bg-emerald-500 group-hover:text-black transition-all">
                <Atom size={32} />
              </div>
              <h3 className="text-xl mb-4">Ion Exchange</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Multani Mitti creates a negative ionic charge that naturally attracts positively charged toxins, pulling them from deep within the dermal layers.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="p-8 bg-[#111] border border-white/5 rounded-sm hover:border-emerald-500/40 transition-all group">
              <div className="mb-6 p-4 w-fit bg-emerald-500/10 rounded-full group-hover:bg-emerald-500 group-hover:text-black transition-all">
                <Cpu size={32} />
              </div>
              <h3 className="text-xl mb-4">Thermal Regulation</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Our mineral structure facilitates a natural heat exchange, cooling inflamed skin and counteracting the "digital stress" caused by screens.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="p-8 bg-[#111] border border-white/5 rounded-sm hover:border-emerald-500/40 transition-all group">
              <div className="mb-6 p-4 w-fit bg-emerald-500/10 rounded-full group-hover:bg-emerald-500 group-hover:text-black transition-all">
                <Microscope size={32} />
              </div>
              <h3 className="text-xl mb-4">Lattice Precision</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                The crystalline lattice of Bhumivera minerals is processed to a specific micron size, ensuring maximum surface area for detoxifying efficacy.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 04: THE COLD-PROCESS SOP (Technical Visualization) */}
      <section className="py-32 bg-white text-black relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-stretch">
            <div className="lg:w-1/2 flex flex-col justify-center">
              <span className="text-emerald-600 font-mono text-sm tracking-widest block mb-4">SOP 104 // MANUFACTURING LOGIC</span>
              <h2 className="text-5xl font-light tracking-tight mb-8">Zero Logic Deletion. <br />Zero Heat Damage.</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                In software architecture, logic deletion causes system failure. In skincare, <span className="font-bold">Heat Deletion</span> causes nutrient failure. Traditional soaps use high-heat milling that destroys delicate vitamins. 
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-100 border-l-4 border-emerald-600">
                  <div className="font-mono font-bold text-emerald-600 italic">01. AMBIENT INTAKE</div>
                  <p className="text-sm text-gray-600 italic">Ingredients are blended at exactly 27°C (80.6°F) to maintain enzymatic integrity.</p>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-100 border-l-4 border-emerald-600">
                  <div className="font-mono font-bold text-emerald-600 italic">02. 6-WEEK COMPILATION</div>
                  <p className="text-sm text-gray-600 italic">Every Bhumivera bar "cures" for 1,008 hours, allowing the crystalline structure to solidify naturally.</p>
                </div>
              </div>
            </div>
            
            {/* Multani Mitti Image (multanimitti) - 100% Fit Full Column */}
            <div className="lg:w-1/2 relative min-h-[600px] rounded-sm overflow-hidden shadow-2xl">
              <img 
                src="/assets/images/multanimitti.webp" 
                alt="Multani Mitti Mineral Curing" 
                className="absolute inset-0 w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05: DATA & ANALYTICS (The Spec Table) */}
      <section className="py-32 bg-[#0a0a0a]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-light mb-12 text-center flex items-center justify-center gap-4">
              <Beaker className="text-emerald-500" /> Bio-Active Inventory Spec
            </h2>
            <div className="overflow-x-auto border border-white/10 rounded-sm">
              <table className="w-full text-left font-mono text-sm">
                <thead className="bg-[#111] text-gray-400">
                  <tr>
                    <th className="p-6">COMPONENT</th>
                    <th className="p-6">BIO-FUNCTION</th>
                    <th className="p-6">VALUE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-emerald-500/5 transition-colors">
                    <td className="p-6 font-bold text-emerald-400 italic">"Lignins"</td>
                    <td className="p-6 text-gray-400">Dermal Penetration Logic</td>
                    <td className="p-6">HIGH (98%)</td>
                  </tr>
                  <tr className="hover:bg-emerald-500/5 transition-colors">
                    <td className="p-6 font-bold text-emerald-400 italic">"Saponins"</td>
                    <td className="p-6 text-gray-400">Natural Antiseptic/Surfactant</td>
                    <td className="p-6">9.2mg/g</td>
                  </tr>
                  <tr className="hover:bg-emerald-500/5 transition-colors">
                    <td className="p-6 font-bold text-emerald-400 italic">"Acemannan"</td>
                    <td className="p-6 text-gray-400">Immune Response Trigger</td>
                    <td className="p-6">OPTIMIZED</td>
                  </tr>
                  <tr className="hover:bg-emerald-500/5 transition-colors">
                    <td className="p-6 font-bold text-emerald-400 italic">"Amino Acids"</td>
                    <td className="p-6 text-gray-400">Structural Cell Repair</td>
                    <td className="p-6">18 PHASES</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 06: GLOBAL COMMITMENT */}
      <section className="py-32 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl font-light mb-8 italic">"Purity is not a goal, it is a constraint."</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
              Every Bhumivera product is "Clean Code" for the environment. 0% Micro-plastics. 100% Biodegradable Logic. Sourced locally in Asansol, engineered for the global stage.
            </p>
            <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40">
              <span className="font-mono text-xs uppercase tracking-[0.3em]">Vegan Certified</span>
              <span className="font-mono text-xs uppercase tracking-[0.3em]">Cruelty Free</span>
              <span className="font-mono text-xs uppercase tracking-[0.3em]">Zero Waste Packaging</span>
              <span className="font-mono text-xs uppercase tracking-[0.3em]">Paraben 0%</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <footer className="py-20 bg-[#050505] text-center border-t border-white/5">
        <div className="container mx-auto px-6">
          <h3 className="text-2xl mb-6">Ready to upgrade your skincare architecture?</h3>
          <button className="px-10 py-4 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all font-bold tracking-widest uppercase text-xs">
            Shop the Science
          </button>
        </div>
      </footer>
    </div>
  );
};

export default BhumiveraScience;
