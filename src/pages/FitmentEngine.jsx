import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Droplets, ChevronRight, ChevronLeft, Sparkles, CheckCircle, 
  Sun, Wind, ShieldAlert, Cpu, Search, Activity
} from 'lucide-react';

export default function FitmentEngine() {
  const navigate = useNavigate();
  
  // Phase Management
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('');

  // Core Data State (Maps strictly to DB: Make, Model, Year)
  const [skinType, setSkinType] = useState('');
  const [primaryConcern, setPrimaryConcern] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  
  // Extended Profile State (UI/UX Depth)
  const [climate, setClimate] = useState('');
  const [sensitivity, setSensitivity] = useState('');
  const [aiQuery, setAiQuery] = useState('');

  // Data Matrices
  const skinTypes = ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive'];
  const ages = ['Teens', '20s', '30s', '40s', '50s+'];
  const climates = ['Arid / Dry', 'Tropical / Humid', 'Temperate', 'Cold / Freezing', 'High Pollution / Urban'];
  const sensitivities = ['High (Reacts Easily)', 'Moderate', 'Low (Resilient)'];
  
  const aiSuggestions = [
    "I need a routine for severe winter dryness...",
    "Looking for anti-aging with sensitive skin...",
    "Help me clear up hormonal breakouts...",
    "I want to achieve a glass-skin glow..."
  ];

  const [availableConcerns, setAvailableConcerns] = useState([]);

  // Dynamic Concern Routing
  useEffect(() => {
    if (skinType) {
      const concernMatrix = {
        'Normal': ['Hydration', 'Glow', 'Maintenance', 'Anti-Pollution'],
        'Oily': ['Acne Control', 'Pore Minimizing', 'Oil Balancing', 'Blemishes'],
        'Dry': ['Deep Hydration', 'Flakiness', 'Anti-Aging', 'Dullness'],
        'Combination': ['T-Zone Oiliness', 'Uneven Texture', 'Balancing', 'Brightening'],
        'Sensitive': ['Redness', 'Soothing', 'Gentle Cleansing', 'Barrier Repair']
      };
      setAvailableConcerns(concernMatrix[skinType] || []);
      setPrimaryConcern('');
    }
  }, [skinType]);

  const handleNext = () => {
    if (currentStep < 6) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSaveAssessment = () => {
    setIsProcessing(true);
    setCurrentStep(7); // Processing Step

    // Simulated AI Processing Sequence
    const processingStages = [
      "Initializing AI Botanical Engine...",
      "Deep scanning dermal requirements...",
      "Cross-referencing climate variables...",
      "Synthesizing zero-footprint formulation..."
    ];

    let stage = 0;
    const interval = setInterval(() => {
      setProcessingText(processingStages[stage]);
      stage++;
      if (stage >= processingStages.length) {
        clearInterval(interval);
        setTimeout(() => {
          // CRITICAL CONTRACT: Map to automotive backend schema for SQL compatibility
          const assessmentData = { 
            make: skinType, 
            model: primaryConcern, 
            year: ageGroup,
            extended_metrics: { climate, sensitivity, aiQuery }
          };
          
          localStorage.setItem('Bhumivera_garage', JSON.stringify(assessmentData));
          window.dispatchEvent(new Event('storage')); 
          navigate('/shop?fitment=active&engine=ai_optimized');
        }, 1500);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2c2c] font-sans relative overflow-hidden flex flex-col items-center justify-center py-20 px-4">
      
      {/* Glassmorphic Ambient Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#e8dcc4] rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#f4eedc] rounded-full mix-blend-multiply filter blur-[120px] opacity-50"></div>

      <div className="w-full max-w-5xl relative z-10">
        
        {/* Header Module */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex p-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 text-[#8b5a2b] shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-2">
            <Cpu size={32} className="animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif uppercase tracking-[0.15em] text-[#1a1a1a]">
            Bhumivera <span className="text-[#8b5a2b]">Somatic AI</span>
          </h1>
          <p className="text-[#5c4a3d] font-bold uppercase tracking-[0.3em] text-xs">
            Multi-Variable precision mapping for your botanical architecture
          </p>
        </div>

        {/* Glassmorphic Main Container */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_20px_60px_-15px_rgba(139,90,43,0.1)] rounded-[2.5rem] p-8 md:p-14 min-h-[500px] flex flex-col justify-between">
          
          {/* Progress Indicator */}
          {currentStep < 7 && (
            <div className="mb-10">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#8b5a2b]/70 mb-3">
                <span>Phase 0{currentStep}</span>
                <span>06</span>
              </div>
              <div className="w-full bg-[#e8dcc4]/50 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#8b5a2b] h-full transition-all duration-700 ease-in-out"
                  style={{ width: `${(currentStep / 6) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Dynamic Step Content */}
          <div className="flex-grow flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Step 1: AI Search & Intent */}
            {currentStep === 1 && (
              <div className="space-y-8 max-w-2xl mx-auto w-full text-center">
                <h2 className="text-2xl font-serif tracking-widest uppercase text-[#1a1a1a] mb-2">Define Your Protocol</h2>
                <p className="text-[#5c4a3d] text-sm leading-relaxed mb-6">Describe your ultimate skin goals or current challenges. Our AI engine will pre-weight your diagnostic mapping.</p>
                
                <div className="relative group">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-[#8b5a2b]">
                    <Search size={20} />
                  </div>
                  <textarea 
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="E.g., I want to reduce fine lines while dealing with hormonal breakouts..."
                    className="w-full bg-white/80 border-2 border-[#e8dcc4] rounded-3xl py-6 pl-16 pr-6 text-[#2c2c2c] focus:outline-none focus:border-[#8b5a2b] focus:ring-4 focus:ring-[#8b5a2b]/10 transition-all resize-none shadow-inner"
                    rows="3"
                  ></textarea>
                </div>

                <div className="text-left space-y-3 mt-6">
                  <p className="text-[10px] font-bold uppercase text-[#8b5a2b] tracking-[0.2em]">AI Suggestions</p>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.map((suggestion, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setAiQuery(suggestion)}
                        className="text-xs bg-white/50 border border-[#e8dcc4] px-4 py-2 rounded-full text-[#5c4a3d] hover:bg-[#8b5a2b] hover:text-white transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Skin Type (Make) */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-10">
                  <Droplets size={24} className="mx-auto text-[#8b5a2b] mb-4" />
                  <h2 className="text-2xl font-serif tracking-widest uppercase text-[#1a1a1a]">Base Architecture</h2>
                  <p className="text-[#5c4a3d] text-sm mt-2">Select your primary dermal classification.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skinTypes.map(type => (
                    <button 
                      key={type}
                      onClick={() => { setSkinType(type); handleNext(); }}
                      className={`p-6 rounded-3xl border-2 text-center font-bold uppercase tracking-widest text-sm transition-all duration-300 ${
                        skinType === type ? 'bg-[#8b5a2b] text-white border-[#8b5a2b] shadow-lg scale-[1.02]' : 'bg-white/80 border-[#e8dcc4] text-[#2c2c2c] hover:border-[#8b5a2b] hover:shadow-md'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Concern (Model) */}
            {currentStep === 3 && (
              <div className="space-y-6">
                 <div className="text-center mb-10">
                  <Activity size={24} className="mx-auto text-[#8b5a2b] mb-4" />
                  <h2 className="text-2xl font-serif tracking-widest uppercase text-[#1a1a1a]">Target Resolution</h2>
                  <p className="text-[#5c4a3d] text-sm mt-2">Select the primary condition to treat for <span className="font-bold text-[#8b5a2b]">{skinType}</span> skin.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  {availableConcerns.map(c => (
                    <button 
                      key={c}
                      onClick={() => { setPrimaryConcern(c); handleNext(); }}
                      className={`p-6 rounded-3xl border-2 text-center font-bold uppercase tracking-widest text-sm transition-all duration-300 ${
                        primaryConcern === c ? 'bg-[#8b5a2b] text-white border-[#8b5a2b] shadow-lg scale-[1.02]' : 'bg-white/80 border-[#e8dcc4] text-[#2c2c2c] hover:border-[#8b5a2b] hover:shadow-md'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Age Group (Year) */}
            {currentStep === 4 && (
              <div className="space-y-6">
                 <div className="text-center mb-10">
                  <Sparkles size={24} className="mx-auto text-[#8b5a2b] mb-4" />
                  <h2 className="text-2xl font-serif tracking-widest uppercase text-[#1a1a1a]">Chronological Stage</h2>
                  <p className="text-[#5c4a3d] text-sm mt-2">Cellular turnover rates vary. Select your current stage.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {ages.map(y => (
                    <button 
                      key={y}
                      onClick={() => { setAgeGroup(y); handleNext(); }}
                      className={`p-6 rounded-3xl border-2 text-center font-bold uppercase tracking-widest text-sm transition-all duration-300 ${
                        ageGroup === y ? 'bg-[#8b5a2b] text-white border-[#8b5a2b] shadow-lg scale-[1.02]' : 'bg-white/80 border-[#e8dcc4] text-[#2c2c2c] hover:border-[#8b5a2b] hover:shadow-md'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Climate */}
            {currentStep === 5 && (
              <div className="space-y-6">
                 <div className="text-center mb-10">
                  <Wind size={24} className="mx-auto text-[#8b5a2b] mb-4" />
                  <h2 className="text-2xl font-serif tracking-widest uppercase text-[#1a1a1a]">Environmental Variables</h2>
                  <p className="text-[#5c4a3d] text-sm mt-2">External factors drastically alter formulation efficacy.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {climates.map(env => (
                    <button 
                      key={env}
                      onClick={() => { setClimate(env); handleNext(); }}
                      className={`p-6 rounded-3xl border-2 text-center font-bold uppercase tracking-widest text-sm transition-all duration-300 ${
                        climate === env ? 'bg-[#8b5a2b] text-white border-[#8b5a2b] shadow-lg scale-[1.02]' : 'bg-white/80 border-[#e8dcc4] text-[#2c2c2c] hover:border-[#8b5a2b] hover:shadow-md'
                      }`}
                    >
                      {env}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Sensitivity */}
            {currentStep === 6 && (
              <div className="space-y-6">
                 <div className="text-center mb-10">
                  <ShieldAlert size={24} className="mx-auto text-[#8b5a2b] mb-4" />
                  <h2 className="text-2xl font-serif tracking-widest uppercase text-[#1a1a1a]">Barrier Resilience</h2>
                  <p className="text-[#5c4a3d] text-sm mt-2">Establish potency limits for active botanical ingredients.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sensitivities.map(sense => (
                    <button 
                      key={sense}
                      onClick={() => setSensitivity(sense)}
                      className={`p-6 rounded-3xl border-2 text-center font-bold uppercase tracking-widest text-sm transition-all duration-300 ${
                        sensitivity === sense ? 'bg-[#8b5a2b] text-white border-[#8b5a2b] shadow-lg scale-[1.02]' : 'bg-white/80 border-[#e8dcc4] text-[#2c2c2c] hover:border-[#8b5a2b] hover:shadow-md'
                      }`}
                    >
                      {sense}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 7: Processing Matrix */}
            {currentStep === 7 && (
              <div className="flex flex-col items-center justify-center space-y-8 py-10">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-[#e8dcc4] border-t-[#8b5a2b] rounded-full animate-spin"></div>
                  <Cpu size={40} className="text-[#8b5a2b] animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-bold uppercase tracking-widest text-[#1a1a1a]">Processing Matrix</h2>
                  <p className="text-[#8b5a2b] font-mono text-sm tracking-wider animate-pulse">{processingText}</p>
                </div>
              </div>
            )}

          </div>

          {/* Navigation Controls */}
          {currentStep < 7 && (
            <div className="mt-12 flex justify-between items-center border-t border-[#e8dcc4]/50 pt-6">
              <button 
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-full transition-all ${
                  currentStep === 1 ? 'opacity-30 cursor-not-allowed text-[#a3a3a3]' : 'text-[#8b5a2b] hover:bg-[#8b5a2b]/10'
                }`}
              >
                <ChevronLeft size={16} /> Revert
              </button>
              
              {currentStep === 6 ? (
                <button 
                  onClick={handleSaveAssessment}
                  disabled={!sensitivity}
                  className={`flex items-center gap-2 font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full transition-all shadow-lg ${
                    sensitivity ? 'bg-[#8b5a2b] text-white hover:bg-[#1a1a1a] hover:scale-105' : 'bg-[#e8dcc4] text-[#a3a3a3] cursor-not-allowed'
                  }`}
                >
                  Engage Engine <Sparkles size={16} className="ml-1" />
                </button>
              ) : (
                <button 
                  onClick={handleNext}
                  disabled={
                    (currentStep === 2 && !skinType) || 
                    (currentStep === 3 && !primaryConcern) || 
                    (currentStep === 4 && !ageGroup) ||
                    (currentStep === 5 && !climate)
                  }
                  className={`flex items-center gap-2 font-bold uppercase tracking-widest text-xs px-8 py-3 rounded-full transition-all ${
                    ((currentStep === 2 && skinType) || 
                     (currentStep === 3 && primaryConcern) || 
                     (currentStep === 4 && ageGroup) ||
                     (currentStep === 5 && climate) || 
                     currentStep === 1)
                    ? 'bg-[#1a1a1a] text-white hover:bg-[#8b5a2b] shadow-md' : 'bg-[#e8dcc4] text-[#a3a3a3] cursor-not-allowed'
                  }`}
                >
                  Proceed <ChevronRight size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
