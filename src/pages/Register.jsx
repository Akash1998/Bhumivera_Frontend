import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Lock, Mail, AlertTriangle, User, 
  Key, CheckCircle2 
} from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { useAuth } from '../context/AuthContext';

const viewVariants = {
  initial: { opacity: 0, x: 30, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, x: -30, scale: 0.95, transition: { duration: 0.3, ease: "easeIn" } }
};

export default function Register() {
  const { register, verifyEmail } = useAuth();
  const navigate = useNavigate();

  // 1. Create the Ref for the Turnstile widget
  const turnstileRef = useRef(null);

  const [view, setView] = useState('INIT');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', securityAnswer: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');

  const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAAADBENLaxaG5Y9r6D";

  const getPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length > 7) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score; 
  };

  const strength = getPasswordStrength(formData.password);
  // Using Earth-tones for the strength meter to match "Materia Medica" vibe
  const strengthColors = ['bg-[#e8dcc4]', 'bg-red-400', 'bg-amber-400', 'bg-emerald-400', 'bg-[#8b5a2b]'];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    if (value !== '' && index < 5) otpRefs.current[index + 1].focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleRegisterInit = async (e) => {
    e.preventDefault();

    if (!turnstileToken) return setError('Please complete the botanical identity verification.');
    if (strength < 2) return setError("Please choose a more secure master key (stronger password).");
    if (!formData.securityAnswer) return setError("Security answer is required for account protection.");

    setLoading(true); 
    setError('');
    
    try {
      await register({ ...formData, turnstileToken }); 
      setView('OTP');
      setSuccessMsg(`Verification token dispatched to ${formData.email}`);
    } catch (err) {
      setError(err.message || 'Registration sequence failed');
      
      // 2. THE FIX: Reset token and widget on failure
      setTurnstileToken('');
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }

    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) return setError("Please enter the 6-digit sequence.");
    
    setLoading(true); 
    setError('');
    
    try {
      await verifyEmail({ 
        email: formData.email, 
        otp: otpString, 
        securityAnswer: formData.securityAnswer 
      });
      setSuccessMsg("Identity verified. Initializing your Bhumivera profile...");
      setTimeout(() => navigate('/profile', { replace: true }), 1500);
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 relative overflow-hidden pt-24 font-sans">
      {/* Botanical Background Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[5%] right-[15%] w-[600px] h-[600px] bg-[#0B2419]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[5%] left-[15%] w-[500px] h-[500px] bg-[#8B5A2B]/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-2xl border border-[#0B2419]/10 rounded-[3rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Decorative Leaf Accent */}
          <div className="absolute top-0 right-0 p-6 opacity-10 text-[#0B2419]">
             <Shield size={120} />
          </div>

          <AnimatePresence mode="wait">
            
            {view === 'INIT' && (
              <motion.div key="INIT" variants={viewVariants} initial="initial" animate="animate" exit="exit">
                <div className="text-center mb-8 relative z-10">
                  <h1 className="text-4xl font-serif text-[#0B2419] tracking-tight mb-2">Create Account</h1>
                  <p className="text-[#0B2419]/60 text-sm italic">Join the Bhumivera Botanical Registry</p>
                </div>

                {error && <AlertBox type="error" msg={error} />}

                <form onSubmit={handleRegisterInit} className="space-y-5 relative z-10">
                  <InputField icon={<User size={18}/>} type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" disabled={loading} />
                  
                  <InputField icon={<Mail size={18}/>} type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" disabled={loading} />
                  
                  <div className="space-y-3">
                    <InputField icon={<Lock size={18}/>} type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" disabled={loading} />
                    <div className="flex gap-1.5 h-1.5 w-full px-1">
                      {[1, 2, 3, 4].map(level => (
                        <div key={level} className={`flex-1 rounded-full transition-colors duration-500 ${level <= strength ? strengthColors[strength] : 'bg-[#F3F9F1]'}`}></div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-[10px] font-bold text-[#0B2419] uppercase tracking-[0.2em] mb-1 pl-1">Security Question</label>
                    <p className="text-[10px] text-[#8B5A2B] italic mb-3 pl-1">"What is your mother's maiden name?"</p>
                    <InputField icon={<Key size={18}/>} type="text" name="securityAnswer" value={formData.securityAnswer} onChange={handleInputChange} placeholder="Your Answer" disabled={loading} />
                  </div>

                  <div className="flex justify-center pt-2">
                    {/* 3. Attach the ref to the Turnstile component */}
                    <Turnstile
                      ref={turnstileRef}
                      siteKey={TURNSTILE_SITE_KEY}
                      onSuccess={(token) => setTurnstileToken(token)}
                      options={{ theme: 'light' }}
                    />
                  </div>
                  
                  <SubmitButton loading={loading} text="Initialize Registry" disabled={strength < 2 || !turnstileToken} />
                </form>
              </motion.div>
            )}

            {view === 'OTP' && (
              <motion.div key="OTP" variants={viewVariants} initial="initial" animate="animate" exit="exit" className="text-center">
                <h1 className="text-3xl font-serif text-[#0B2419] mb-2 tracking-tight">Verify Identity</h1>
                <p className="text-[#0B2419]/60 text-sm mb-8">Enter the 6-digit sequence dispatched to <br/><strong>{formData.email}</strong></p>

                {successMsg && <AlertBox type="success" msg={successMsg} />}
                {error && <AlertBox type="error" msg={error} />}

                <form onSubmit={handleVerifyOtp}>
                  <div className="flex justify-between gap-3 mb-10">
                    {otp.map((digit, idx) => (
                      <input 
                        key={idx} 
                        ref={(el) => (otpRefs.current[idx] = el)} 
                        type="text" 
                        maxLength="1" 
                        value={digit} 
                        onChange={(e) => handleOtpChange(idx, e.target.value)} 
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)} 
                        className="w-12 h-16 bg-[#F3F9F1] border border-transparent text-[#0B2419] text-2xl font-serif text-center rounded-2xl focus:border-[#D4AF37] focus:bg-white outline-none transition-all shadow-sm" 
                      />
                    ))}
                  </div>
                  <SubmitButton loading={loading} text="Verify Protocol" />
                  
                  <button 
                    type="button" 
                    onClick={() => setView('INIT')} 
                    className="mt-6 text-[10px] font-bold uppercase tracking-widest text-[#0B2419]/50 hover:text-[#0B2419] transition-colors"
                  >
                    Back to Form
                  </button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
        
        {view === 'INIT' && (
          <div className="mt-10 text-center text-sm font-medium text-[#1A1A1A]/60 relative z-10">
            Already registered?{' '}
            <Link to="/login" className="text-[#0B2419] font-bold border-b border-[#D4AF37] ml-1">Log In</Link>
          </div>
        )}
      </div>
    </div>
  );
}

const InputField = ({ icon, ...props }) => (
  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#0B2419]/30 group-focus-within:text-[#8B5A2B] transition-colors">
      {icon}
    </div>
    <input 
      required 
      {...props} 
      className="w-full bg-[#F3F9F1] border border-transparent text-[#0B2419] text-sm rounded-2xl pl-14 pr-5 py-4 focus:outline-none focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/5 transition-all disabled:opacity-50" 
    />
  </div>
);

const SubmitButton = ({ loading, text, disabled = false }) => (
  <button 
    type="submit" 
    disabled={loading || disabled} 
    className={`w-full font-bold text-[10px] uppercase tracking-[0.3em] py-5 rounded-2xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group mt-6 ${disabled ? 'bg-[#F3F9F1] text-[#0B2419]/30 cursor-not-allowed' : 'bg-[#0B2419] hover:bg-[#0B2419]/90 text-[#D4AF37] shadow-[0_15px_30px_rgba(11,36,25,0.2)] hover:-translate-y-1'}`}
  >
    {loading ? (
      <div className="w-5 h-5 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
    ) : (
      <>{text}</>
    )}
  </button>
);

const AlertBox = ({ type, msg }) => (
  <motion.div 
    initial={{ opacity: 0, height: 0, y: -10 }} 
    animate={{ opacity: 1, height: 'auto', y: 0 }} 
    exit={{ opacity: 0, height: 0, y: -10 }} 
    className={`mb-8 p-4 rounded-2xl flex items-start gap-4 border ${type === 'error' ? 'bg-red-500/5 border-red-500/10 text-red-600' : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-700'}`}
  >
    {type === 'error' ? (
      <AlertTriangle size={20} className="shrink-0 mt-0.5 opacity-70" />
    ) : (
      <CheckCircle2 size={20} className="shrink-0 mt-0.5 opacity-70" />
    )}
    <span className="text-xs font-medium leading-relaxed tracking-wide">{msg}</span>
  </motion.div>
);
