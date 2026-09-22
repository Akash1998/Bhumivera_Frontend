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

  const validateEmail = (emailStr) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailStr);
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!validateEmail(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid admin email format.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/admin/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }) 
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to trigger OTP.');
      
      setStatus({ type: 'success', message: 'OTP successfully deployed to your email.' });
      setStep(2);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Network error triggering OTP.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (otp.length < 6) {
      setStatus({ type: 'error', message: 'OTP must be exactly 6 digits.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/admin/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid or expired OTP.');
      
      await adminOtpVerify(data);
      navigate('/admin');
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Authentication failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setOtp('');
    setStatus({ type: '', message: '' });
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <h1 className="admin-login-title">BHUMIVERA</h1>
          <span className="admin-login-badge">SECURE ADMIN PORTAL</span>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="admin-login-form">
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
              <p className="admin-login-hint">Secure payload sent to:<br/><strong>{email}</strong></p>
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
          </form>
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
