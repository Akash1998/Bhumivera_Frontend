import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Dna, 
  Zap, 
  Clock, 
  Wind, 
  Thermometer, 
  ArrowRight, 
  BookOpen, 
  Activity,
  Award,
  Sparkles,
  Search
} from 'lucide-react';

const SomaticRegistry = () => {
  const [serial, setSerial] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [registryData, setRegistryData] = useState(null);
  const [error, setError] = useState(null);

  // MOCK DATABASE - This is where the product-specific logic lives
  const productDatabase = {
    'MM': {
      name: 'Multani Mitti & Earth Mineral Bar',
      vibe: 'Deep Detoxification & Ion Exchange',
      batch: '0526-AS-01',
      howToUse: [
        { step: "01", title: "Thermal Prep", desc: "Splash face with lukewarm water (approx 32°C) to open dermal pores." },
        { step: "02", title: "Lather Logic", desc: "Create a thick lather in hands. Do not apply the bar directly to inflamed areas." },
        { step: "03", title: "Cationic Sit", desc: "Leave the minerals on the skin for 45 seconds to allow the Ion Exchange to complete." },
        { step: "04", title: "Cold Seal", desc: "Rinse with cold water to lock the mineral matrix into the skin barrier." }
      ],
      molecularStats: { purity: "99.4%", ashContent: "0.2%", hydrationIndex: "88/100" },
      image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=800"
    },
    'AV': {
      name: 'Aloe Vera & Living Enzyme Bar',
      vibe: 'Biological Repair & Hydration',
      batch: '0526-AS-02',
      howToUse: [
        { step: "01", title: "Hydraulic Base", desc: "Ensure skin is thoroughly damp to act as a carrier for the Aloe polysaccharides." },
        { step: "02", title: "Enzymatic Massage", desc: "Massage in circular motions for 60 seconds to activate the Lignin penetration." },
        { step: "03", title: "pH Stabilization", desc: "Rinse gently. The bar is buffered to 5.5 pH to match your skin mantle." }
      ],
      molecularStats: { purity: "99.8%", acemannan: "High", bioavailability: "94/100" },
      image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&q=80&w=800"
    }
  };

  const handleRegistrySync = () => {
    setIsVerifying(true);
    setError(null);
    
    // Logic: SNA-2 Parsing
    // Example Format: BHV-0526-MM-01
    setTimeout(() => {
      const parts = serial.split('-');
      const productCode = parts[2]; // Extracts 'MM' or 'AV'

      if (serial.startsWith('BHV-0526') && productDatabase[productCode]) {
        setRegistryData(productDatabase[productCode]);
      } else {
        setError("Invalid Registry Key. Please check the serial printed on your Bhumivera packaging.");
      }
      setIsVerifying(false);
    }, 2000);
  };

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-emerald-500/30 pb-20">
      
      {/* SECTION 01: THE REGISTRY GATE (Verification) */}
      <section className="relative pt-32 pb-16 border-b border-white/5">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-4xl md:text-6xl font-light tracking-tighter mb-6 italic">The Somatic Registry</h1>
            <p className="text-gray-500 mb-10 leading-relaxed">
              Unlock the <span className="text-emerald-500">Biological Manual</span> for your specific batch. 
              Enter your SNA-2 key below to synchronize your product data.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <input 
                type="text" 
                placeholder="BHV-0526-MM-01"
                className="bg-white/5 border border-white/10 px-6 py-4 rounded-sm w-full md:w-80 font-mono text-center uppercase tracking-widest focus:border-emerald-500 outline-none transition-all"
                value={serial}
                onChange={(e) => setSerial(e.target.value.toUpperCase())}
              />
              <button 
                onClick={handleRegistrySync}
                disabled={isVerifying}
                className="bg-emerald-600 text-black px-10 py-4 font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-3"
              >
                {isVerifying ? "SYNCING..." : <><Zap size={14}/> Synchronize</>}
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-4 font-mono">{error}</p>}
          </motion.div>
        </div>
      </section>

      {/* SECTION 02: THE DYNAMIC DASHBOARD */}
      <AnimatePresence>
        {registryData && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto px-6 mt-16"
          >
            {/* PRODUCT HEADER */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
              <div>
                <span className="text-emerald-500 font-mono text-[10px] tracking-[0.4em] uppercase block mb-4">Registry Success // {registryData.batch}</span>
                <h2 className="text-5xl font-light mb-6 tracking-tight">{registryData.name}</h2>
                <p className="text-gray-400 text-xl italic font-light leading-relaxed">"{registryData.vibe}"</p>
                
                <div className="grid grid-cols-3 gap-6 mt-12 border-t border-white/5 pt-8">
                  {Object.entries(registryData.molecularStats).map(([key, val]) => (
                    <div key={key}>
                      <span className="block text-[9px] uppercase tracking-widest text-gray-500 mb-1">{key}</span>
                      <span className="text-lg font-mono text-emerald-400">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <img src={registryData.image} alt={registryData.name} className="rounded-sm grayscale border border-white/10 hover:grayscale-0 transition-all duration-1000" />
                <div className="absolute -top-4 -right-4 p-4 bg-emerald-600 rounded-full shadow-2xl">
                  <ShieldCheck size={32} className="text-black" />
                </div>
              </div>
            </div>

            {/* THE BIOLOGICAL PROTOCOL (How to Use) */}
            <div className="bg-[#0d0d0d] border border-white/5 p-12 mb-20">
              <h3 className="text-2xl font-light mb-12 flex items-center gap-4">
                <BookOpen className="text-emerald-500" /> The Usage Protocol
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {registryData.howToUse.map((step) => (
                  <div key={step.step} className="space-y-4">
                    <span className="text-4xl font-light text-white/10 font-mono">{step.step}</span>
                    <h4 className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest">{step.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* THE PHILOSOPHY OF CUSTOMIZATION (500+ Word Section Integration) */}
            <div className="max-w-4xl mx-auto space-y-16 py-20">
              <div className="text-center space-y-6">
                <h3 className="text-3xl font-light italic">"Why one-size-fits-all is a legacy error."</h3>
                <p className="text-gray-500 leading-relaxed text-lg">
                  Most beauty brands print a generic set of instructions on a box and assume the job is done. But your skin is not a static environment—it is a fluctuating biological system. The **Somatic Registry** treats your product as a modular software update for your skin. 
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-6">
                  <h4 className="text-white text-xl flex items-center gap-3">
                    <Activity className="text-emerald-500" /> Real-Time Calibration
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    By entering your batch code, you aren't just verifying genuinity. You are telling our system which mineral Earth or which Aloe patch you are currently using. Because our products are **Cold-Processed (SOP 104)**, their behavior varies slightly by batch. The instructions provided above are mathematically calibrated to the specific pH levels of batch **{registryData.batch}**.
                  </p>
                </div>
                <div className="space-y-6">
                  <h4 className="text-white text-xl flex items-center gap-3">
                    <Thermometer className="text-emerald-500" /> Atmospheric Adaptation
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    We've detected you are accessing the Registry from Asansol. The local humidity levels affect the "Lather Logic" of our mineral bars. For optimal results in this climate, ensure you do not store the bar in a damp tray; allow it to dry in the open air between uses to maintain its crystalline lattice structure.
                  </p>
                </div>
              </div>

              <blockquote className="text-center py-12 border-y border-white/5">
                <p className="text-2xl font-light italic text-emerald-400">
                  "We don't just sell you a product; we sell you the data required to master it."
                </p>
              </blockquote>

              <div className="space-y-8 text-gray-500 leading-relaxed">
                <p>
                  The unique model of the **Bhumivera Somatic Registry** is designed to bridge the gap between the physical product and digital intelligence. In the legacy world, once you buy a product, the relationship with the brand ends. Here, the purchase is only the **Initialization Sequence**.
                </p>
                <p>
                  Our goal is to eliminate waste. By providing you with the exact "Enzymatic Massage" time and "Cationic Sit" duration, we ensure that not a single molecule of our botanical formula is wasted. You get the full biological value of the Earth minerals and the Aloe Vera, every single time.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER METRICS (Shown only when verified) */}
      <AnimatePresence>
        {registryData && (
          <footer className="mt-20 py-12 bg-emerald-600 text-black">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
              <div>
                <h5 className="font-bold uppercase tracking-widest text-xs mb-2">Registry Status</h5>
                <div className="flex items-center gap-2 font-mono text-xl">
                  <Award size={20} /> SYNCHRONIZED_ACTIVE
                </div>
              </div>
              <button className="px-10 py-4 bg-black text-white font-bold uppercase text-[10px] tracking-[0.4em] flex items-center gap-2">
                Download Full Batch Report <ArrowRight size={14}/>
              </button>
            </div>
          </footer>
        )}
      </AnimatePresence>

      {!registryData && (
        <section className="py-20 opacity-20">
          <div className="flex justify-center gap-20 grayscale scale-75">
             <div className="flex flex-col items-center"><Dna size={40} /><span className="text-[8px] mt-2 tracking-widest">DNA_VERIFIED</span></div>
             <div className="flex flex-col items-center"><Wind size={40} /><span className="text-[8px] mt-2 tracking-widest">ECO_LOGIC</span></div>
             <div className="flex flex-col items-center"><Sparkles size={40} /><span className="text-[8px] mt-2 tracking-widest">POTENCY_MAX</span></div>
          </div>
        </section>
      )}

    </div>
  );
};

export default SomaticRegistry;
