import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Smartphone, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export default function AdminLogin() {
  const [loginMethod, setLoginMethod] = useState('otp');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const { login } = useAuth();
  const { showToast } = useToast() || {};
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/admin/login', { email, password });
      login(response.data.user, response.data.token);
      showToast?.('Welcome back, Architect.', 'success');
      navigate('/admin/dashboard');
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length < 10) return showToast?.('Enter a valid 10-digit number', 'error');
    
    setLoading(true);
    try {
      await api.post('/auth/admin/otp/send', { phone });
      showToast?.('OTP dispatched. Check server logs.', 'success');
      setStep(2);
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Failed to dispatch OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) return showToast?.('Enter the complete 6-digit code', 'error');

    setLoading(true);
    try {
      const response = await api.post('/auth/admin/otp/verify', { phone, otp: otpString });
      login(response.data.user, response.data.token);
      showToast?.('Identity Verified. Access Granted.', 'success');
      navigate('/admin/dashboard');
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Invalid or expired OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-[2rem] p-8 shadow-2xl relative z-10">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Shield className="text-emerald-500" size={32} />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-widest">System Access</h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em] mt-2">Anritvox Master Control</p>
        </div>

        {step === 1 && (
          <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-xl mb-8">
            <button
              type="button"
              onClick={() => setLoginMethod('otp')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all ${
                loginMethod === 'otp' ? 'bg-emerald-500/10 text-emerald-400 shadow-lg' : 'text-slate-500 hover:text-white'
              }`}
            >
              <Smartphone size={14} /> Secure OTP
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all ${
                loginMethod === 'email' ? 'bg-emerald-500/10 text-emerald-400 shadow-lg' : 'text-slate-500 hover:text-white'
              }`}
            >
              <Mail size={14} /> Email Auth
            </button>
          </div>
        )}

        {loginMethod === 'otp' && (
          <div>
            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Registered Mobile Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 10-digit number"
                      maxLength="10"
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || phone.length < 10}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : 'Request Authorization'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-6">
                  <p className="text-slate-400 text-sm">Check server logs for code sent to <span className="text-white font-mono">{phone}</span></p>
                  <button type="button" onClick={() => setStep(1)} className="text-emerald-500 text-[10px] uppercase tracking-widest hover:underline mt-2">Change Number</button>
                </div>
                
                <div className="flex justify-between gap-2">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onFocus={(e) => e.target.select()}
                      className="w-12 h-14 bg-slate-950 border border-slate-800 text-white text-center text-xl font-black rounded-xl focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join('').length < 6}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <><KeyRound size={18} /> Verify Identity</>}
                </button>
              </form>
            )}
          </div>
        )}

        {loginMethod === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="architect@anritvox.com"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Secure Passphrase</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><ArrowRight size={18} /> Initialize Session</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
