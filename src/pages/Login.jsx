import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Assuming your API service path
import { toast } from 'react-hot-toast';

const Login = () => {
  const [step, setStep] = useState('EMAIL'); // EMAIL, OTP, 2FA
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Request OTP
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

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      
      if (data.requires2FA) {
        setStep('2FA');
        toast.info('Please enter your 2FA code');
      } else {
        localStorage.setItem('token', data.token);
        toast.success('Welcome back to Bhumivera!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Verify 2FA
  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-2fa', { email, code: twoFactorCode });
      localStorage.setItem('token', data.token);
      toast.success('Authenticated successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid 2FA code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 font-sans">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#0B2419] opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-[#0B2419]/10 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-[#0B2419] tracking-tight">Bhumivera</h1>
          <p className="text-[#0B2419]/60 text-sm mt-2">Natural Purity. Premium Care.</p>
        </div>

        {/* Step-based Forms */}
        {step === 'EMAIL' && (
          <form onSubmit={handleRequestOTP} className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-xs font-bold text-[#0B2419] uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 bg-[#F3F9F1] border border-transparent focus:border-[#D4AF37] rounded-xl outline-none transition-all text-[#0B2419]"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#0B2419] text-[#D4AF37] font-bold py-4 rounded-xl hover:bg-[#0B2419]/90 transition-all shadow-lg flex justify-center items-center"
            >
              {loading ? 'Sending...' : 'CONTINUE WITH OTP'}
            </button>
          </form>
        )}

        {step === 'OTP' && (
          <form onSubmit={handleVerifyOTP} className="space-y-6 animate-fadeIn">
            <div className="text-center">
              <p className="text-sm text-[#0B2419]/70 mb-4">Verification code sent to <br/><strong>{email}</strong></p>
            </div>
            <input 
              type="text" 
              maxLength="6"
              className="w-full px-4 py-4 text-center text-2xl tracking-[1em] bg-[#F3F9F1] border border-transparent focus:border-[#D4AF37] rounded-xl outline-none text-[#0B2419] font-mono"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              autoFocus
            />
            <button 
              type="submit" 
              className="w-full bg-[#0B2419] text-[#D4AF37] font-bold py-4 rounded-xl hover:bg-[#0B2419]/90 shadow-lg"
            >
              VERIFY OTP
            </button>
            <button type="button" onClick={() => setStep('EMAIL')} className="w-full text-xs text-[#0B2419]/50 hover:text-[#0B2419] transition-colors">Change Email</button>
          </form>
        )}

        {step === '2FA' && (
          <form onSubmit={handleVerify2FA} className="space-y-6 animate-fadeIn">
            <div className="text-center">
              <h2 className="text-[#0B2419] font-bold">2-Factor Authentication</h2>
              <p className="text-xs text-[#0B2419]/60 mt-1 text-center">Open your authenticator app</p>
            </div>
            <input 
              type="text" 
              placeholder="000 000"
              className="w-full px-4 py-3 bg-[#F3F9F1] border border-transparent focus:border-[#D4AF37] rounded-xl outline-none text-center text-xl tracking-widest"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
            />
            <button type="submit" className="w-full bg-[#D4AF37] text-[#0B2419] font-bold py-4 rounded-xl shadow-lg">
              UNLOCK ACCOUNT
            </button>
          </form>
        )}

        <div className="mt-8 text-center border-t border-[#0B2419]/5 pt-6">
          <p className="text-sm text-[#0B2419]/60">
            Don't have an account? <a href="/register" className="text-[#0B2419] font-bold border-b border-[#D4AF37]">Join Bhumivera</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
