import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth as authApi, users as usersApi } from '../services/api';

const AuthContext = createContext(null);
const decodeJWT = t => { try { return JSON.parse(window.atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))); } catch { return null; } };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => { const s = localStorage.getItem('user'); return s ? JSON.parse(s) : null; });
  const [token, setToken] = useState(localStorage.getItem('token') || localStorage.getItem('adminToken') || localStorage.getItem('warehouseToken') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const customerToken = localStorage.getItem('token');
      const adminToken = localStorage.getItem('adminToken');
      const warehouseToken = localStorage.getItem('warehouseToken');
      const wp = window.location.pathname.startsWith('/warehouse');
      if (wp) {
        const t = warehouseToken || customerToken;
        if (t) { setToken(t); setUser(JSON.parse(localStorage.getItem('user') || '{"role":"warehouse_admin"}')); }
        setLoading(false); return;
      }
      const anyT = customerToken || adminToken || warehouseToken;
      if (anyT) {
        let role = 'user';
        try {
          const d = decodeJWT(anyT); const su = JSON.parse(localStorage.getItem('user') || '{}'); role = d?.role || su?.role || 'user';
          let fu = su;
          if (role === 'admin' || role === 'superadmin') {
            try {
              fu = (await authApi.getAdminProfile()).data;
            } catch { fu = su; }
          } else if (role !== 'warehouse_admin') {
            try {
              fu = (await usersApi.getProfile()).data?.user || (await usersApi.getProfile()).data;
            } catch { fu = su; }
          }
          const f = { ...fu, role };
          setUser(f);
          if (role === 'admin' || role === 'superadmin') {
            localStorage.setItem('adminToken', anyT);
          } else if (!customerToken && !warehouseToken) {
            localStorage.setItem('token', anyT);
          }
          localStorage.setItem('user', JSON.stringify(f));
          setToken(anyT);
        } catch {
          logout(role === 'admin' || role === 'superadmin' ? 'admin' : 'customer');
        }
      }
      setLoading(false);
    };
    initAuth();
    const handleCustomerExpiry = () => logout('customer');
    const handleAdminExpiry = () => logout('admin');
    window.addEventListener('auth-expired', handleCustomerExpiry);
    window.addEventListener('admin-auth-expired', handleAdminExpiry);
    return () => {
      window.removeEventListener('auth-expired', handleCustomerExpiry);
      window.removeEventListener('admin-auth-expired', handleAdminExpiry);
    };
  }, []);

  const login = async c => { const r = await authApi.login(c); if (r.status === 202 || r.data?.requires2FA) throw new Error("MFA Verification Required"); const { token: nt, user: ud } = r.data; const d = decodeJWT(nt); const role = d?.role || ud?.role || 'user'; const f = { ...ud, role }; localStorage.setItem('token', nt); localStorage.setItem('user', JSON.stringify(f)); setToken(nt); setUser(f); return f; };
  const mobileLogin = async d => { const r = await authApi.mobileLoginVerify(d); const { token: nt, user: ud } = r.data; const p = decodeJWT(nt); const f = { ...ud, role: p?.role || ud?.role || 'user' }; localStorage.setItem('token', nt); localStorage.setItem('user', JSON.stringify(f)); setToken(nt); setUser(f); return f; };
  const adminLogin = async c => { const r = await authApi.adminLogin(c); const { token: nt, admin: ad } = r.data; const f = { ...ad, role: ad?.role || 'admin' }; localStorage.setItem('adminToken', nt); localStorage.setItem('user', JSON.stringify(f)); setToken(nt); setUser(f); return f; };
  const adminOtpVerify = async d => { const f = { ...d.admin, role: d.admin.role || 'admin' }; localStorage.setItem('adminToken', d.token); localStorage.setItem('user', JSON.stringify(f)); setToken(d.token); setUser(f); return f; };
  const warehouseLoginVerify = d => { const p = d.admin || d.user || d; const f = { ...p, role: p.role || 'warehouse_admin' }; const t = d.token || d.warehouseToken || d.ms_token; localStorage.setItem('warehouseToken', t); localStorage.removeItem('token'); localStorage.setItem('user', JSON.stringify(f)); setToken(t); setUser(f); return f; };
  const register = async d => (await authApi.register(d)).data;
  const verifyEmail = async dt => { const r = await authApi.verifyEmail(dt); const { token: nt, user: ud } = r.data; const d = decodeJWT(nt); const f = { ...ud, role: d?.role || ud?.role || 'user' }; localStorage.setItem('token', nt); localStorage.setItem('user', JSON.stringify(f)); setToken(nt); setUser(f); return f; };
  const logout = (scope) => {
    if (window.location.pathname.startsWith('/warehouse') && scope !== 'warehouse') return;
    const isAdminPath = window.location.pathname.includes('/admin');
    if (scope === 'admin' || isAdminPath) {
      localStorage.removeItem('adminToken');
      setToken(null); setUser(null);
      if (isAdminPath) window.location.href = '/admin/login';
      return;
    }
    if (scope === 'warehouse') {
      localStorage.removeItem('warehouseToken');
      setToken(null); setUser(null);
      return;
    }
    ['token', 'ms_token', 'user'].forEach(k => localStorage.removeItem(k));
    setToken(null); setUser(null);
  };

  return <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, mobileLogin, adminLogin, adminOtpVerify, warehouseLoginVerify, register, verifyEmail, logout }}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
