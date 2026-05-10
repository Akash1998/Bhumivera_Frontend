import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth as authApi, users as usersApi } from '../services/api';

const AuthContext = createContext(null);

const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (e) { return null; }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const decodedPayload = decodeJWT(storedToken);
          let fetchedUser;
          if (decodedPayload?.role === 'admin' || decodedPayload?.role === 'superadmin' || decodedPayload?.role === 'warehouse_admin') {
            const res = await authApi.getAdminProfile();
            fetchedUser = res.data;
          } else {
            const res = await usersApi.getProfile();
            fetchedUser = res.data.user || res.data;
          }
          setUser({ ...fetchedUser, role: decodedPayload?.role || fetchedUser?.role || 'user' });
          setToken(storedToken);
        } catch (err) { logout(); }
      }
      setLoading(false);
    };
    initAuth();
    const handleAuthExpired = () => logout();
    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    if (res.status === 202 || res.data?.requires2FA) throw new Error("MFA Verification Required");
    const { token: newToken, user: userData } = res.data;
    const decodedPayload = decodeJWT(newToken);
    const finalUser = { ...userData, role: decodedPayload?.role || userData?.role || 'user' };
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(finalUser));
    setToken(newToken);
    setUser(finalUser);
    return finalUser;
  };

  const mobileLogin = async (data) => {
    const res = await authApi.mobileLoginVerify(data);
    const { token: newToken, user: userData } = res.data;
    const decodedPayload = decodeJWT(newToken);
    const finalUser = { ...userData, role: decodedPayload?.role || userData?.role || 'user' };
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(finalUser));
    setToken(newToken);
    setUser(finalUser);
    return finalUser;
  };

  const adminLogin = async (credentials) => {
    const res = await authApi.adminLogin(credentials);
    const { token: newToken, admin: adminData } = res.data;
    const finalUser = { ...adminData, role: 'admin' };
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(finalUser);
    return finalUser;
  };

  const adminOtpVerify = async (data) => {
    const finalUser = { ...data.admin, role: data.admin.role || 'admin' };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(finalUser));
    setToken(data.token);
    setUser(finalUser);
    return finalUser;
  };

  // ADDED: Dedicated method to sync warehouse login state globally instantly
  const warehouseLoginVerify = (data) => {
    const finalUser = { ...data.admin, role: data.admin.role || 'warehouse_admin' };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(finalUser));
    setToken(data.token);
    setUser(finalUser);
    return finalUser;
  };

  const register = async (data) => {
    const res = await authApi.register(data);
    return res.data;
  };

  const verifyEmail = async (data) => {
    const res = await authApi.verifyEmail(data);
    const { token: newToken, user: userData } = res.data;
    const decodedPayload = decodeJWT(newToken);
    const finalUser = { ...userData, role: decodedPayload?.role || userData?.role || 'user' };
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(finalUser));
    setToken(newToken);
    setUser(finalUser);
    return finalUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    if (window.location.pathname.includes('/admin') || window.location.pathname.includes('/profile')) {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, token, isAuthenticated: !!token, loading, 
      login, mobileLogin, adminLogin, adminOtpVerify, warehouseLoginVerify, 
      register, verifyEmail, logout 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
