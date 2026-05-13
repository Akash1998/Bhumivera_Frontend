import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

const API = import.meta.env.VITE_API_URL || 'https://service.Bhumivera.com';

const AdminLogin = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { adminOtpVerify } = useAuth();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/admin/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStatus({ type: 'success', message: 'OTP sent! Check your email.' });
      setStep(2);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to send OTP.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/admin/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      await adminOtpVerify(data);
      navigate('/admin');
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Invalid OTP.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-box">
        <h1 className="admin-login-title">Bhumivera</h1>
        <span className="admin-login-badge">ADMIN PORTAL</span>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="admin-login-form">
            <label className="admin-login-label">ADMIN EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@Bhumivera.com"
              required
              autoComplete="email"
              aria-label="admin@Bhumivera.com"
              className="admin-login-input"
            />
            <button type="submit" disabled={loading} className="admin-login-btn">
              {loading ? 'SENDING OTP...' : 'SEND LOGIN OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="admin-login-form">
            <p className="admin-login-hint">OTP sent to {email}</p>
            <label className="admin-login-label">ENTER OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
              maxLength={6}
              required
              autoComplete="one-time-code"
              className="admin-login-input"
            />
            <button type="submit" disabled={loading} className="admin-login-btn">
              {loading ? 'VERIFYING...' : 'ACCESS ADMIN'}
            </button>
            <button
              type="button"
              className="admin-login-back"
              onClick={() => { setStep(1); setOtp(''); setStatus({ type: '', message: '' }); }}
            >
              Back
            </button>
          </form>
        )}

        {status.message && (
          <p className={`admin-login-status ${status.type}`}>{status.message}</p>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
