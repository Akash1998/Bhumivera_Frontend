import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Turnstile } from '@marsidev/react-turnstile';

const viewVariants = {
  initial: { opacity: 0, x: 30, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, x: -30, scale: 0.95, transition: { duration: 0.3, ease: "easeIn" } }
};

export default function Login() {
  const { login } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // 2. Create the Ref for the widget
  const turnstileRef = useRef(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');

  const TURNSTILE_SITE_KEY = "0x4AAAAAADBENLaxaG5Y9r6D";

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!turnstileToken) return setError('Please complete the bot verification.');
    
    setLoading(true);
    setError('');
    
    try {
      await login({ email: formData.email, password: formData.password, turnstileToken });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      
      // 4. THE FIX: Reset the token and widget on any failure
      setTurnstileToken(''); 
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
        <AnimatePresence mode="wait">
          <motion.div key="LOGIN" variants={viewVariants} initial="initial" animate="animate" exit="exit">
            <h2 className="text-3xl font-black text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400 mb-8">Sign in with your Email.</p>
            
            {error && <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl mb-6 text-sm">{error}</div>}
            
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <InputField icon={<Mail />} type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" />
              
              <div className="relative">
                <InputField icon={<Lock />} type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-500 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <div className="flex justify-center mb-4 pt-2">
                {/* 3. Attach the ref to the component */}
                <Turnstile
                  ref={turnstileRef}
                  siteKey={TURNSTILE_SITE_KEY}
                  onSuccess={(token) => setTurnstileToken(token)}
                />
              </div>
              
              <SubmitButton loading={loading} text="Login" disabled={!turnstileToken} />
            </form>

            <div className="mt-8 text-center text-sm font-medium text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-emerald-500 hover:text-emerald-400 transition-colors ml-1">Sign Up</Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const InputField = ({ icon, ...props }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors">{icon}</div>
    <input required {...props} className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-emerald-500 transition-all disabled:opacity-50" />
  </div>
);

const SubmitButton = ({ loading, text, disabled }) => (
  <button type="submit" disabled={loading || disabled} className={`w-full font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 ${disabled ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'}`}>
    {loading ? <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div> : text}
  </button>
);
