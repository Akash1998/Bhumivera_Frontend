import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, Fingerprint, Key, Sparkles } from 'lucide-react';
import { isPasskeySupported, loginWithPasskey } from '../utils/webauthnClient';
import { useAuth } from '../context/AuthContext';
import { triggerAiCopilotAssist } from '../utils/aiCopilotBus';
import GoogleSignInButton from '../components/GoogleSignInButton';

const Login = () => {
  const { isAuthenticated, user, login, googleLogin, completeLogin } = useAuth() || {};
  const [mode, setMode] = useState('PASSWORD'); // PASSWORD | OTP
  const [step, setStep] = useState('FORM'); // FORM | OTP | 2FA
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorMethod, setTwoFactorMethod] = useState('authenticator');
  const [loading, setLoading] = useState(false);
  const [showLockoutBanner, setShowLockoutBanner] = useState(false);
  const [lockoutMsg, setLockoutMsg] = useState('');
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [lockoutExpired, setLockoutExpired] = useState(false);
  const [googleSignInError, setGoogleSignInError] = useState('');
  const [googleTermsAccepted, setGoogleTermsAccepted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const passkeySupported = isPasskeySupported();

  useEffect(() => {
    const secondFactorEmail = location.state?.googleTwoFactorEmail;
    if (!secondFactorEmail) return;
    setEmail(secondFactorEmail);
    setMode('PASSWORD');
    setTwoFactorMethod('authenticator');
    setStep('2FA');
  }, [location.state]);

  useEffect(() => {
    if (!showLockoutBanner || lockoutSeconds <= 0) return undefined;
    const timer = setInterval(() => setLockoutSeconds(seconds => Math.max(0, seconds - 1)), 1000);
    return () => clearInterval(timer);
  }, [showLockoutBanner, lockoutSeconds]);

  useEffect(() => {
    if (!showLockoutBanner) return;
    if (lockoutSeconds <= 0) {
      setLockoutExpired(true);
      setLockoutMsg('Lockout expired. You can try again now.');
      return;
    }
    setLockoutExpired(false);
    const mins = Math.floor(lockoutSeconds / 60);
    const secs = lockoutSeconds % 60;
    setLockoutMsg(`Account temporarily locked. Try again in ${mins}m ${secs}s or reset password now.`);
  }, [lockoutSeconds, showLockoutBanner]);

  const _persistAndRedirect = (data, greetMsg = 'Welcome back to Bhumivera!', sessionIsComplete = false) => {
    if (!sessionIsComplete) completeLogin(data);
    toast.success(greetMsg);
    const requestedPath = typeof location.state?.from === 'string' &&
      location.state.from.startsWith('/') && !location.state.from.startsWith('//')
      ? location.state.from
      : '/profile';
    const destination = location.state?.reopenCart ? '/?cartCheckout=1' : requestedPath;
    navigate(destination, { replace: true });
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/login-request-otp', { email });
      toast.success('OTP sent to your email!');
      setTwoFactorMethod('email');
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
        toast('Please enter your 2FA code.', { icon: 'ℹ️' });
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

  const handlePasskeyLogin = async () => {
    setLoading(true);
    try {
      const res = await loginWithPasskey(email);
      if (res?.token) {
        _persistAndRedirect(res);
        toast.success('Biometric authentication verified!');
      } else {
        toast.error('Passkey sign-in failed. Please try again.');
      }
    } catch (err) {
      console.error('[PASSKEY_LOGIN_ERROR]', err);
      toast.error(err.message || 'Passkey sign-in failed. Please use your password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async idToken => {
    setGoogleSignInError('');
    try {
      const response = await googleLogin(idToken, googleTermsAccepted);
      if (response.data?.requires2FA) {
        setEmail(response.data.email || '');
        setMode('PASSWORD');
        setTwoFactorMethod('authenticator');
        setStep('2FA');
        toast(response.data.message || 'Enter your authenticator code to continue.', { icon: 'ℹ️' });
        return;
      }
      _persistAndRedirect(response.data, 'Google sign-in successful', true);
    } catch (error) {
      const message = error.response?.data?.message || error.normalized?.message || error.message || 'Google sign-in failed.';
      setGoogleSignInError(message);
      toast.error(message);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setShowLockoutBanner(false);
    setLockoutExpired(false);
    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res.status === 202 && res.data?.requires2FA) {
        setTwoFactorMethod(res.data.factor || 'authenticator');
        setStep('2FA');
        toast(res.data.message || 'Enter your verification code to continue.', { icon: 'ℹ️' });
        return;
      }
      if (res.data?.token) {
        _persistAndRedirect(res.data, 'Welcome back to Bhumivera!', true);
      } else {
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      const status = error.response?.status;
      const d = error.response?.data;
      if (status === 423) {
        const secs = Math.max(0, Number(d?.secondsRemaining) || 0);
        setLockoutSeconds(secs);
        setShowLockoutBanner(true);
      } else if (error.response?.status === 202 && error.response?.data?.requires2FA) {
        setTwoFactorMethod(error.response.data.factor || 'authenticator');
        setStep('2FA');
        toast(error.response.data.message || 'Enter your verification code to continue.', { icon: 'ℹ️' });
      } else {
        const msg = d?.message || error.message || 'Invalid email or password';
        toast.error(msg);
        triggerAiCopilotAssist({
          frictionType: 'login',
          stage: 'login',
          email,
          errorMessage: msg,
          autoOpen: true,
        });
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
    setTwoFactorMethod('authenticator');
  };

  if (isAuthenticated) {
    const destination = ['admin', 'superadmin'].includes(user?.role)
      ? '/admin'
      : user?.role === 'warehouse_admin'
        ? '/warehouse'
        : '/profile';
    return <Navigate to={destination} replace />;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#0B2419] opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4AF37] opacity-5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      
      <div className="w-full max-w-md relative">
        <div className="bg-white/85 backdrop-blur-md border border-[#0B2419]/10 rounded-3xl shadow-2xl p-7 md:p-8 overflow-hidden">
          <div className="text-center mb-7">
            <div className="mx-auto mb-4 inline-flex h-[76px] w-[76px] items-center justify-center">
              <img src="/logo.webp" alt="Bhumivera tree emblem" width="72" height="72" fetchPriority="high" decoding="async" className="h-[72px] w-[72px] object-contain" />
            </div>
            <h1 className="text-3xl font-serif text-[#14251c] tracking-tight">Bhumivera</h1>
            <p className="text-[#0B2419]/60 text-sm mt-2">Natural Purity. Premium Care.</p>
          </div>

          {step === 'FORM' && (
            <div className="mb-6 space-y-3">
              <GoogleSignInButton
                onSignIn={handleGoogleLogin}
                onError={error => {
                  const message = error.message || 'Google sign-in could not be started.';
                  setGoogleSignInError(message);
                  toast.error(message);
                }}
                disabled={!googleTermsAccepted}
              />
              <label className="flex items-start gap-2 text-[11px] leading-relaxed text-[#0B2419]/70">
                <input
                  type="checkbox"
                  checked={googleTermsAccepted}
                  onChange={event => setGoogleTermsAccepted(event.target.checked)}
                  className="mt-0.5 accent-[#0B2419]"
                />
                <span>I agree to the <Link to="/legal?section=terms" target="_blank" rel="noreferrer" className="font-semibold underline">Conditions of Use &amp; Sale</Link> and acknowledge the <Link to="/legal?section=privacy" target="_blank" rel="noreferrer" className="font-semibold underline">Privacy Notice</Link>. New customers can create an account with Google.</span>
              </label>
              {googleSignInError && <p role="alert" className="text-xs text-red-700">{googleSignInError}</p>}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-[#8B9D83]/20" />
                <span className="absolute bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-[#8B9D83]">or use email</span>
              </div>
            </div>
          )}

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
                        name="email"
                        autoComplete="username"
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
                      <Link to="/forgot-password" className="text-xs text-[#D4AF37] font-semibold hover:underline">Forgot?</Link>
                    </div>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B9D83]" />
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        autoComplete="current-password"
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
                  {showLockoutBanner && (
                    <div className={`mb-4 p-4 border rounded-2xl text-sm ${lockoutExpired ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                      <div className={`font-semibold mb-2 ${lockoutExpired ? 'text-emerald-700' : 'text-red-500'}`}>{lockoutExpired ? '✓' : '🔒'} {lockoutMsg}</div>
                      <Link to="/forgot-password" className="text-[#D4AF37] font-bold hover:underline">
                        Reset password to unlock immediately →
                      </Link>
                    </div>
                  )}
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
                  <div className="relative my-4 flex items-center justify-center">
                    <div className="w-full border-t border-[#8B9D83]/20"></div>
                    <span className="bg-[#FDFBF7] px-3 text-[11px] font-bold uppercase tracking-wider text-[#8B9D83]">or</span>
                  </div>
                  {passkeySupported && <button
                    type="button"
                    onClick={handlePasskeyLogin}
                    disabled={loading}
                    className="w-full bg-[#FAF8F5] border border-[#D4AF37]/50 text-[#0B2419] font-bold py-3.5 rounded-2xl hover:bg-[#D4AF37]/10 transition-all flex justify-center items-center gap-2.5 text-xs uppercase tracking-wider disabled:opacity-60"
                  >
                    <Fingerprint size={18} className="text-[#D4AF37]" /> Sign In with Passkey / Face ID
                  </button>}
                </form>
              ) : (
                <form onSubmit={handleRequestOTP} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-[#0B2419] uppercase tracking-widest mb-2">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B9D83]" />
                      <input 
                        type="email" 
                        name="email"
                        autoComplete="username"
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
                  <div className="relative my-4 flex items-center justify-center">
                    <div className="w-full border-t border-[#8B9D83]/20"></div>
                    <span className="bg-[#FDFBF7] px-3 text-[11px] font-bold uppercase tracking-wider text-[#8B9D83]">or</span>
                  </div>
                  {passkeySupported && <button
                    type="button"
                    onClick={handlePasskeyLogin}
                    disabled={loading}
                    className="w-full bg-[#FAF8F5] border border-[#D4AF37]/50 text-[#0B2419] font-bold py-3.5 rounded-2xl hover:bg-[#D4AF37]/10 transition-all flex justify-center items-center gap-2.5 text-xs uppercase tracking-wider disabled:opacity-60"
                  >
                    <Fingerprint size={18} className="text-[#D4AF37]" /> Sign In with Passkey / Face ID
                  </button>}
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
                <p className="text-xs text-[#0B2419]/60 mt-1 text-center">
                  {twoFactorMethod === 'email' ? 'Enter the 6-digit code we sent to your email.' : 'Enter the 6-digit code from your authenticator app.'}
                </p>
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

          <div className="mt-6 flex items-center justify-center">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('bhumivera:open-visual-guide', { detail: { tab: 'password' } }))}
              className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] hover:text-[#0B2419] font-medium transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Login &amp; Password Visual Guide
            </button>
          </div>

          <div className="mt-6 text-center border-t border-[#0B2419]/5 pt-5">
            <p className="text-sm text-[#0B2419]/60">
              Don't have an account? <Link to="/register" className="text-[#0B2419] font-bold border-b border-[#D4AF37] pb-0.5 hover:opacity-80 transition-opacity">Join Bhumivera</Link>
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
