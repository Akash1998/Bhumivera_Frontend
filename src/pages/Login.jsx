import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Mail, ArrowRight, AlertTriangle, Zap, Key, Fingerprint, RefreshCw, CheckCircle2, Eye, EyeOff, ShieldAlert, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth as authApi } from '../services/api';
import { Turnstile } from '@marsidev/react-turnstile';

const viewVariants = {
  initial: { opacity: 0, x: 30, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, x: -30, scale: 0.95, transition: { duration: 0.3, ease: "easeIn" } }
};

export default function Login() {
  const { login, mobileLogin } = useAuth(); // FIXED: Pulled mobileLogin from context
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [view, setView] = useState('LOGIN');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    mobile: '',
    otp: '',
    newPassword: '',
    secAnswer: ''
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState('');

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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

        if (!turnstileToken) return setError('Please complete the bot verification.');
    
    setLoading(true);
    setError('');
    try {
      await login({ email: formData.email, password: formData.passwo, turnstileTokenrd });
      navigate(from, { replace: true });
    } catch (err) {
      if (err.message.includes("MFA Verification Required")) {
        setView('2FA');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMobileOtpRequest = async (e) => {
    e.preventDefault();
    if (!formData.mobile) return setError("Mobile number required");
    setLoading(true);
    try {
      await authApi.mobileLoginRequest(formData.mobile);
      setView('MOBILE_OTP');
      setSuccessMsg(`OTP sent to ${formData.mobile}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleMobileOtpVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) return setError("Enter 6-digit OTP");
    setLoading(true);
    try {
      // FIXED: Used context method and standard router navigation
      await mobileLogin({ mobile: formData.mobile, otp: otpString });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
        <AnimatePresence mode="wait">
          {view === 'LOGIN' && (
            <motion.div variants={viewVariants} initial="initial" animate="animate" exit="exit">
              <h2 className="text-3xl font-black text-white mb-2">Welcome Back</h2>
              <p className="text-slate-400 mb-8">Sign in with Email or Mobile OTP.</p>
              
              {error && <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl mb-6 text-sm">{error}</div>}
              
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <InputField icon={<Mail />} type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" />
                <div className="relative">
                  <InputField icon={<Lock />} type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              <div className="flex justify-center mb-4">
                                <Turnstile
                                                    sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                                                    onVerify={(token) => setTurnstileToken(token)}
                                                  />
                              </div>
                
                <SubmitButton loading={loading} text="Login with Email" />
              </form>

              <d
                <button onClick={() => setView('MOBILE_REQ')} className="w-full py-4 rounded-2xl border border-emerald-500/30 text-emerald-400 font-bold hover:bg-emerald-500/5 transition-all flex items-center justify-center gap-2">
                  <Phone size={18} /> Login with Mobile OTP
                </button>ial="initial" animate="animate" exit="exit">
              <button onClick={() => setView('LOGIN')} className="text-slate-500 mb-6 text-sm font-medium">Back to Email</button>
              <h2 className="text-3xl font-black text-white mb-2">Mobile Login</h2>
              <p className="text-slate-400 mb-8">Enter your number to receive an OTP.</p>
              
              {error && <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl mb-6 text-sm">{error}</div>}
              {successMsg && <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl mb-6 text-sm">{successMsg}</div>}
              
              <form onSubmit={handleMobileOtpRequest} className="space-y-4">
                <InputField icon={<Phone />} type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="Mobile Number" />
                <SubmitButton loading={loading} text="Send OTP" />
              </form>
            </motion.div>
          )}

          {view === 'MOBILE_OTP' && (
            <motion.div variants={viewVariants} initial="initial" animate="animate" exit="exit">
              <h2 className="text-3xl font-black text-white mb-2">Verify OTP</h2>
              <p className="text-slate-400 mb-8">Enter the 6-digit code sent to {formData.mobile}</p>
              
              {error && <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl mb-6 text-sm">{error}</div>}
              
              <form onSubmit={handleMobileOtpVerify}>
                <div className="flex justify-between gap-2 mb-8">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => (otpRefs.current[idx] = el)}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      className="w-12 h-14 bg-slate-950 border border-slate-800 text-white text-xl font-black text-center rounded-xl focus:border-emerald-500 outline-none"
                    />
                  ))}
                </div>
                <SubmitButton loading={loading} text="Verify & Login" />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const InputField = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">{icon}</div>
    <input required {...props} className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-emerald-500 transition-all" />
  </div>
);

const SubmitButton = ({ loading, text }) => (
  <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50">
    {loading ? "Processing..." : text}
  </button>
);
