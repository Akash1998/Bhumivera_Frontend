//toast
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Toaster } from 'react-hot-toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const pendingOperationToasts = useRef(new Set());

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    for (const timer of pendingOperationToasts.current) clearTimeout(timer);
    pendingOperationToasts.current.clear();
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  useEffect(() => {
    const pendingTimers = pendingOperationToasts.current;
    const handleOperationFeedback = event => {
      const { message, type } = event.detail || {};
      if (!message || !type) return;
      const timer = setTimeout(() => {
        pendingTimers.delete(timer);
        addToast(message, type);
      }, 300);
      pendingTimers.add(timer);
    };
    window.addEventListener('operation-feedback', handleOperationFeedback);
    return () => {
      window.removeEventListener('operation-feedback', handleOperationFeedback);
      for (const timer of pendingTimers) clearTimeout(timer);
      pendingTimers.clear();
    };
  }, [addToast]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useMemo(() => ({
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    info: (msg, dur) => addToast(msg, 'info', dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
    showToast: (msg, type = 'success', dur) => addToast(msg, type, dur),
  }), [addToast]);

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-cyan-500 text-white',
    warning: 'bg-yellow-500 text-gray-900',
  };

  const typeIcons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl min-w-[280px] max-w-sm pointer-events-auto animate-slide-in-right ${
              typeStyles[t.type] || typeStyles.info
            }`}
          >
            <span className="text-lg font-bold flex-shrink-0">{typeIcons[t.type]}</span>
            <span className="text-sm font-medium flex-1">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-2 opacity-70 hover:opacity-100 text-lg leading-none flex-shrink-0"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default ToastContext;
