import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, ChevronRight, Sparkles, CheckCircle } from 'lucide-react';
import api from '../services/api';

export default function FitmentEngine() {
  // Underlying state variables renamed for clarity, but the final output saves to the exact same DB keys.
  const [skinTypes, setSkinTypes] = useState(['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive']);
  const [selectedType, setSelectedType] = useState('');
  const [selectedConcern, setSelectedConcern] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  
  const [concerns, setConcerns] = useState([]);
  const [ages, setAges] = useState(['Teens', '20s', '30s', '40s', '50s+']);
  const navigate = useNavigate();

  const handleTypeChange = (type) => {
    setSelectedType(type);
    
    // Dynamically adjust concerns based on skin type (mimicking the old Make/Model logic)
    const mockConcerns = {
      'Normal': ['Hydration', 'Glow', 'Maintenance', 'Anti-Pollution'],
      'Oily': ['Acne Control', 'Pore Minimizing', 'Oil Balancing', 'Blemishes'],
      'Dry': ['Deep Hydration', 'Flakiness', 'Anti-Aging', 'Dullness'],
      'Combination': ['T-Zone Oiliness', 'Uneven Texture', 'Balancing', 'Brightening'],
      'Sensitive': ['Redness', 'Soothing', 'Gentle Cleansing', 'Barrier Repair']
    };
    setConcerns(mockConcerns[type] || []);
    setSelectedConcern('');
  };

  const handleSaveAssessment = () => {
    if (selectedType && selectedConcern && selectedAge) {
      // CRITICAL: We retain the exact keys "make", "model", "year" and "Bhumivera_garage" 
      // so the underlying database and Shop filters continue to work seamlessly.
      const assessmentData = { make: selectedType, model: selectedConcern, year: selectedAge };
      localStorage.setItem('Bhumivera_garage', JSON.stringify(assessmentData));
      window.dispatchEvent(new Event('storage')); 
      navigate('/shop?fitment=active');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2c2c] font-sans py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-6">
          <div className="inline-flex p-5 bg-[#f4eedc] rounded-full border border-[#e8dcc4] text-[#8b5a2b] mb-4 shadow-sm">
            <Sparkles size={40} />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif uppercase tracking-widest leading-tight text-[#1a1a1a]">
            Personalized <br /> <span className="text-[#8b5a2b]">Skin Profile</span>
          </h1>
          <p className="text-[#5c4a3d] font-bold uppercase tracking-[0.3em] text-xs">
            Analyze your skin to discover your perfect botanical regimen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Skin Type */}
           <div className="space-y-4">
             <label className="text-[10px] font-bold uppercase text-[#8b5a2b] tracking-[0.2em] px-2 flex items-center gap-2">
               <Droplets size={12}/> 01 Skin Type
             </label>
             <div className="grid grid-cols-1 gap-3">
               {skinTypes.map(type => (
                 <button 
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`p-5 rounded-2xl border text-left font-bold uppercase tracking-widest text-sm transition-all shadow-sm ${
                    selectedType === type ? 'bg-[#8b5a2b] text-white border-[#8b5a2b]' : 'bg-white border-[#e8dcc4] text-[#2c2c2c] hover:border-[#8b5a2b] hover:bg-[#f4eedc]'
                  }`}
                 >
                   {type}
                 </button>
               ))}
             </div>
           </div>

           {/* Primary Concern */}
           <div className="space-y-4">
             <label className="text-[10px] font-bold uppercase text-[#8b5a2b] tracking-[0.2em] px-2 flex items-center gap-2">
               <Droplets size={12}/> 02 Primary Concern
             </label>
             <div className="grid grid-cols-1 gap-3">
               {concerns.length > 0 ? concerns.map(c => (
                 <button 
                  key={c}
                  onClick={() => setSelectedConcern(c)}
                  className={`p-5 rounded-2xl border text-left font-bold uppercase tracking-widest text-sm transition-all shadow-sm ${
                    selectedConcern === c ? 'bg-[#8b5a2b] text-white border-[#8b5a2b]' : 'bg-white border-[#e8dcc4] text-[#2c2c2c] hover:border-[#8b5a2b] hover:bg-[#f4eedc]'
                  }`}
                 >
                   {c}
                 </button>
               )) : (
                 <div className="p-8 text-center text-[#8b5a2b]/50 border border-dashed border-[#e8dcc4] bg-white/50 rounded-2xl font-bold uppercase text-[10px] tracking-widest">
                   Select Skin Type First
                 </div>
               )}
             </div>
           </div>

           {/* Age Group */}
           <div className="space-y-4">
             <label className="text-[10px] font-bold uppercase text-[#8b5a2b] tracking-[0.2em] px-2 flex items-center gap-2">
               <Droplets size={12}/> 03 Age Group
             </label>
             <div className="grid grid-cols-1 gap-3">
               {selectedConcern ? ages.map(y => (
                 <button 
                  key={y}
                  onClick={() => setSelectedAge(y)}
                  className={`p-5 rounded-2xl border text-left font-bold uppercase tracking-widest text-sm transition-all shadow-sm ${
                    selectedAge === y ? 'bg-[#8b5a2b] text-white border-[#8b5a2b]' : 'bg-white border-[#e8dcc4] text-[#2c2c2c] hover:border-[#8b5a2b] hover:bg-[#f4eedc]'
                  }`}
                 >
                   {y}
                 </button>
               )) : (
                 <div className="p-8 text-center text-[#8b5a2b]/50 border border-dashed border-[#e8dcc4] bg-white/50 rounded-2xl font-bold uppercase text-[10px] tracking-widest">
                   Select Concern First
                 </div>
               )}
             </div>
           </div>
        </div>

        {selectedAge && (
          <div className="pt-12 flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="flex items-center space-x-4 bg-[#f4eedc] px-8 py-3 rounded-full border border-[#e8dcc4]">
               <CheckCircle size={18} className="text-[#8b5a2b]" />
               <span className="font-bold uppercase tracking-widest text-xs text-[#8b5a2b]">Profile Analyzed</span>
            </div>
            <button 
              onClick={handleSaveAssessment}
              className="px-16 py-6 bg-[#8b5a2b] text-white font-bold text-xl uppercase tracking-widest rounded-full hover:bg-[#1a1a1a] hover:scale-105 transition-all shadow-xl"
            >
              Generate My Regimen <ChevronRight className="inline ml-2" size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
