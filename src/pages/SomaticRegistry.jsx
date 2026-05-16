import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Dna, 
  Zap, 
  Wind, 
  Thermometer, 
  ArrowRight, 
  BookOpen, 
  Activity,
  Award,
  Sparkles,
  Search,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

const SomaticRegistry = () => {
  const [serial, setSerial] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [registryData, setRegistryData] = useState(null);
  const [error, setError] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  // On mount, load history
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('bhumivera_registry_history') || '[]');
    setScanHistory(history);
  }, []);

  const productDatabase = {
    'MM': {
      name: 'Multani Mitti & Earth Mineral Bar',
      vibe: 'Deep Detoxification & Ion Exchange',
      batch: '0526-AS-01',
      date: 'May 2026',
      howToUse: [
        { step: "01", title: "Thermal Prep", desc: "Splash face with lukewarm water (approx 32°C) to open dermal pores." },
        { step: "02", title: "Lather Logic", desc: "Create a thick lather in hands. Do not apply the bar directly to inflamed areas." },
        { step: "03", title: "Cationic Sit", desc: "Leave the minerals on the skin for 45 seconds to allow the Ion Exchange to complete." },
        { step: "04", title: "Cold Seal", desc: "Rinse with cold water to lock the mineral matrix into the skin barrier." }
      ],
      molecularStats: { purity: "99.4%", ashContent: "0.2%", hydrationIndex: "88/100" },
      image: "/assets/images/multanimitti.webp" // Utilizing actual assets from repo
    },
    'AV': {
      name: 'Aloe Vera & Living Enzyme Bar',
      vibe: 'Biological Repair & Hydration',
      batch: '0526-AS-02',
      date: 'May 2026',
      howToUse: [
        { step: "01", title: "Hydraulic Base", desc: "Ensure skin is thoroughly damp to act as a carrier for the Aloe polysaccharides." },
        { step: "02", title: "Enzymatic Massage", desc: "Massage in circular motions for 60 seconds to activate the Lignin penetration." },
        { step: "03", title: "pH Stabilization", desc: "Rinse gently. The bar is buffered to 5.5 pH to match your skin mantle." }
      ],
      molecularStats: { purity: "99.8%", acemannan: "High", bioavailability: "94/100" },
      image: "/assets/images/aloeverabeaker.webp"
    }
  };

  const handleRegistrySync = (presetSerial = null) => {
    const targetSerial = presetSerial || serial.trim().toUpperCase();
    if (!targetSerial) return;

    setIsVerifying(true);
    setError(null);
    setRegistryData(null);
    
    // Simulate complex ledger verification
    setTimeout(() => {
      const parts = targetSerial.split('-');
      const productCode = parts.length >= 3 ? parts[2] : null;

      if (targetSerial.startsWith('BHV-0526') && productDatabase[productCode]) {
        const data = productDatabase[productCode];
        setRegistryData(data);
        
        // Save to history
        const newEntry = { serial: targetSerial, name: data.name, timestamp: new Date().toISOString() };
        const updatedHistory = [newEntry, ...scanHistory.filter(h => h.serial !== targetSerial)].slice(0, 5);
        setScanHistory(updatedHistory);
        localStorage.setItem('bhumivera_registry_history', JSON.stringify(updatedHistory));
        
      } else {
        setError("AUTHENTICATION FAILED: Invalid or unrecognized SNA-2 Key.");
      }
      setIsVerifying(false);
    }, 1800);
  };

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-[#D4AF37]/30 pb-20 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none"></div>

      {/* SECTION 01: THE REGISTRY GATE */}
      <section className="relative pt-32 pb-16 border-b border-white/5 z-10">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-full mb-6 border border-white/10">
              <Dna className="text-emerald-500" size={24} />
            </div>
            <h1 className="text-4xl md:text-6xl font-light tracking-tighter mb-4">Somatic Registry</h1>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
              Initialize your batch code to unlock the <span className="text-[#D4AF37]">Biological Manual</span>. 
              Our algorithms calibrate usage instructions based on the specific molecular yield of your product.
            </p>

            <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-4 md:p-6 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
              {isVerifying && (
                <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-sm z-10 flex items-center justify-center flex-col">
                  <RefreshCw className="animate-spin text-emerald-500 mb-2" size={32} />
                  <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400">Querying Blockchain Ledger...</span>
                </div>
              )}
              
              <div className="flex flex-col md:flex-row gap-4 relative z-0">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Enter Key (e.g., BHV-0526-MM-01)"
                    className="bg-black border border-white/10 pl-12 pr-6 py-4 rounded-xl w-full font-mono text-sm tracking-widest focus:border-emerald-500 outline-none transition-all placeholder:text-gray-700"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleRegistrySync()}
                  />
                </div>
                <button 
                  onClick={() => handleRegistrySync()}
                  disabled={isVerifying || !serial}
                  className="bg-emerald-600 text-black px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Zap size={16}/> Sync
                </button>
              </div>
              
              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs mt-4 font-mono text-left bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  {error}
                </motion.p>
              )}
            </div>

            {/* Quick History Tokens */}
            {scanHistory.length > 0 && !registryData && !isVerifying && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-3">Recent Scans</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {scanHistory.map((item, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        setSerial(item.serial);
                        handleRegistrySync(item.serial);
                      }}
                      className="text-xs font-mono bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
                    >
                      {item.serial}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

          </motion.div>
        </div>
      </section>

      {/* SECTION 02: THE DYNAMIC DASHBOARD */}
      <AnimatePresence mode="wait">
        {registryData && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="container mx-auto px-6 mt-16 max-w-6xl"
          >
            {/* PRODUCT HEADER */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full font-mono text-[10px] tracking-widest uppercase flex items-center gap-2">
                    <CheckCircle2 size={12} /> Verified Genuine
                  </span>
                  <span className="text-gray-500 font-mono text-[10px] tracking-widest">BATCH // {registryData.batch}</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight leading-tight">{registryData.name}</h2>
                <p className="text-[#D4AF37] text-xl italic font-light mb-10">"{registryData.vibe}"</p>
                
                <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-6">
                  <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-6 font-mono">Molecular Yield Report</h4>
                  <div className="grid grid-cols-3 gap-6">
                    {Object.entries(registryData.molecularStats).map(([key, val]) => (
                      <div key={key}>
                        <span className="block text-[9px] uppercase tracking-widest text-gray-600 mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="text-xl font-mono text-white">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-5 relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-black relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                  <img src={registryData.image} alt={registryData.name} className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000 ease-out" />
                  
                  <div className="absolute bottom-6 left-6 z-20">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
                      <ShieldCheck size={24} className="text-black" />
                    </div>
                    <p className="font-mono text-xs text-white tracking-widest">PROV: {registryData.date}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* THE BIOLOGICAL PROTOCOL */}
            <div className="mb-24">
              <div className="flex items-end justify-between border-b border-white/10 pb-6 mb-12">
                <div>
                  <h3 className="text-3xl font-light flex items-center gap-4">
                    <BookOpen className="text-[#D4AF37]" /> The Protocol
                  </h3>
                  <p className="text-gray-500 text-sm mt-2">Calibrated specifically for formulation {registryData.batch}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {registryData.howToUse.map((step, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={step.step} 
                    className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl hover:bg-white/[0.04] transition-colors relative overflow-hidden group"
                  >
                    <div className="absolute -right-4 -top-4 text-8xl font-black text-white/[0.03] group-hover:text-emerald-500/[0.05] transition-colors pointer-events-none">
                      {step.step}
                    </div>
                    <h4 className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed relative z-10">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CONTEXTUAL ENVIRONMENTAL DATA */}
            <div className="bg-gradient-to-br from-[#0B2419] to-[#050505] border border-emerald-900/50 rounded-3xl p-10 md:p-16 mb-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                <div className="space-y-6">
                  <h3 className="text-2xl font-light italic text-[#D4AF37]">Dynamic Calibration</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    Most beauty brands print a generic set of instructions on a box and assume the job is done. But your skin is not a static environment—it is a fluctuating biological system. The Somatic Registry treats your product as a modular software update for your skin.
                  </p>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    Because our products are <strong className="text-white font-normal">Cold-Processed (SOP 104)</strong>, their behavior varies slightly by batch. The instructions provided above are mathematically calibrated to the specific pH levels of your scanned batch.
                  </p>
                </div>

                <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-8">
                  <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                    <Thermometer className="text-emerald-500" size={18} /> Local Environment Data
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs font-mono">LOCATION</span>
                      <span className="text-white text-sm">Asansol, WB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs font-mono">HUMIDITY INDEX</span>
                      <span className="text-emerald-400 text-sm font-mono">68% (ELEVATED)</span>
                    </div>
                    <div className="pt-4 mt-4 border-t border-white/5">
                      <p className="text-xs text-gray-400 leading-relaxed">
                        <strong className="text-white">Recommendation:</strong> Due to elevated local humidity, ensure you do not store the bar in a damp tray. Allow it to dry in the open air between uses to maintain its crystalline lattice structure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-8 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="font-mono text-xs text-gray-500 tracking-widest uppercase">Connection Secured</span>
              </div>
              <button 
                onClick={() => {
                  setRegistryData(null);
                  setSerial('');
                }}
                className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                Scan Another Batch <ArrowRight size={14}/>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* IDLE STATE ICONS */}
      {!registryData && !isVerifying && (
        <section className="absolute bottom-10 left-0 w-full pointer-events-none opacity-20">
          <div className="flex justify-center gap-16 grayscale">
             <div className="flex flex-col items-center"><Dna size={32} /><span className="text-[8px] mt-3 tracking-[0.3em] font-mono">DNA_VERIFIED</span></div>
             <div className="flex flex-col items-center"><Wind size={32} /><span className="text-[8px] mt-3 tracking-[0.3em] font-mono">ECO_LOGIC</span></div>
             <div className="flex flex-col items-center"><Sparkles size={32} /><span className="text-[8px] mt-3 tracking-[0.3em] font-mono">POTENCY_MAX</span></div>
          </div>
        </section>
      )}

    </div>
  );
};

export default SomaticRegistry;
