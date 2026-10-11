import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { auth as authApi, users as usersApi } from '../services/api';

const AuthContext = createContext(null);
const decodeJWT = t => { try { return JSON.parse(window.atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))); } catch (e) { return null; } };
const getStoredUser = (key = 'user') => {
  try {
    const rawUser = localStorage.getItem(key);
    return rawUser ? JSON.parse(rawUser) : null;
  } catch (error) {
    console.error('[AUTH_STORED_USER_PARSE]', error);
    localStorage.removeItem(key);
    return null;
  }
};
const getStoredAdminUser = () => {
  const adminUser = getStoredUser('adminUser');
  if (adminUser) return adminUser;
  const storedUser = getStoredUser();
  if (['admin', 'superadmin'].includes(storedUser?.role)) return storedUser;
  const claims = decodeJWT(localStorage.getItem('adminToken'));
  return ['admin', 'superadmin'].includes(claims?.role) ? claims : null;
};
const storeAdminUser = user => {
  localStorage.setItem('adminUser', JSON.stringify(user));
  localStorage.setItem('user', JSON.stringify(user));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => (
    localStorage.getItem('token') || localStorage.getItem('adminToken') || localStorage.getItem('warehouseToken')
      ? getStoredUser()
      : null
  ));
  const [token, setToken] = useState(localStorage.getItem('token') || localStorage.getItem('adminToken') || localStorage.getItem('warehouseToken') || null);
  const [loading, setLoading] = useState(true);
  const authExpiryHandled = useRef(false);

  useEffect(() => {
    const initAuth = async () => {
      const customerToken = localStorage.getItem('token');
      const adminToken = localStorage.getItem('adminToken');
      const warehouseToken = localStorage.getItem('warehouseToken');
      const wp = window.location.pathname.startsWith('/warehouse');
      const adminPath = window.location.pathname.startsWith('/admin');
      if (wp) {
        const t = warehouseToken || customerToken;
        if (t) { setToken(t); setUser(getStoredUser() || { role: 'warehouse_admin' }); }
        else { setToken(null); setUser(null); }
        setLoading(false); return;
      }
      const customerRole = decodeJWT(customerToken)?.role;
      const anyT = adminPath
        ? adminToken || (['admin', 'superadmin'].includes(customerRole) ? customerToken : null)
        : customerToken || warehouseToken;
      if (anyT) {
        let role = 'user';
        let storedUser = {};
        try {
          const d = decodeJWT(anyT); role = d?.role || storedUser?.role || 'user';
          storedUser = (role === 'admin' || role === 'superadmin' ? getStoredAdminUser() : getStoredUser()) || {};
          let fu = storedUser;
          if (role === 'admin' || role === 'superadmin') {
            fu = (await authApi.getAdminProfile()).data;
          } else if (role !== 'warehouse_admin') {
            try {
              const profile = await usersApi.getProfile();
              fu = profile.data?.user || profile.data;
            } catch (error) {
              if (error.response?.status === 401) throw error;
              console.error('[AUTH_PROFILE_RESTORE]', error);
              fu = storedUser;
            }
          }
          const f = { ...fu, role };
          setUser(f);
          if (role === 'admin' || role === 'superadmin') {
            const currentAdminToken = localStorage.getItem('adminToken') || anyT;
            localStorage.setItem('adminToken', currentAdminToken);
            storeAdminUser(f);
            setToken(currentAdminToken);
          } else {
            setToken(anyT);
          }
          localStorage.setItem('user', JSON.stringify(f));
        } catch (error) {
          if (role === 'admin' || role === 'superadmin') {
            if ([401, 403].includes(error.response?.status)) {
              void logout('admin');
            } else {
              console.error('[ADMIN_PROFILE_RESTORE]', error);
              const claims = decodeJWT(localStorage.getItem('adminToken') || anyT) || {};
              const adminUser = getStoredAdminUser();
              const restoredUser = adminUser && Object.keys(adminUser).length
                ? { ...adminUser, role }
                : { id: claims.id, email: claims.email, role };
              const currentAdminToken = localStorage.getItem('adminToken') || anyT;
              localStorage.setItem('adminToken', currentAdminToken);
              storeAdminUser(restoredUser);
              setUser(restoredUser);
              setToken(currentAdminToken);
            }
          } else {
            void logout('customer');
          }
        }
      }
      setLoading(false);
    };
    initAuth();
    const he = () => {
      if (authExpiryHandled.current) return;
      authExpiryHandled.current = true;
      void logout('customer');
    };
    const adminExpired = () => void logout('admin');
    window.addEventListener('auth-expired', he);
    window.addEventListener('admin-auth-expired', adminExpired);
    return () => {
      window.removeEventListener('auth-expired', he);
      window.removeEventListener('admin-auth-expired', adminExpired);
    };
  }, []);

  const login = async c => {
    const r = await authApi.login(c);
    if (r.status === 202 || r.data?.requires2FA) return r;
    const { token: nt, user: ud } = r.data;
    const d = decodeJWT(nt);
    const role = d?.role || ud?.role || 'user';
    const f = { ...ud, role };
    authExpiryHandled.current = false;
    localStorage.setItem('token', nt);
    localStorage.setItem('user', JSON.stringify(f));
    setToken(nt);
    setUser(f);
    return r;
  };
  const mobileLogin = async d => { const r = await authApi.mobileLoginVerify(d); const { token: nt, user: ud } = r.data; const p = decodeJWT(nt); const f = { ...ud, role: p?.role || ud?.role || 'user' }; localStorage.setItem('token', nt); localStorage.setItem('user', JSON.stringify(f)); setToken(nt); setUser(f); return f; };
  const adminLogin = async c => { const r = await authApi.adminLogin(c); if (!r.data?.token) throw new Error(r.data?.message || 'Email verification is required for this browser.'); const { token: nt, admin: ad } = r.data; const f = { ...ad, role: ad?.role || 'admin' }; authExpiryHandled.current = false; localStorage.setItem('adminToken', nt); localStorage.setItem('adminLastActivity', String(Date.now())); storeAdminUser(f); setToken(nt); setUser(f); return f; };
  const adminOtpVerify = async d => {
    const adminData = d?.admin || d?.user || {};
    const f = { ...adminData, role: adminData.role || 'admin' };
    localStorage.setItem('adminToken', d.token);
    localStorage.setItem('adminLastActivity', String(Date.now()));
    storeAdminUser(f);
    setToken(d.token);
    setUser(f);
    return f;
  };
  const warehouseLoginVerify = d => { const p = d.admin || d.user || d; const f = { ...p, role: p.role || 'warehouse_admin' }; const t = d.token || d.warehouseToken || d.ms_token; localStorage.setItem('warehouseToken', t); localStorage.setItem('token', t); localStorage.setItem('user', JSON.stringify(f)); setToken(t); setUser(f); return f; };
  const register = async d => (await authApi.register(d)).data;
  const verifyEmail = async dt => { const r = await authApi.verifyEmail(dt); const { token: nt, user: ud } = r.data; const d = decodeJWT(nt); const f = { ...ud, role: d?.role || ud?.role || 'user' }; localStorage.setItem('token', nt); localStorage.setItem('user', JSON.stringify(f)); setToken(nt); setUser(f); return f; };
  const logout = async (scope) => {
    if (window.location.pathname.startsWith('/warehouse')) return;
    const isAdminPath = window.location.pathname.includes('/admin');
    const isAdminLogout = scope === 'admin' || (!scope && isAdminPath);
    const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT')), 300));
    try {
      const serverFn = isAdminLogout ? authApi.adminLogout : authApi.logout;
      await Promise.race([serverFn().catch(() => null), timeout]).catch(() => null);
    } catch (_) { }
    if (isAdminLogout) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminLastActivity');
      localStorage.removeItem('adminUser');
      setToken(null); setUser(null);
      if (isAdminPath) window.location.href = '/admin/login';
      return;
    }
    localStorage.removeItem('token');
    localStorage.removeItem('ms_token');
    const adminToken = localStorage.getItem('adminToken');
    const adminClaims = decodeJWT(adminToken);
    if (adminToken && ['admin', 'superadmin'].includes(adminClaims?.role)) {
      const adminUser = getStoredAdminUser() || adminClaims;
      storeAdminUser(adminUser);
      setToken(adminToken);
      setUser(adminUser);
      return;
    }
    localStorage.removeItem('user');
    setToken(null); setUser(null);
  };

  useEffect(() => {
    if (!['admin', 'superadmin'].includes(user?.role) || !localStorage.getItem('adminToken')) return undefined;

    const idleLimitMs = 24 * 60 * 60 * 1000;
    let lastActivity = Number(localStorage.getItem('adminLastActivity')) || Date.now();
    let timeout;
    if (!localStorage.getItem('adminLastActivity')) {
      localStorage.setItem('adminLastActivity', String(lastActivity));
    }

    const scheduleLogout = () => {
      clearTimeout(timeout);
      const remainingMs = idleLimitMs - (Date.now() - lastActivity);
      if (remainingMs <= 0) {
        window.dispatchEvent(new Event('admin-auth-expired'));
        return;
      }
      timeout = setTimeout(scheduleLogout, remainingMs);
    };
    const recordActivity = () => {
      lastActivity = Date.now();
      localStorage.setItem('adminLastActivity', String(lastActivity));
      scheduleLogout();
    };
    const syncActivity = event => {
      if (event.key !== 'adminLastActivity' || !event.newValue) return;
      lastActivity = Number(event.newValue) || lastActivity;
      scheduleLogout();
    };
    const recordVisibleActivity = () => {
      if (document.visibilityState === 'visible') recordActivity();
    };

    ['pointerdown', 'keydown', 'scroll', 'touchstart', 'focus'].forEach(eventName => {
      window.addEventListener(eventName, recordActivity, { passive: true });
    });
    document.addEventListener('visibilitychange', recordVisibleActivity);
    window.addEventListener('storage', syncActivity);
    scheduleLogout();
    return () => {
      clearTimeout(timeout);
      ['pointerdown', 'keydown', 'scroll', 'touchstart', 'focus'].forEach(eventName => {
        window.removeEventListener(eventName, recordActivity);
      });
      document.removeEventListener('visibilitychange', recordVisibleActivity);
      window.removeEventListener('storage', syncActivity);
    };
  }, [user?.role, token]);

  return <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, mobileLogin, adminLogin, adminOtpVerify, warehouseLoginVerify, register, verifyEmail, logout }}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
