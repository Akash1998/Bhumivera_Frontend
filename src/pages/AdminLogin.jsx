import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fingerprint } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth as authApi, BASE_URL } from '../services/api';
import { isPasskeySupported, loginWithPasskey, registerPasskey } from '../utils/webauthnClient';
import './AdminLogin.css';

const API = BASE_URL;

const AdminLogin = () => {
  const [step, setStep] = useState(1);
  const [loginMode, setLoginMode] = useState('PASSWORD');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [authenticatorCode, setAuthenticatorCode] = useState('');
  const [twoFactorChallenge, setTwoFactorChallenge] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [showLockoutBanner, setShowLockoutBanner] = useState(false);
  const [lockoutMsg, setLockoutMsg] = useState('');
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [lockoutExpired, setLockoutExpired] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  
  const navigate = useNavigate();
  const { adminOtpVerify } = useAuth();

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
    setLockoutMsg(`Admin portal locked. Retry in ${mins}m ${secs}s or reset admin password.`);
  }, [lockoutSeconds, showLockoutBanner]);

  useEffect(() => {
    if (resendSeconds <= 0) return undefined;
    const timer = setTimeout(() => setResendSeconds(seconds => Math.max(0, seconds - 1)), 1000);
    return () => clearTimeout(timer);
  }, [resendSeconds]);

  const validateEmail = (emailStr) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailStr);
  };

  const finishAdminSignIn = async data => {
    await adminOtpVerify(data);
    try {
      const { data: passkeyData } = await authApi.listPasskeys('admin');
      if (!passkeyData.passkeys?.length) {
        setPassword('');
        setStatus({ type: 'success', message: 'Sign-in complete. Set up a passkey now or continue to the admin portal.' });
        setStep(3);
        return;
      }
    } catch (error) {
      console.error('[ADMIN_PASSKEY_LIST]', error);
    }
    navigate('/admin');
  };

  const beginTwoFactorVerification = data => {
    setTwoFactorChallenge(data.challengeToken);
    setAuthenticatorCode('');
    setStep(4);
    setStatus({ type: 'success', message: data.message || 'Enter the code from your authenticator app.' });
  };

  const handleVerifyAdminTwoFactor = async event => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const { data } = await authApi.verifyAdminTwoFactorLogin({
        challengeToken: twoFactorChallenge,
        token: authenticatorCode,
      });
      await finishAdminSignIn(data);
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || error.message || 'Could not verify authenticator code.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setStatus({ type: '', message: '' });
    if (email && !validateEmail(email)) {
      setStatus({ type: 'error', message: 'Enter a valid admin email or leave it blank to find your passkey automatically.' });
      return;
    }
    setLoading(true);
    try {
      const data = await loginWithPasskey(email, 'admin');
      if (!data?.token || !data.admin) throw new Error('Passkey sign-in did not return an admin session.');
      await finishAdminSignIn(data);
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || error.message || 'Passkey sign-in failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPasskey = async () => {
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      await registerPasskey({
        accountType: 'admin',
        name: `Admin passkey (${navigator.platform || 'Device'})`,
      });
      navigate('/admin');
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || error.message || 'Passkey setup failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setShowLockoutBanner(false);
    setLockoutExpired(false);
    setStatus({ type: '', message: '' });

    if (!validateEmail(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid admin email format.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/admin/request-otp`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.status === 423) {
        setLockoutSeconds(Math.max(0, Number(data?.secondsRemaining) || 0));
        setShowLockoutBanner(true);
        setStatus({ type: 'error', message: data.message || 'Account temporarily locked.' });
        return;
      }
      if (!res.ok) throw new Error(data.message || 'Failed to trigger OTP.');
      if (data.token) {
        await finishAdminSignIn(data);
        return;
      }
      if (data.requires2FA && data.challengeToken) {
        beginTwoFactorVerification(data);
        return;
      }
      setResendSeconds(45);
      setStatus({ type: 'success', message: 'Your email provider accepted the sign-in code request. Check your inbox and spam folder.' });
      setStep(2);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Network error triggering OTP.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setShowLockoutBanner(false);
    setLockoutExpired(false);
    setStatus({ type: '', message: '' });

    if (otp.length < 6) {
      setStatus({ type: 'error', message: 'OTP must be exactly 6 digits.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/admin/verify-otp`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (res.status === 423) {
        setLockoutSeconds(Math.max(0, Number(data?.secondsRemaining) || 0));
        setShowLockoutBanner(true);
        setStatus({ type: 'error', message: data.message || 'Account temporarily locked.' });
        return;
      }
      if (!res.ok) throw new Error(data.message || 'Invalid or expired OTP.');
      if (data.requires2FA && data.challengeToken) {
        beginTwoFactorVerification(data);
        return;
      }
      await finishAdminSignIn(data);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Authentication failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setOtp('');
    setResendSeconds(0);
    setPassword('');
    setStatus({ type: '', message: '' });
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <h1 className="admin-login-title">BHUMIVERA</h1>
          <span className="admin-login-badge">SECURE ADMIN PORTAL</span>
        </div>

        {step === 1 && (
          <div className={`mb-6 grid ${isPasskeySupported() ? 'grid-cols-2' : 'grid-cols-1'} gap-2 rounded-xl border border-white/10 bg-black/20 p-1`}>
            <button
              type="button"
              onClick={() => { setLoginMode('PASSWORD'); setStatus({ type: '', message: '' }); }}
              className={`rounded-lg px-3 py-2.5 text-xs font-bold transition-colors ${loginMode === 'PASSWORD' ? 'bg-emerald-500 text-emerald-950' : 'text-gray-300 hover:bg-white/5'}`}
            >
              PASSWORD + EMAIL CODE
            </button>
            {isPasskeySupported() && <button
              type="button"
              onClick={() => { setLoginMode('PASSKEY'); setStatus({ type: '', message: '' }); }}
              disabled={!isPasskeySupported()}
              title={isPasskeySupported() ? 'Sign in using your passkey' : 'Passkeys require a supported browser and secure website connection'}
              className={`rounded-lg px-3 py-2.5 text-xs font-bold transition-colors disabled:opacity-50 ${loginMode === 'PASSKEY' ? 'bg-emerald-500 text-emerald-950' : 'text-gray-300 hover:bg-white/5'}`}
            >
              PASSKEY
            </button>}
          </div>
        )}

        {step === 3 ? (
          <div className="admin-login-form">
            <div className="admin-login-hint">
              <h2>Enable passkey sign-in</h2>
              <p>Use your device’s fingerprint, Face ID, screen lock, or a security key the next time you sign in.</p>
            </div>
            <button type="button" disabled={loading} className="admin-login-btn" onClick={handleRegisterPasskey}>
              {loading ? 'SETTING UP PASSKEY...' : 'SET UP PASSKEY'}
            </button>
            <button type="button" disabled={loading} className="admin-login-back" onClick={() => navigate('/admin')}>
              Continue to admin portal
            </button>
          </div>
        ) : step === 4 ? (
          <form onSubmit={handleVerifyAdminTwoFactor} className="admin-login-form">
            <div className="admin-login-hint">
              <h2>Authenticator verification</h2>
              <p>Enter the current 6-digit code from your authenticator app to finish signing in.</p>
            </div>
            <div className="form-group">
              <label className="admin-login-label" htmlFor="admin-authenticator-code">AUTHENTICATOR CODE</label>
              <input
                id="admin-authenticator-code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                value={authenticatorCode}
                onChange={event => setAuthenticatorCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                autoComplete="one-time-code"
                required
                className="admin-login-input text-center tracking-widest"
              />
            </div>
            <button type="submit" disabled={loading || authenticatorCode.length !== 6} className="admin-login-btn">
              {loading ? 'VERIFYING CODE...' : 'VERIFY & CONTINUE'}
            </button>
            <button
              type="button"
              className="admin-login-back"
              disabled={loading}
              onClick={() => {
                setStep(1);
                setLoginMode('PASSWORD');
                setTwoFactorChallenge('');
                setAuthenticatorCode('');
                setStatus({ type: '', message: '' });
              }}
            >
              Return to sign in
            </button>
          </form>
        ) : step === 1 && loginMode === 'PASSKEY' ? (
          <div className="admin-login-form">
            <div className="admin-login-hint">
              <h2>Passkey sign-in</h2>
              <p>Continue with Windows Hello, Face ID, your device PIN, or a security key. You do not need to enter a password.</p>
            </div>
            <div className="form-group">
              <label className="admin-login-label">ADMIN EMAIL (OPTIONAL)</label>
              <input
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="Leave blank to find passkey automatically"
                autoComplete="username webauthn"
                className="admin-login-input"
              />
            </div>
            <button type="button" disabled={loading} className="admin-login-btn" onClick={handlePasskeyLogin}>
              <Fingerprint size={18} className="inline mr-2" aria-hidden="true" />
              {loading ? 'VERIFYING PASSKEY...' : 'SIGN IN WITH PASSKEY'}
            </button>
          </div>
        ) : step === 1 ? (
          <form onSubmit={handleRequestOtp} className="admin-login-form">
            <div className="form-group">
              <label className="admin-login-label">ADMIN PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your admin password"
                required
                autoComplete="current-password"
                className="admin-login-input"
              />
            </div>
            <div className="form-group">
              <label className="admin-login-label">AUTHORIZED EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bhumivera.com"
                required
                autoComplete="email"
                className="admin-login-input"
              />
            </div>

            <button type="submit" disabled={loading} className="admin-login-btn">
              {loading ? 'DEPLOYING OTP...' : 'REQUEST SECURE ACCESS'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="admin-login-form">
            <div className="form-group">
              <p className="admin-login-hint">Sign-in code requested for:<br/><strong>{email}</strong></p>
              <label className="admin-login-label">AUTHORIZATION CODE</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Force numeric only
                placeholder="000000"
                maxLength={6}
                required
                autoComplete="one-time-code"
                className="admin-login-input text-center tracking-widest"
              />
            </div>

            <button type="submit" disabled={loading || otp.length !== 6} className="admin-login-btn">
              {loading ? 'VERIFYING IDENTITY...' : 'CONFIRM & AUTHENTICATE'}
            </button>
            
            <button
              type="button"
              className="admin-login-back"
              onClick={handleBack}
              disabled={loading}
            >
              ← Return to Email Entry
            </button>

            <button
              type="button"
              className="admin-login-back"
              onClick={() => handleRequestOtp({ preventDefault: () => {} })}
              disabled={loading || resendSeconds > 0}
            >
              {resendSeconds > 0 ? `Resend code in ${resendSeconds}s` : 'Resend sign-in code'}
            </button>

            <div className="mt-4 text-center">
              <Link to="/admin/forgot-password" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">
                Forgot admin password?
              </Link>
            </div>

            {showLockoutBanner && (
              <div className={`mt-4 p-3 border rounded-lg text-xs ${lockoutExpired ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <div className={`font-semibold mb-1.5 ${lockoutExpired ? 'text-emerald-300' : 'text-red-400'}`}>{lockoutExpired ? '✓' : '🔒'} {lockoutMsg}</div>
                <Link to="/admin/forgot-password" className="text-cyan-400 font-bold hover:underline">
                  Reset admin password →
                </Link>
              </div>
            )}
          </form>
        )}

        {showLockoutBanner && step === 1 && (
          <div className={`mt-4 p-3 border rounded-lg text-xs ${lockoutExpired ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <div className={`font-semibold mb-1.5 ${lockoutExpired ? 'text-emerald-300' : 'text-red-400'}`}>{lockoutExpired ? '✓' : '🔒'} {lockoutMsg}</div>
            <Link to="/admin/forgot-password" className="text-cyan-400 font-bold hover:underline">
              Reset admin password →
            </Link>
          </div>
        )}

        {status.message && (
          <div className={`admin-login-status ${status.type}`}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
