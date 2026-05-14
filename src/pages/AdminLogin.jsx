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
      const data
