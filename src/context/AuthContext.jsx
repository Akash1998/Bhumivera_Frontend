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
  const claims = decodeJWT(localStorage.getItem('adminToken'));
  return ['admin', 'superadmin'].includes(claims?.role) ? claims : null;
};
const getStoredCustomerUser = () => {
  const storedUser = getStoredUser('user');
  if (['admin', 'superadmin', 'warehouse_admin'].includes(storedUser?.role)) {
    // Purge corrupted admin user from customer storage so it never leaks to storefront
    localStorage.removeItem('user');
    return null;
  }
  return storedUser;
};
const storeAdminUser = user => {
  localStorage.setItem('adminUser', JSON.stringify(user));
  // Only write to 'user' key if currently on an admin path
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
    const isWarehousePath = typeof window !== 'undefined' && window.location.pathname.startsWith('/warehouse');
    if (isAdminPath) {
      return getStoredAdminUser();
    }
    if (isWarehousePath) {
      return getStoredUser('warehouseUser') || getStoredUser('user');
    }
    const customerToken = localStorage.getItem('token') || localStorage.getItem('ms_token');
    if (!customerToken) return null;
    const claims = decodeJWT(customerToken);
    if (claims && ['admin', 'superadmin', 'warehouse_admin'].includes(claims.role)) {
      return null;
    }
    return getStoredCustomerUser();
  });

  const [token, setToken] = useState(() => {
    const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
    const isWarehousePath = typeof window !== 'undefined' && window.location.pathname.startsWith('/warehouse');
    if (isAdminPath) {
      return localStorage.getItem('adminToken');
    }
    if (isWarehousePath) {
      return localStorage.getItem('warehouseToken') || localStorage.getItem('token');
    }
    const customerToken = localStorage.getItem('token') || localStorage.getItem('ms_token');
    if (!customerToken) return null;
    const claims = decodeJWT(customerToken);
    if (claims && ['admin', 'superadmin', 'warehouse_admin'].includes(claims.role)) {
      return null;
    }
    return customerToken;
  });

  const [loading, setLoading] = useState(true);
  const authExpiryHandled = useRef(false);

  useEffect(() => {
    const initAuth = async () => {
      const customerToken = localStorage.getItem('token');
      const adminToken = localStorage.getItem('adminToken');
      const warehouseToken = localStorage.getItem('warehouseToken');
      const wp = window.location.pathname.startsWith('/warehouse');
      const adminPath = window.location.pathname.startsWith('/admin');

      if (adminPath) {
        if (adminToken) {
          const claims = decodeJWT(adminToken);
          if (['admin', 'superadmin'].includes(claims?.role)) {
            let adminProfile = getStoredAdminUser() || claims;
            try {
              const res = await authApi.getAdminProfile();
              if (res.data) adminProfile = { ...res.data, role: claims.role };
            } catch (err) {
              if ([401, 403].includes(err.response?.status)) {
                await logout('admin');
                setLoading(false);
                return;
              }
            }
            storeAdminUser(adminProfile);
            setToken(adminToken);
            setUser(adminProfile);
            setLoading(false);
            return;
          }
        }
        setToken(null);
        setUser(null);
        setLoading(false);
        return;
      }

      if (wp) {
        const t = warehouseToken || customerToken;
        if (t) {
          setToken(t);
          setUser(getStoredUser('warehouseUser') || getStoredUser('user') || { role: 'warehouse_admin' });
        } else {
          setToken(null);
          setUser(null);
        }
        setLoading(false);
        return;
      }

      // Customer storefront
      if (customerToken) {
        const claims = decodeJWT(customerToken);
        if (claims && !['admin', 'superadmin', 'warehouse_admin'].includes(claims.role)) {
          let customerUser = getStoredCustomerUser() || claims;
          try {
            const profile = await usersApi.getProfile();
            const liveUser = profile.data?.user || profile.data;
            if (liveUser && typeof liveUser === 'object') {
              customerUser = { ...liveUser, role: claims.role || 'customer' };
              localStorage.setItem('user', JSON.stringify(customerUser));
            }
          } catch (error) {
            if (error.response?.status === 401) {
              await logout('customer');
              setLoading(false);
              return;
            }
          }
          setToken(customerToken);
          setUser(customerUser);
          setLoading(false);
          return;
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

      // Guest visitor on storefront: clean any residual admin user in 'user'
      getStoredCustomerUser();
      setToken(null);
      setUser(null);
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

  const completeLogin = data => {
    const { token: nt, user: ud } = data || {};
    if (!nt) throw new Error('Sign-in did not return a valid session.');
    const d = decodeJWT(nt);
    const role = d?.role || ud?.role || 'user';
    const f = { ...ud, role };
    authExpiryHandled.current = false;
    localStorage.setItem('token', nt);
    localStorage.setItem('user', JSON.stringify(f));
    setToken(nt);
    setUser(f);
    return f;
  };
  const login = async c => {
    const r = await authApi.login(c);
    if (r.status === 202 || r.data?.requires2FA) return r;
    completeLogin(r.data);
    return r;
  };
  const googleLogin = async (idToken, options = {}) => {
    const r = await authApi.googleLogin({ idToken, ...options });
    if (r.status === 202 || r.data?.requires2FA) return r;
    completeLogin(r.data);
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
  const verifyEmail = async dt => { const r = await authApi.verifyEmail(dt); return completeLogin(r.data); };
  const updateUser = updates => {
    setUser(current => {
      if (!current) return current;
      const updated = { ...current, ...updates };
      if (!['admin', 'superadmin', 'warehouse_admin'].includes(updated.role)) {
        localStorage.setItem('user', JSON.stringify(updated));
      } else {
        localStorage.setItem('adminUser', JSON.stringify(updated));
      }
      return updated;
    });
  };
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
    localStorage.removeItem('user');
    const adminToken = localStorage.getItem('adminToken');
    const adminClaims = decodeJWT(adminToken);
    if (isAdminPath && adminToken && ['admin', 'superadmin'].includes(adminClaims?.role)) {
      const adminUser = getStoredAdminUser() || adminClaims;
      storeAdminUser(adminUser);
      setToken(adminToken);
      setUser(adminUser);
      return;
    }
    setToken(null); setUser(null);
  };

  useEffect(() => {
    // Re-pull the profile from the server so edits made on another device appear here.
    if (!token || !user || user.role !== 'customer') return undefined;
    let busy = false;
    let lastSyncAt = Date.now();
    const sync = async () => {
      // Tab switches fire focus + visibilitychange; each one used to hit the DB, so refresh at most every 5 minutes.
      if (busy || document.visibilityState === 'hidden' || Date.now() - lastSyncAt < 5 * 60 * 1000) return;
      busy = true;
      lastSyncAt = Date.now();
      try {
        const res = await usersApi.getProfile();
        const fresh = res.data?.user || res.data;
        if (fresh && typeof fresh === 'object') {
          setUser(current => {
            if (!current) return current;
            const merged = { ...current, ...fresh, role: current.role };
            localStorage.setItem('user', JSON.stringify(merged));
            return JSON.stringify(merged) === JSON.stringify(current) ? current : merged;
          });
        }
      } catch (_) { /* keep local copy when offline */ } finally { busy = false; }
    };
    window.addEventListener('focus', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      window.removeEventListener('focus', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [token, user?.id, user?.role]);

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

  return <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, googleLogin, completeLogin, mobileLogin, adminLogin, adminOtpVerify, warehouseLoginVerify, register, verifyEmail, updateUser, logout }}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
