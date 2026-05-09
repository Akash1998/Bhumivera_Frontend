import React, { useState, useRef } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { adminLogin } from '../services/api'; // Ensure path is correct
import './AdminLogin.css'; // See CSS below

const WarehouseLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  
  const turnstileRef = useRef();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!turnstileToken) {
      setStatus({ type: 'error', message: 'Bot verification required.' });
      return;
    }

    setLoading(true);
    try {
      const response = await adminLogin({
        ...formData,
        turnstileToken // This matches the backend "turnstileToken" key
      });

      // Save token and redirect
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.admin));
      window.location.href = '/warehouse/dashboard';

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Authentication failed.';
      setStatus({ type: 'error', message: errorMsg });
      
      // CRITICAL: Reset the widget on failure so the user can try again
      if (turnstileRef.current) {
        turnstileRef.current.reset();
        setTurnstileToken(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="terminal-wrapper">
      <div className="terminal-card">
        <header className="terminal-header">
          <h1>ANRITVOX</h1>
          <span className="version-badge">CLOUD TERMINAL v2.5.1</span>
        </header>

        <form onSubmit={handleSubmit} className="terminal-form">
          <div className="input-group">
            <input 
              name="email"
              type="email" 
              placeholder="gk1912191999@gmail.com" 
              value={formData.email}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="input-group">
            <input 
              name="password"
              type="password" 
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" 
              value={formData.password}
              onChange={handleInputChange}
              required 
            />
          </div>

          {/* TURNSTILE WIDGET CONTAINER */}
          <div className="turnstile-container">
            <Turnstile
              ref={turnstileRef}
              siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
              onSuccess={(token) => setTurnstileToken(token)}
              onExpire={() => setTurnstileToken(null)}
              theme="light"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-access">
            {loading ? 'SYNCHRONIZING...' : 'ACCESS TERMINAL'}
          </button>

          {status.message && (
            <p className={`status-msg ${status.type}`}>
              {status.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default WarehouseLogin;
