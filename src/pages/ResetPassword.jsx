import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '../services/api';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Leaf, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const emailFromLink = params.get('email');
  const modeFromLink = params.get('mode');

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetJwt, setResetJwt] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (modeFromLink === 'email' && emailFromLink) {
      setEmail(emailFromLink);
      setStep(2);
      toast('Enter the OTP sent to your email');
    }
  }, [modeFromLink, emailFromLink]);

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) { toast.error('Please enter your email'); return; }
    setLoading(true);
    try {
      await auth.requestPasswordReset({ email });
      toast.success('OTP sent to your email');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 6) { toast.error('Please enter a 6-digit OTP'); return; }
    setLoading(true);
    try {
      const res = await auth.verifyPremiumResetOtp({ email, otp });
      if (res.data?.resetJwt) {
        setResetJwt(res.data.resetJwt);
      } else if (res.data?.data?.resetJwt) {
        setResetJwt(res.data.data.resetJwt);
      }
      toast.success('OTP verified. Please set your new password.');
      setStep(3);
    } catch (err) {
      if (err.response?.status === 400) toast.error(err.response?.data?.message || 'Invalid OTP');
      else toast.error(err.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNewPw = async (e) => {
    e.preventDefault();
    if (newPassword.length < 12) { toast.error('Password must be at least 12 characters'); return; }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await auth.resetPasswordBearer(resetJwt, newPassword);
      setResetSuccess(true);
      toast.success('Password reset successfully! Redirecting you to login in 3s…');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      const d = err.response?.data;
      if (d?.code === 'MIN_LENGTH') toast.error(d.message);
      else if (d?.code === 'COMPLEXITY') toast.error(d.message);
      else if (d?.code === 'COMMON_PASSWORD') toast.error(d.message);
      else if (d?.code === 'PWNED_PASSWORD') toast.error(d.message);
      else if (d?.code === 'PASSWORD_REUSED') toast.error(d.message);
      else toast.error(d?.message || err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#0B2419] opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4AF37] opacity-5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-6">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-[#8B5A2B] hover:text-[#0B2419] font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>

        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0B2419]/8 mb-4">
            <Leaf className="w-8 h-8 text-[#0B2419]" />
          </div>
          <h1 className="text-2xl font-bold text-[#0B2419] tracking-tight">
            {step === 1 && 'Reset your password'}
            {step === 2 && 'Verify your email'}
            {step === 3 && 'Set new password'}
          </h1>
          <p className="text-sm text-stone-500 mt-2">
            {step === 1 && "Enter the email linked to your account and we'll send a one-time code."}
            {step === 2 && `Enter the 6-digit code sent to ${email}.`}
            {step === 3 && 'Choose a strong password at least 12 characters long.'}
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${s === step ? 'w-10 bg-[#D4AF37]' : s < step ? 'w-10 bg-[#8B9D83]' : 'w-5 bg-stone-200'}`} />
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_32px_rgba(11,36,25,0.06)] border border-[#0B2419]/5 p-8">
          {step === 1 && (
            <form onSubmit={handleSubmitEmail} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#0B2419] uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-stone-200 rounded-xl text-[#0B2419] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37]/60 focus:ring-2 focus:ring-[#D4AF37]/15 transition-all"
                    disabled={loading}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#0B2419] text-[#FDFBF7] font-semibold hover:bg-[#1e4031] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <ShieldCheck className="w-4 h-4" />
                {loading ? 'Sending code…' : 'Send Verification Code'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmitOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#0B2419] uppercase tracking-wider mb-2">6-Digit Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-center text-[#0B2419] text-2xl font-mono tracking-[0.5em] placeholder:text-stone-300 focus:outline-none focus:border-[#D4AF37]/60 focus:ring-2 focus:ring-[#D4AF37]/15 transition-all"
                  disabled={loading}
                  autoComplete="one-time-code"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3.5 rounded-xl bg-[#0B2419] text-[#FDFBF7] font-semibold hover:bg-[#1e4031] transition-colors disabled:opacity-60"
              >
                {loading ? 'Verifying…' : 'Verify Code'}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-stone-500 hover:text-[#8B5A2B] font-medium"
                >
                  Wrong email? Go back
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-5">
              {resetSuccess && (
                <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5"/>
                  <div>
                    <div className="font-semibold">✅ Password reset successfully!</div>
                    <div className="text-sm text-emerald-700 mt-0.5">Redirecting you to login in 3s…</div>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmitNewPw} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#0B2419] uppercase tracking-wider mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 12 characters"
                    className="w-full pl-11 pr-11 py-3 bg-[#FAF8F5] border border-stone-200 rounded-xl text-[#0B2419] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37]/60 focus:ring-2 focus:ring-[#D4AF37]/15 transition-all"
                    disabled={loading}
                    autoComplete="new-password"
                    required
                  />
                  <button type="button" onClick={() => setShowNewPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                    {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0B2419] uppercase tracking-wider mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type={showConfirmPw ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-11 pr-11 py-3 bg-[#FAF8F5] border border-stone-200 rounded-xl text-[#0B2419] placeholder:text-stone-400 focus:outline-none focus:border-[#D4AF37]/60 focus:ring-2 focus:ring-[#D4AF37]/15 transition-all"
                    disabled={loading}
                    autoComplete="new-password"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                    {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#D4AF37] text-[#0B2419] font-bold hover:bg-[#e4c255] transition-colors disabled:opacity-60"
              >
                {loading ? 'Resetting…' : 'Reset Password'}
              </button>
            </form>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-stone-400 mt-6 leading-relaxed">
          Protected by Bhumivera security. Your reset token expires in 5 minutes and is never stored on your device.
        </p>
      </div>
    </div>
  );
}
