import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { auth } from '../services/api';
import { toast } from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, Leaf } from 'lucide-react';

const Login = () => {
  const [mode, setMode] = useState('OTP'); // OTP | PASSWORD
  const [step, setStep] = useState('FORM'); // FORM | OTP | 2FA
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const _persistAndRedirect = (data, greetMsg = 'Welcome back to Bhumivera!') => {
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    toast.success(greetMsg);
    setTimeout(() => { window.location.href = '/profile'; }, 300);
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/login-request-otp', { email });
      toast.success('OTP sent to your email!');
      setStep('OTP');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/2fa/verify', { email, otp });
      if (data.requires2FA) {
        setStep('2FA');
        toast.info('Please enter your 2FA code');
      } else if (data.token) {
        _persistAndRedirect(data);
      } else {
        toast.error('Verification failed. No token received.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await auth.login({ email, password });
      if (res.status === 202 && res.data?.requires2FA) {
        setStep('2FA');
        toast.info('Please enter your 2FA authenticator code');
        return;
      }
      if (res.data?.token) {
        _persistAndRedirect(res.data);
      } else {
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      if (error.response?.status === 202 && error.response?.data?.requires2FA) {
        setStep('2FA');
        toast.info('Please enter your 2FA authenticator code');
      } else {
        toast.error(error.response?.data?.message || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { email, otp: twoFactorCode, twoFactorCode, code: twoFactorCode };
      if (mode === 'PASSWORD') payload.twoFactorCode = twoFactorCode;
      const { data } = await api.post('/auth/2fa/verify', payload);
      if (data.token) {
        _persistAndRedirect(data, 'Authenticated successfully');
      } else {
        toast.error('Authentication failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid 2FA code');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setStep('FORM');
    setPassword('');
    setOtp('');
    setTwoFactorCode('');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#0B2419] opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4AF37] opacity-5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      
      <div className="w-full max-w-md relative">
        <div className="bg-white/85 backdrop-blur-md border border-[#0B2419]/10 rounded-3xl shadow-2xl p-7 md:p-8 overflow-hidden">
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0B2419] mb-4 shadow-lg">
              <Leaf size={28} className="text-[#D4AF37]" />
            </div>
            <h1 className="text-3xl font-serif text-[#0B2419] tracking-tight">Bhumivera</h1>
            <p className="text-[#0B2419]/60 text-sm mt-2">Natural Purity. Premium Care.</p>
          </div>

          {step === 'FORM' && (
            <>
              <div className="flex items-center gap-1 bg-[#FDFBF7] p-1 rounded-2xl mb-6 border border-[#8B9D83]/20 shadow-inner">
                <button
                  type="button"
                  onClick={() => switchMode('PASSWORD')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'PASSWORD'
                      ? 'bg-[#0B2419] text-[#FDFBF7] shadow-md'
                      : 'text-[#2C3E2D] hover:text-[#0B2419]'
                  }`}
                >
                  <Lock size={15} /> Password
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('OTP')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'OTP'
                      ? 'bg-[#0B2419] text-[#FDFBF7] shadow-md'
                      : 'text-[#2C3E2D] hover:text-[#0B2419]'
                  }`}
                >
                  <Mail size={15} /> Email OTP
                </button>
              </div>

              {mode === 'PASSWORD' ? (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0B2419] uppercase tracking-widest mb-2">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B9D83]" />
                      <input 
                        type="email" 
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-[#FDFBF7] border border-[#8B9D83]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-2xl outline-none transition-all text-[#0B2419]"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-[#0B2419] uppercase tracking-widest">Password</label>
                      <a href="/forgot-password" className="text-xs text-[#D4AF37] font-semibold hover:underline">Forgot?</a>
                    </div>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B9D83]" />
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="w-full pl-12 pr-12 py-3.5 bg-[#FDFBF7] border border-[#8B9D83]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-2xl outline-none transition-all text-[#0B2419]"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B9D83] hover:text-[#0B2419] transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#0B2419] text-[#D4AF37] font-bold py-4 rounded-2xl hover:bg-[#2C3E2D] transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="inline-block w-5 h-5 border-2 border-[#D4AF37]/40 border-t-[#D4AF37] rounded-full animate-spin" />
                    ) : (
                      <>SIGN IN <ShieldCheck size={17} /></>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRequestOTP} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-[#0B2419] uppercase tracking-widest mb-2">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B9D83]" />
                      <input 
                        type="email" 
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-[#FDFBF7] border border-[#8B9D83]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-2xl outline-none transition-all text-[#0B2419]"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#0B2419] text-[#D4AF37] font-bold py-4 rounded-2xl hover:bg-[#2C3E2D] transition-all shadow-lg flex justify-center items-center"
                  >
                    {loading ? 'Sending...' : 'CONTINUE WITH OTP'}
                  </button>
                </form>
              )}
            </>
          )}

          {step === 'OTP' && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <button type="button" onClick={() => setStep('FORM')} className="flex items-center gap-1 text-xs text-[#8B9D83] hover:text-[#0B2419] mb-2 transition-colors">
                <ArrowLeft size={14} /> Back
              </button>
              <div className="text-center">
                <p className="text-sm text-[#0B2419]/70 mb-4">Verification code sent to <br/><strong className="text-[#0B2419]">{email}</strong></p>
              </div>
              <input 
                type="text" 
                maxLength="6"
                className="w-full px-4 py-4 text-center text-2xl tracking-[1em] bg-[#FDFBF7] border border-[#8B9D83]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-2xl outline-none text-[#0B2419] font-mono"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                autoFocus
              />
              <button 
                type="submit" 
                className="w-full bg-[#0B2419] text-[#D4AF37] font-bold py-4 rounded-2xl hover:bg-[#2C3E2D] shadow-lg transition-all"
                disabled={loading}
              >
                {loading ? 'VERIFYING...' : 'VERIFY OTP'}
              </button>
              <div className="text-center">
                <button type="button" onClick={handleRequestOTP} disabled={loading} className="text-xs text-[#8B9D83] hover:text-[#0B2419] transition-colors disabled:opacity-60">
                  Didn't get the code? <span className="text-[#D4AF37] font-semibold">Resend OTP</span>
                </button>
              </div>
            </form>
          )}

          {step === '2FA' && (
            <form onSubmit={handleVerify2FA} className="space-y-5">
              <button type="button" onClick={() => setStep('FORM')} className="flex items-center gap-1 text-xs text-[#8B9D83] hover:text-[#0B2419] mb-2 transition-colors">
                <ArrowLeft size={14} /> Back
              </button>
              <div className="text-center mb-2">
                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/20 text-[#0B2419] mx-auto flex items-center justify-center mb-3">
                  <ShieldCheck size={28} />
                </div>
                <h2 className="text-[#0B2419] font-bold text-lg">2-Factor Authentication</h2>
                <p className="text-xs text-[#0B2419]/60 mt-1 text-center">Enter the 6-digit code from your authenticator app</p>
              </div>
              <input 
                type="text" 
                maxLength="6"
                placeholder="000000"
                className="w-full px-4 py-4 text-center text-2xl tracking-[0.5em] bg-[#FDFBF7] border border-[#8B9D83]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 rounded-2xl outline-none text-[#0B2419] font-mono"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                autoFocus
              />
              <button type="submit" className="w-full bg-[#D4AF37] text-[#0B2419] font-bold py-4 rounded-2xl hover:bg-[#e6c45a] shadow-lg transition-all disabled:opacity-60" disabled={loading}>
                {loading ? 'VERIFYING...' : 'UNLOCK ACCOUNT'}
              </button>
            </form>
          )}

          <div className="mt-8 text-center border-t border-[#0B2419]/5 pt-6">
            <p className="text-sm text-[#0B2419]/60">
              Don't have an account? <a href="/register" className="text-[#0B2419] font-bold border-b border-[#D4AF37] pb-0.5 hover:opacity-80 transition-opacity">Join Bhumivera</a>
            </p>
          </div>
        </div>
        <p className="text-center text-xs text-[#8B9D83] mt-4 flex items-center justify-center gap-1">
          <ShieldCheck size={12} /> Your account is secured with industry-standard encryption
        </p>
      </div>
    </div>
  );
};

export default Login;
