import React, { useEffect, useState } from 'react';
import { Gift, CheckCircle, ArrowRight } from 'lucide-react';

export default function SpinRegistration() {
  const [uniqueId, setUniqueId] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get('id');
    if (idFromUrl) {
      setUniqueId(idFromUrl);
    }
  }, []);

  const handleRegisterForSpin = (e) => {
    e.preventDefault();
    setIsReady(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-white">
      <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600 rounded-full mb-6 shadow-lg shadow-purple-500/50">
          <Gift size={40} className="text-white" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Lucky Spin Entry</h1>
        <p className="text-slate-400 mb-8">Enter your Registration ID to unlock your chance to spin and win exclusive prizes.</p>

        {!isReady ? (
          <form onSubmit={handleRegisterForSpin} className="space-y-6">
            <div>
              <input 
                type="text" 
                value={uniqueId}
                onChange={(e) => setUniqueId(e.target.value)}
                placeholder="Registration ID" 
                required
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-4 text-center text-xl font-mono text-white placeholder-slate-400 focus:border-purple-500 outline-none"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Verify Eligibility <ArrowRight size={20} />
            </button>
          </form>
        ) : (
          <div className="bg-green-500/10 border border-green-500/50 p-6 rounded-2xl">
            <CheckCircle className="text-green-400 mx-auto mb-4" size={48} />
            <h2 className="text-xl font-bold text-green-400 mb-2">Eligibility Confirmed!</h2>
            <p className="text-slate-300">Your ID {uniqueId} is locked in. The spin game interface will be deployed here soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
