import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Lock, Mail, AlertTriangle, User, 
  Key, CheckCircle2 
} from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { useAuth } from '../context/AuthContext';
import { affiliate } from '../services/api';
import { triggerAiCopilotAssist } from '../utils/aiCopilotBus';
import GoogleSignInButton from '../components/GoogleSignInButton';

const MotionDiv = motion.div;

const viewVariants = {
  initial: { opacity: 0, x: 30, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, x: -30, scale: 0.95, transition: { duration: 0.3, ease: "easeIn" } }
};

export default function Register() {
  const { register, verifyEmail, googleLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralToken = searchParams.get('ref') || '';
  const returnTo = typeof location.state?.from === 'string' &&
    location.state.from.startsWith('/') && !location.state.from.startsWith('//')
    ? location.state.from
    : '/profile';
  const [referralPreview, setReferralPreview] = useState({ loading: false, valid: false, referrerName: '' });

  // 1. Create the Ref for the Turnstile widget
  const turnstileRef = useRef(null);

  const [view, setView] = useState('INIT');
  const [registrationMethod, setRegistrationMethod] = useState(searchParams.get('email') ? 'email' : 'google');
  const [formData, setFormData] = useState({
    name: '', email: searchParams.get('email') || '', password: '', securityAnswer: '', marketingEmailOptIn: false,
    adPersonalizationOptIn: false, referralCode: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [googleSignInError, setGoogleSignInError] = useState('');

  const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() || '';

  useEffect(() => {
    let active = true;
    const code = formData.referralCode.trim();
    if (!referralToken && !code) {
      setReferralPreview({ loading: false, valid: false, referrerName: '' });
      return undefined;
    }
    setReferralPreview(current => ({ ...current, loading: true }));
    const timer = window.setTimeout(() => {
      affiliate.previewReferral(referralToken ? { token: referralToken } : { code })
        .then(response => {
          if (!active) return;
          const data = response.data?.data || response.data || {};
          setReferralPreview({ loading: false, valid: data.valid === true, referrerName: data.referrerName || '' });
        })
        .catch(() => {
          if (active) setReferralPreview({ loading: false, valid: false, referrerName: '' });
        });
    }, 300);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [referralToken, formData.referralCode]);

  const passwordChecks = [
    { label: 'At least 8 characters', valid: formData.password.length >= 8 },
    { label: 'No more than 128 characters', valid: formData.password.length <= 128 }
  ];
  const passwordIsValid = passwordChecks.every(check => check.valid) && formData.password.length <= 128;
  const passwordStrength = passwordChecks.filter(check => check.valid).length;

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
    if (!termsAccepted) return setError('Please accept the Conditions of Use and acknowledge the Privacy Notice.');
    if (!passwordIsValid) {
      const unmetRequirements = passwordChecks.filter(check => !check.valid).map(check => check.label);
      if (formData.password.length > 128) unmetRequirements.push('No more than 128 characters');
      const msg = `Please update your password: ${unmetRequirements.join('; ')}.`;
      triggerAiCopilotAssist({
        frictionType: 'password_auth',
        stage: 'register',
        email: formData.email,
        candidatePassword: formData.password,
        errorMessage: msg,
        autoOpen: true,
      });
      return setError(msg);
    }
    if (!formData.securityAnswer) return setError("Security answer is required for account protection.");

    setLoading(true); 
    setError('');
    
    try {
      await register({ ...formData, termsAccepted, referralToken: referralToken || undefined, turnstileToken });
      setView('OTP');
      setSuccessMsg(`Verification token dispatched to ${formData.email}`);
    } catch (err) {
      const errorMessage = err.normalized?.message || err.response?.data?.message || err.message || 'Registration sequence failed';
      
      // UX UPGRADE: Detect duplicate emails and inject a React Router Link into the Alert Box
      if (errorMessage.toLowerCase().includes('already registered')) {
        setError(
          <span className="flex flex-col gap-1.5">
            <span>This email is already registered in the registry.</span>
            <Link to="/login" className="font-bold underline text-[#d4af37] hover:text-[#0B2419] transition-colors w-max">
              Click here to Log In Instead
            </Link>
          </span>
        );
      } else {
        setError(errorMessage);
      }
      
      // Reset token and widget on failure to allow retry
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
      setTimeout(() => navigate(returnTo, { replace: true }), 1500);
    } catch (err) {
      setError(err.normalized?.message || err.response?.data?.message || err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegistration = async idToken => {
    if (!termsAccepted) {
      setGoogleSignInError('Accept the Conditions of Use and acknowledge the Privacy Notice to continue.');
      return;
    }
    setGoogleSignInError('');
    setLoading(true);
    try {
      await googleLogin(idToken, {
        mode: 'register',
        termsAccepted,
        securityAnswer: formData.securityAnswer.trim(),
        referralToken: referralToken || undefined,
        referralCode: referralToken ? undefined : formData.referralCode.trim() || undefined,
        marketingEmailOptIn: formData.marketingEmailOptIn,
        adPersonalizationOptIn: formData.adPersonalizationOptIn,
      });
      navigate(returnTo, { replace: true });
    } catch (error) {
      if (error.response?.data?.code === 'ACCOUNT_ALREADY_REGISTERED' ||
          error.response?.data?.code === 'GOOGLE_ACCOUNT_ALREADY_REGISTERED') {
        setGoogleSignInError(
          <span>
            This Google email already has an account. <Link to="/login" className="font-semibold underline">Sign in instead</Link>.
          </span>
        );
      } else {
        const message = error.response?.data?.message || error.normalized?.message || error.message || 'Google account creation failed.';
        setGoogleSignInError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-luxury min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden pt-20 sm:pt-24 pb-24 font-sans">
      {/* Botanical Background Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[5%] right-[15%] w-[600px] h-[600px] bg-[#0B2419]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[5%] left-[15%] w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="auth-luxury__card bg-white/80 backdrop-blur-2xl border border-[#0B2419]/10 rounded-3xl sm:rounded-[3rem] p-6 sm:p-9 shadow-2xl relative overflow-hidden">
          
          {/* Decorative Leaf Accent */}
          <div className="absolute top-0 right-0 p-6 opacity-10 text-[#0B2419]">
             <Shield size={120} />
          </div>

          <AnimatePresence mode="wait">
            
            {view === 'INIT' && (
              <MotionDiv key="INIT" variants={viewVariants} initial="initial" animate="animate" exit="exit">
                <div className="text-center mb-6 relative z-10">
                  <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center">
                    <img src="/logo.webp" alt="Bhumivera tree emblem" width="56" height="56" fetchPriority="high" decoding="async" className="h-14 w-14 object-contain" />
                  </div>
                  <h1 className="text-3xl font-serif text-[#0B2419] tracking-tight mb-1">Create account</h1>
                  <p className="text-[#0B2419]/60 text-sm">Choose how you’d like to register.</p>
                </div>

                {error && <AlertBox type="error" msg={error} />}
                <form onSubmit={handleRegisterInit} className="space-y-4 relative z-10">
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#F3F9F1] p-1" role="group" aria-label="Registration method">
                    <button type="button" aria-pressed={registrationMethod === 'google'} onClick={() => { setRegistrationMethod('google'); setError(''); setGoogleSignInError(''); }} disabled={loading} className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${registrationMethod === 'google' ? 'bg-white text-[#0B2419] shadow-sm' : 'text-[#0B2419]/60 hover:text-[#0B2419]'}`}>Google</button>
                    <button type="button" aria-pressed={registrationMethod === 'email'} onClick={() => { setRegistrationMethod('email'); setError(''); setGoogleSignInError(''); }} disabled={loading} className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${registrationMethod === 'email' ? 'bg-white text-[#0B2419] shadow-sm' : 'text-[#0B2419]/60 hover:text-[#0B2419]'}`}>Email</button>
                  </div>
                  <p className="text-xs leading-relaxed text-[#0B2419]/60">
                    {registrationMethod === 'google'
                      ? 'Google verifies your email; that verified address will be used for your account.'
                      : 'We’ll send a verification code to the email address you enter.'}
                  </p>

                  {registrationMethod === 'email' && (
                    <div className="space-y-3">
                      <InputField icon={<User size={18}/>} type="text" name="name" autoComplete="name" value={formData.name} onChange={handleInputChange} placeholder="Full name" disabled={loading} />
                      <InputField icon={<Mail size={18}/>} type="email" name="email" autoComplete="email" value={formData.email} onChange={handleInputChange} placeholder="Email address" disabled={loading} />
                    </div>
                  )}

                  <div>
                    <label htmlFor="referralCode" className="mb-1.5 block pl-1 text-xs font-semibold text-[#0B2419]">Referral code <span className="font-normal text-[#0B2419]/50">(optional)</span></label>
                    {referralToken ? (
                      <>
                        <input id="referralCode" value="Referral link applied" readOnly aria-readonly="true" className="w-full rounded-xl border border-emerald-700/20 bg-emerald-50 px-3 py-3 text-sm text-emerald-900"/>
                        <p className="mt-1 pl-1 text-xs text-emerald-800">{referralPreview.loading ? 'Checking referral link…' : referralPreview.valid ? `Referred by ${referralPreview.referrerName}. Reward is issued after approval, usually within an hour.` : 'This referral link is invalid or expired. Ask your friend for a current link.'}</p>
                      </>
                    ) : (
                      <>
                        <input id="referralCode" name="referralCode" type="text" autoComplete="off" maxLength={32} value={formData.referralCode} onChange={handleInputChange} placeholder="Enter a friend’s code" disabled={loading} className="w-full rounded-xl border border-[#0B2419]/10 bg-[#F3F9F1] px-3 py-3 text-sm text-[#0B2419] outline-none focus:border-[#D4AF37] focus:bg-white disabled:opacity-50"/>
                        {formData.referralCode.trim() && <p aria-live="polite" className={`mt-1 pl-1 text-xs ${referralPreview.valid ? 'text-emerald-800' : 'text-[#d4af37]'}`}>{referralPreview.loading ? 'Checking referral code…' : referralPreview.valid ? `Referred by ${referralPreview.referrerName}. Reward is issued after approval, usually within an hour.` : 'Referral code not found. Check the code before continuing.'}</p>}
                      </>
                    )}
                  </div>
                  
                  {registrationMethod === 'email' && (
                    <div className="space-y-2">
                      <InputField icon={<Lock size={18}/>} type="password" name="password" autoComplete="new-password" value={formData.password} onChange={handleInputChange} placeholder="Password" disabled={loading} />
                      <div className="px-1" aria-live="polite">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-[#0B2419]">Password: 8–128 characters</p>
                          <p className={`text-xs font-semibold ${passwordIsValid ? 'text-emerald-700' : 'text-[#d4af37]'}`}>
                            {passwordStrength}/{passwordChecks.length} complete
                          </p>
                        </div>
                        <p className="mt-1 text-[11px] text-[#0B2419]/55">Use a unique password you don’t use on other sites.</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <label className="mb-1 block pl-1 text-xs font-semibold text-[#0B2419]">Account recovery answer <span className="font-normal text-red-700">required</span></label>
                    <p className="mb-2 pl-1 text-xs text-[#0B2419]/60">What is your mother’s maiden name? Keep the answer safe.</p>
                    <InputField icon={<Key size={18}/>} type="text" name="securityAnswer" autoComplete="off" value={formData.securityAnswer} onChange={handleInputChange} placeholder="Your answer" disabled={loading} required />
                  </div>

                  <label className="flex items-start gap-3 rounded-xl border border-[#0B2419]/10 bg-[#F3F9F1]/70 p-3 text-xs leading-relaxed text-[#0B2419]/75">
                    <input
                      type="checkbox"
                      checked={formData.marketingEmailOptIn}
                      onChange={event => setFormData({ ...formData, marketingEmailOptIn: event.target.checked })}
                      disabled={loading}
                      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#0B2419]"
                    />
                    <span>Send me promotional emails and product updates. Optional; account and order emails are unaffected.</span>
                  </label>

                  <label className="flex items-start gap-3 rounded-xl border border-emerald-800/20 bg-emerald-50/70 p-3 text-xs leading-relaxed text-[#0B2419]/75">
                    <input
                      type="checkbox"
                      checked={formData.adPersonalizationOptIn}
                      onChange={event => setFormData({ ...formData, adPersonalizationOptIn: event.target.checked })}
                      disabled={loading}
                      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#0B2419]"
                    />
                    <span><strong className="block text-[#0B2419]">Optional: personalized product recommendations</strong>Use your product activity to tailor recommendations. Change this anytime in Profile. See the <Link to="/legal?section=privacy" target="_blank" rel="noreferrer" className="font-semibold underline">Privacy Notice</Link>.</span>
                  </label>

                  <label className="flex items-start gap-3 rounded-xl border border-[#0B2419]/10 bg-white p-3 text-xs leading-relaxed text-[#0B2419]/75">
                    <input type="checkbox" required checked={termsAccepted} onChange={event => setTermsAccepted(event.target.checked)} disabled={loading} className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#0B2419]"/>
                    <span>I agree to the <Link to="/legal?section=terms" target="_blank" rel="noreferrer" className="font-semibold underline">Conditions of Use &amp; Sale</Link> and acknowledge the <Link to="/legal?section=privacy" target="_blank" rel="noreferrer" className="font-semibold underline">Privacy Notice</Link>. Required.</span>
                  </label>

                  {registrationMethod === 'google' ? (
                    <div className="space-y-2 rounded-xl border border-[#D4AF37]/30 bg-[#FDFBF7] p-3">
                      {googleSignInError && <AlertBox type="error" msg={googleSignInError} />}
                      <GoogleSignInButton
                        onSignIn={handleGoogleRegistration}
                        onError={error => setGoogleSignInError(error.message || 'Google account creation could not be started.')}
                        disabled={loading || !termsAccepted || !formData.securityAnswer.trim() || referralPreview.loading}
                        label="Create account with Google"
                        loadingLabel="Creating account…"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center pt-1">
                        {TURNSTILE_SITE_KEY ? (
                          <Turnstile
                            ref={turnstileRef}
                            siteKey={TURNSTILE_SITE_KEY}
                            onSuccess={token => {
                              setTurnstileToken(token);
                              setError('');
                            }}
                            onExpire={() => {
                              setTurnstileToken('');
                              setError('Security verification expired. Please complete the challenge again.');
                            }}
                            onError={() => {
                              setTurnstileToken('');
                              setError('Security verification could not load. Refresh the page and try again.');
                            }}
                            options={{ theme: 'light' }}
                          />
                        ) : (
                          <p role="alert" className="text-sm text-red-600">
                            Security verification is not configured. Please contact support.
                          </p>
                        )}
                      </div>
                      <SubmitButton loading={loading} text="Create account" disabled={!turnstileToken} />
                    </>
                  )}
                </form>
              </MotionDiv>
            )}

            {view === 'OTP' && (
              <MotionDiv key="OTP" variants={viewVariants} initial="initial" animate="animate" exit="exit" className="text-center">
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
              </MotionDiv>
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
    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#0B2419]/30 group-focus-within:text-[#d4af37] transition-colors">
      {icon}
    </div>
    <input 
      required 
      {...props} 
      className="w-full bg-[#F3F9F1] border border-transparent text-[#0B2419] text-sm rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/5 transition-all disabled:opacity-50" 
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
  <MotionDiv 
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
    <span className="text-xs font-medium leading-relaxed tracking-wide w-full">{msg}</span>
  </MotionDiv>
);
