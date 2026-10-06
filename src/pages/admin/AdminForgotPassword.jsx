import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../services/api';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, Terminal, CheckCircle2 } from 'lucide-react';

export default function AdminForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminResetJwt, setAdminResetJwt] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) { toast.error('Please enter your admin email'); return; }
    setLoading(true);
    try {
      await auth.adminForgotPassword({ email });
      toast.success('Admin reset OTP sent to your email');
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
      const res = await auth.adminVerifyResetOtp({ email, otp });
      if (res.data?.resetJwt) {
        setAdminResetJwt(res.data.resetJwt);
      } else if (res.data?.data?.resetJwt) {
        setAdminResetJwt(res.data.data.resetJwt);
      }
      toast.success('OTP verified. Set your new admin password.');
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
      await auth.adminResetPasswordBearer(adminResetJwt, newPassword);
      setResetSuccess(true);
      toast.success('Admin password reset successfully! Redirecting you to admin login in 3s…');
      setTimeout(() => navigate('/admin/login'), 2500);
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
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400 opacity-5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-6">
          <Link to="/admin/login" className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to admin login
          </Link>
        </div>

        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 mb-4 border border-cyan-500/20">
            <Terminal className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {step === 1 && 'Admin Password Recovery'}
            {step === 2 && 'Verify Authorization Code'}
            {step === 3 && 'Set New Admin Password'}
          </h1>
          <p className="text-sm text-slate-400 mt-2 font-mono">
            {step === 1 && 'SECURE_CHAN::INIT — Enter admin email for one-time authorization.'}
            {step === 2 && `SECURE_CHAN::OTP — Enter 6-digit code sent to ${email}.`}
            {step === 3 && 'SECURE_CHAN::RESET — Set a strong 12+ char admin password.'}
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${s === step ? 'w-10 bg-cyan-400' : s < step ? 'w-10 bg-cyan-600' : 'w-5 bg-slate-700'}`} />
          ))}
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 p-8">
          {step === 1 && (
            <form onSubmit={handleSubmitEmail} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-[0.2em] mb-2">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@bhumivera.com"
                    className="w-full pl-11 pr-4 py-3 bg-[#0f1419] border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
                    disabled={loading}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <ShieldCheck className="w-4 h-4" />
                {loading ? 'DEPLOYING OTP…' : 'REQUEST AUTHORIZATION OTP'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmitOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-[0.2em] mb-2">Authorization Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3.5 bg-[#0f1419] border border-slate-700 rounded-lg text-center text-white text-2xl font-mono tracking-[0.5em] placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                  disabled={loading}
                  autoComplete="one-time-code"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3.5 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors disabled:opacity-60"
              >
                {loading ? 'VERIFYING…' : 'VERIFY AUTHORIZATION'}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-slate-500 hover:text-cyan-400 font-medium"
                >
                  ← Change email address
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-5">
              {resetSuccess && (
                <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400"/>
                  <div>
                    <div className="font-semibold text-emerald-200">✅ Admin password reset successfully!</div>
                    <div className="text-sm text-emerald-400 mt-0.5">Redirecting you to admin login in 3s…</div>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmitNewPw} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-[0.2em] mb-2">New Admin Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 12 characters"
                    className="w-full pl-11 pr-11 py-3 bg-[#0f1419] border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
                    disabled={loading}
                    autoComplete="new-password"
                    required
                  />
                  <button type="button" onClick={() => setShowNewPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-[0.2em] mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showConfirmPw ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-11 pr-11 py-3 bg-[#0f1419] border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
                    disabled={loading}
                    autoComplete="new-password"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold hover:from-cyan-400 hover:to-emerald-400 transition-all disabled:opacity-60"
              >
                {loading ? 'RESETTING…' : 'CONFIRM ADMIN PASSWORD RESET'}
              </button>
            </form>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-600 mt-6 leading-relaxed font-mono">
          SYS::ADMIN_RECOVERY — Reset JWT stored in volatile memory only. Session expires T+5min.
        </p>
      </div>
    </div>
  );
}
