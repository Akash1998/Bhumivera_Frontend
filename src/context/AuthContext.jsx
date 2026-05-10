import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth as authApi, users as usersApi } from '../services/api';

const AuthContext = createContext(null);

const decodeJWT = t => { try { return JSON.parse(window.atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))); } catch (e) { return null; } };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => { const s = localStorage.getItem('user'); return s ? JSON.parse(s) : null; });
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const t = localStorage.getItem('token');
      if (t) {
        try {
          const d = decodeJWT(t);
          const suRaw = localStorage.getItem('user');
          const su = suRaw ? JSON.parse(suRaw) : {};
          const r = d?.role || su?.role || 'user';
          let fu;
          if (r === 'admin' || r === 'superadmin') fu = (await authApi.getAdminProfile()).data;
          else if (r === 'warehouse_admin') fu = su?.role === 'warehouse_admin' ? su : { role: 'warehouse_admin' };
          else fu = (await usersApi.getProfile()).data?.user || (await usersApi.getProfile()).data;
          const f = { ...fu, role: r };
          setUser(f);
          localStorage.setItem('user', JSON.stringify(f));
          setToken(t);
        } catch (e) {
          const su = JSON.parse(localStorage.getItem('user') || '{}');
          if (su?.role === 'warehouse_admin') { setUser(su); setToken(t); } else logout();
        }
      }
      setLoading(false);
    };
    initAuth();
    const he = () => logout();
    window.addEventListener('auth-expired', he);
    return () => window.removeEventListener('auth-expired', he);
  }, []);

  const login = async c => { const r = await authApi.login(c); if (r.status === 202 || r.data?.requires2FA) throw new Error("MFA Verification Required"); const { token: nt, user: ud } = r.data; const d = decodeJWT(nt); const f = { ...ud, role: d?.role || ud?.role || 'user' }; localStorage.setItem('token', nt); localStorage.setItem('user', JSON.stringify(f)); setToken(nt); setUser(f); return f; };
  const mobileLogin = async d => { const r = await authApi.mobileLoginVerify(d); const { token: nt, user: ud } = r.data; const p = decodeJWT(nt); const f = { ...ud, role: p?.role || ud?.role || 'user' }; localStorage.setItem('token', nt); localStorage.setItem('user', JSON.stringify(f)); setToken(nt); setUser(f); return f; };
  const adminLogin = async c => { const r = await authApi.adminLogin(c); const { token: nt, admin: ad } = r.data; const f = { ...ad, role: 'admin' }; localStorage.setItem('token', nt); setToken(nt); setUser(f); return f; };
  const adminOtpVerify = async d => { const f = { ...d.admin, role: d.admin.role || 'admin' }; localStorage.setItem('token', d.token); localStorage.setItem('user', JSON.stringify(f)); setToken(d.token); setUser(f); return f; };
  const warehouseLoginVerify = d => { const p = d.admin || d.user || d; const f = { ...p, role: p.role || 'warehouse_admin' }; const t = d.token || d.warehouseToken || d.ms_token; localStorage.setItem('token', t); localStorage.setItem('user', JSON.stringify(f)); setToken(t); setUser(f); return f; };
  const register = async d => (await authApi.register(d)).data;
  const verifyEmail = async dt => { const r = await authApi.verifyEmail(dt); const { token: nt, user: ud } = r.data; const d = decodeJWT(nt); const f = { ...ud, role: d?.role || ud?.role || 'user' }; localStorage.setItem('token', nt); localStorage.setItem('user', JSON.stringify(f)); setToken(nt); setUser(f); return f; };
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setToken(null); setUser(null); if ((window.location.pathname.includes('/admin') && !window.location.pathname.includes('/warehouseadmin')) || window.location.pathname.includes('/profile')) window.location.href = '/login'; };

  return <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, mobileLogin, adminLogin, adminOtpVerify, warehouseLoginVerify, register, verifyEmail, logout }}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
