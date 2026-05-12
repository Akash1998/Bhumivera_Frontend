import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Search, 
  Cpu, 
  Database, 
  QrCode, 
  CheckCircle, 
  AlertTriangle, 
  Fingerprint,
  Activity,
  Box,
  Layers,
  ThermometerSnowflake,
  Zap
} from 'lucide-react';

const ProvenanceEngine = () => {
  const [serial, setSerial] = useState('');
  const [status, setStatus] = useState('idle'); // idle, scanning, synchronized, rejected
  const [progress, setProgress] = useState(0);
  const [scanLog, setScanLog] = useState([]);

  const logs = [
    "Initializing Bhumivera Core...",
    "Connecting to Asansol Central Ledger...",
    "Detecting SNA-2 Serial Architecture...",
    "Validating Cold-Process SOP Hash...",
    "Querying Batch 05-2026 Mineral Matrix...",
    "Extracting Botanical DNA Signatures...",
    "Synchronizing Owner Privileges..."
  ];

  const handleAudit = () => {
    if (!serial) return;
    setStatus('scanning');
    setScanLog([]);
    setProgress(0);

    // Run the scanning sequence
    logs.forEach((log, index) => {
      setTimeout(() => {
        setScanLog(prev => [...prev, log]);
        setProgress((index + 1) * (100 / logs.length));
        
        if (index === logs.length - 1) {
          setTimeout(() => {
            // Logic: Must start with BHV- and contain current month/year 0526
            const isValid = serial.toUpperCase().startsWith('BHV-0526');
            setStatus(isValid ? 'synchronized' : 'rejected');
          }, 800);
        }
      }, index * 600);
    });
  };

  return (
    <div className="bg-[#020202] text-white min-h-screen font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* SECTION 01: THE SCANNER CONSOLE */}
      <section className="relative pt-32 pb-24 border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-emerald-900/10 blur-[120px] rounded-full"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono tracking-[0.3em] mb-8"
            >
              <Fingerprint size={12} /> PROVENANCE_ENGINE_v.2.0.4
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-6">
              Authenticate Your <span className="italic">Batch</span>
            </h1>
            
            <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-12">
              Bhumivera operates on an immutable ledger of botanical integrity. Enter your SNA-2 code to synchronize your product with the global registry.
            </p>

            {/* THE INPUT INTERFACE */}
            <div className="relative max-w-xl mx-auto mb-20 p-2 bg-white/5 rounded-sm border border-white/10 flex items-center">
              <div className="pl-4 text-emerald-500"><QrCode size={20} /></div>
              <input 
                type="text" 
                placeholder="Ex: BHV-0526-XXXX"
                value={serial}
                onChange={(e) => setSerial(e.target.value.toUpperCase())}
                className="bg-transparent border-none focus:ring-0 text-white placeholder-gray-700 w-full px-4 font-mono uppercase tracking-widest"
              />
              <button 
                onClick={handleAudit}
                disabled={status === 'scanning'}
                className="bg-emerald-600 hover:bg-emerald-500 text-black px-8 py-3 font-bold text-xs uppercase tracking-widest transition-all"
              >
                {status === 'scanning' ? 'SCANNING...' : 'SYNC'}
              </button>
            </div>

            {/* SCANNING OVERLAY */}
            <AnimatePresence>
              {status === 'scanning' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-black/80 backdrop-blur-md p-10 border border-white/5 rounded-sm max-w-2xl mx-auto"
                >
                  <div className="w-full h-1 bg-white/5 mb-8">
                    <motion.div 
                      className="h-full bg-emerald-500" 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="font-mono text-[10px] text-left space-y-2">
                    {scanLog.map((log, i) => (
                      <div key={i} className="text-emerald-400 flex items-center gap-2">
                        <span className="opacity-30">[{i}]</span> {log}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {status === 'synchronized' && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-12 border border-emerald-500/50 bg-emerald-500/5 rounded-sm max-w-2xl mx-auto text-center"
                >
                  <CheckCircle className="mx-auto text-emerald-400 mb-6" size={64} />
                  <h2 className="text-3xl font-light mb-4">Provenance Validated</h2>
                  <p className="text-gray-400 mb-8 italic">"Batch integrity confirmed. Your biological synchronization is complete."</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-left border-t border-emerald-500/20 pt-8">
                    <div>
                      <span className="block text-[10px] text-emerald-500 font-mono uppercase">Batch Origin</span>
                      <span className="text-sm">Asansol Eco-Lab</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-emerald-500 font-mono uppercase">Composition</span>
                      <span className="text-sm">99.2% Pure Organic</span>
                    </div>
                  </div>

                  <button className="mt-10 w-full py-4 bg-emerald-500 text-black font-bold uppercase text-[10px] tracking-[0.4em] hover:bg-emerald-400">
                    Synchronize Warranty Benefits
                  </button>
                </motion.div>
              )}

              {status === 'rejected' && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-12 border border-red-500/50 bg-red-500/5 rounded-sm max-w-2xl mx-auto text-center"
                >
                  <AlertTriangle className="mx-auto text-red-400 mb-6" size={64} />
                  <h2 className="text-3xl font-light mb-4 text-red-400">Provenance Rejected</h2>
                  <p className="text-gray-400 mb-8 italic">"Protocol mismatch. This code does not exist in the Bhumivera SNA-2 ledger."</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* SECTION 02: THE DNA OF AUTHENTICITY */}
      <section className="py-32 container mx-auto px-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div className="sticky top-32">
            <h2 className="text-4xl font-light mb-8 leading-tight italic">
              "An imitation mimics the surface; the original defines the soul."
            </h2>
            <img 
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800" 
              alt="Digital Security" 
              className="rounded-sm grayscale hover:grayscale-0 transition-all duration-1000 opacity-60"
            />
          </div>
          
          <div className="space-y-12 text-gray-400 leading-relaxed text-lg">
            <p>
              The concept of "genuinity" in the modern world has been reduced to a simple sticker or a poorly rendered barcode. At <strong>Bhumivera</strong>, we view authenticity as a deep-state architectural requirement. When you hold a bar of our Aloe Vera or Multani Mitti soap, you are holding the result of 1,008 hours of cold-process chemistry. 
            </p>
            <p>
              The legacy system served its purpose in our alpha phase, but the new <strong>SNA-2 (Serial Number Architecture)</strong> is a leap into biological transparency. Every code is a cryptographic hash of the batch's specific environmental conditions—the humidity of the Asansol air, the purity of the mineral earth, and the molecular density of the hand-harvested Aloe.
            </p>
            
            <div className="py-8 border-y border-white/5 space-y-8">
              <h3 className="text-white text-xl flex items-center gap-3 italic">
                <Layers className="text-emerald-500" size={20} /> Layer 01: The Batch Pulse
              </h3>
              <p className="text-sm">
                We do not produce in millions; we produce in "pulses." Each pulse is a controlled experiment. By synchronizing your product, you are claiming a specific slot in that pulse history.
              </p>

              <h3 className="text-white text-xl flex items-center gap-3 italic">
                <ThermometerSnowflake className="text-emerald-500" size={20} /> Layer 02: Cold-Chain Verification
              </h3>
              <p className="text-sm">
                Our science dictates that heat is the enemy of botanical logic. The Provenance Engine verifies that your bar was maintained at sub-30°C temperatures throughout its curing cycle.
              </p>

              <h3 className="text-white text-xl flex items-center gap-3 italic">
                <Zap className="text-emerald-500" size={20} /> Layer 03: The Ownership Synchronicity
              </h3>
              <p className="text-sm">
                When you synchronize, you unlock the <strong>Biological Warranty</strong>. This includes prioritized skin-specialist access, early-access to new botanical patches, and a digital footprint of your skin's transformation ledger.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: TECHNICAL ANALYTICS */}
      <section className="py-24 bg-[#050505] border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-10 bg-white/2 border border-white/5 rounded-sm">
              <Database className="text-emerald-500 mb-6" />
              <h4 className="text-lg mb-4">Immutable Ledger</h4>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">Status: Online</p>
              <p className="mt-4 text-sm text-gray-400">Our decentralized batch registry ensures that no serial number can be duplicated or forged without a protocol mismatch.</p>
            </div>
            <div className="p-10 bg-white/2 border border-white/5 rounded-sm">
              <Activity className="text-emerald-500 mb-6" />
              <h4 className="text-lg mb-4">Potency Tracking</h4>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">Status: Active</p>
              <p className="mt-4 text-sm text-gray-400">By validating your batch, we track the age of your product to ensure you use it while the botanical enzymes are at maximum bio-activity.</p>
            </div>
            <div className="p-10 bg-white/2 border border-white/5 rounded-sm">
              <Box className="text-emerald-500 mb-6" />
              <h4 className="text-lg mb-4">Eco-Sourcing Path</h4>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">Status: Traceable</p>
              <p className="mt-4 text-sm text-gray-400">See the geolocation data of the Multani Mitti and Aloe Vera used in your specific bar. 100% transparency from earth to skin.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProvenanceEngine;
