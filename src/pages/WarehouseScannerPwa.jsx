import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, Camera, CheckCircle2, LoaderCircle, LogOut, Package, ScanLine, ShieldCheck, X } from 'lucide-react';
import api from '../services/api';
import { startCamera, startScanLoop, stopCamera } from '../utils/qrScanEngine';

const TOKEN_KEY = 'BV_SCANNER_PWA_TOKEN';
const STAFF_KEY = 'BV_SCANNER_PWA_STAFF';

const authConfig = token => ({ headers: { Authorization: `Bearer ${token}` } });

const getSavedSession = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const staff = JSON.parse(localStorage.getItem(STAFF_KEY) || 'null');
    return token && staff?.sessionCode ? { token, ...staff } : null;
  } catch {
    return null;
  }
};

export default function WarehouseScannerPwa() {
  const [session, setSession] = useState(getSavedSession);
  const [restoring, setRestoring] = useState(Boolean(getSavedSession()));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [queue, setQueue] = useState([]);
  const [notice, setNotice] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const manifest = document.querySelector('link[rel="manifest"]');
    const previousHref = manifest?.getAttribute('href');
    manifest?.setAttribute('href', '/scanner-manifest.json');
    return () => {
      if (manifest && previousHref) manifest.setAttribute('href', previousHref);
    };
  }, []);

  const connectSession = useCallback(async (nextSession) => {
    const response = await api.post(
      '/inventory-software/scanner/connect',
      { sessionCode: nextSession.sessionCode, deviceName: 'Bhumivera Scanner PWA' },
      authConfig(nextSession.token)
    );
    setQueue(Array.isArray(response.data?.queue) ? response.data.queue : []);
    setSession(nextSession);
    localStorage.setItem(TOKEN_KEY, nextSession.token);
    localStorage.setItem(STAFF_KEY, JSON.stringify({
      sessionCode: nextSession.sessionCode,
      staff: nextSession.staff,
    }));
  }, []);

  useEffect(() => {
    if (!session) {
      setRestoring(false);
      return undefined;
    }

    let active = true;
    api.post(
      '/inventory-software/scanner/connect',
      { sessionCode: session.sessionCode, deviceName: 'Bhumivera Scanner PWA' },
      authConfig(session.token)
    ).then(response => {
      if (active) setQueue(Array.isArray(response.data?.queue) ? response.data.queue : []);
    }).catch(error => {
      if (!active) return;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(STAFF_KEY);
      setSession(null);
      setNotice({ type: 'error', text: error.response?.data?.message || 'Your scanner session expired. Please sign in again.' });
    }).finally(() => {
      if (active) setRestoring(false);
    });

    return () => {
      active = false;
    };
  // Restore only the session present when this screen mounts.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async event => {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      const response = await api.post('/inventory-software/scanner/auth/login', {
        username: username.trim(),
        password,
        deviceName: 'Bhumivera Scanner PWA',
      });
      const data = response.data;
      if (!data?.success || !data.token || !data.sessionCode) {
        throw new Error(data?.message || 'Could not start a scanner session.');
      }
      await connectSession({
        token: data.token,
        sessionCode: data.sessionCode,
        staff: data.staff,
      });
      setPassword('');
      setNotice({ type: 'success', text: `Scanner ready for ${data.staff?.fullName || data.staff?.username || username}.` });
    } catch (error) {
      setNotice({ type: 'error', text: error.response?.data?.message || error.message || 'Sign-in failed. Check your staff credentials and try again.' });
    } finally {
      setBusy(false);
    }
  };

  const handleScan = useCallback(async code => {
    if (!session) return;
    setBusy(true);
    setNotice({ type: 'info', text: `Looking up ${code}…` });
    try {
      const response = await api.post(
        '/inventory-software/scanner/scan',
        {
          qrCode: code,
          quantity: 1,
          sessionCode: session.sessionCode,
          deviceName: 'Bhumivera Scanner PWA',
        },
        authConfig(session.token)
      );
      setQueue(Array.isArray(response.data?.queue) ? response.data.queue : []);
      setNotice({ type: 'success', text: response.data?.message || `Scanned ${code} into the POS queue.` });
    } catch (error) {
      setNotice({ type: 'error', text: error.response?.data?.message || 'Could not add this code to the POS queue.' });
    } finally {
      setBusy(false);
    }
  }, [session]);

  useEffect(() => {
    if (!cameraOpen || !videoRef.current) return undefined;
    const video = videoRef.current;
    let active = true;
    let stopLoop = () => {};

    startCamera(video).then(() => {
      if (!active) {
        stopCamera(video);
        return;
      }
      stopLoop = startScanLoop(video, {
        onResult: code => {
          if (!active) return;
          stopLoop();
          setCameraOpen(false);
          handleScan(code);
        },
      });
    }).catch(error => {
      if (!active) return;
      setCameraOpen(false);
      setNotice({ type: 'error', text: error?.message || 'Camera access failed. Allow camera access and try again.' });
    });

    return () => {
      active = false;
      stopLoop();
      stopCamera(video);
    };
  }, [cameraOpen, handleScan]);

  const handleLogout = async () => {
    if (session) {
      try {
        await api.post(
          '/inventory-software/scanner/disconnect',
          { sessionCode: session.sessionCode },
          authConfig(session.token)
        );
      } catch (error) {
        console.error('[SCANNER_PWA_DISCONNECT_ERROR]', error);
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STAFF_KEY);
    setSession(null);
    setQueue([]);
    setNotice(null);
  };

  const staffName = session?.staff?.fullName || session?.staff?.username || 'Staff';

  return (
    <main className="min-h-screen bg-[#07110d] px-4 py-6 text-slate-100 sm:px-6">
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/40 bg-emerald-400/10 text-emerald-300">
              <ScanLine size={23} />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-300">Bhumivera · Warehouse</p>
              <h1 className="text-xl font-black text-white">Mobile Scanner</h1>
            </div>
          </div>
          {session && (
            <button type="button" onClick={handleLogout} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 px-3 text-xs font-semibold text-slate-300 hover:bg-white/5">
              <LogOut size={15} /> Sign out
            </button>
          )}
        </header>

        {notice && (
          <div role={notice.type === 'error' ? 'alert' : 'status'} className={`mb-5 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
            notice.type === 'error' ? 'border-rose-400/30 bg-rose-400/10 text-rose-100'
              : notice.type === 'success' ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100'
                : 'border-sky-400/30 bg-sky-400/10 text-sky-100'
          }`}>
            {notice.type === 'error' ? <AlertCircle size={17} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={17} className="mt-0.5 shrink-0" />}
            <span>{notice.text}</span>
          </div>
        )}

        {restoring ? (
          <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-slate-300" role="status">
            <LoaderCircle size={20} className="animate-spin text-emerald-300" /> Reconnecting scanner…
          </div>
        ) : !session ? (
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl sm:p-7">
            <div className="mb-5 flex items-start gap-3">
              <ShieldCheck className="mt-0.5 shrink-0 text-emerald-300" size={22} />
              <div>
                <h2 className="font-bold text-white">Staff sign in</h2>
                <p className="mt-1 text-sm leading-6 text-slate-400">Use your warehouse staff account to connect this phone to the scanner queue.</p>
              </div>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block text-xs font-semibold text-slate-300">
                Staff ID
                <input
                  autoComplete="username"
                  className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-base text-white outline-none focus:border-emerald-400"
                  value={username}
                  onChange={event => setUsername(event.target.value)}
                  required
                />
              </label>
              <label className="block text-xs font-semibold text-slate-300">
                Password
                <input
                  autoComplete="current-password"
                  type="password"
                  className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-base text-white outline-none focus:border-emerald-400"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  required
                />
              </label>
              <button type="submit" disabled={busy} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 font-bold text-emerald-950 disabled:opacity-60">
                {busy && <LoaderCircle size={17} className="animate-spin" />}
                {busy ? 'Signing in…' : 'Connect Scanner'}
              </button>
            </form>
          </section>
        ) : (
          <div className="space-y-5">
            <section className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
              <div>
                <p className="text-xs text-slate-400">Connected operator</p>
                <p className="mt-1 font-bold text-white">{staffName}</p>
              </div>
              <span className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 font-mono text-xs font-bold text-emerald-200">
                {session.sessionCode}
              </span>
            </section>

            {cameraOpen ? (
              <section className="overflow-hidden rounded-3xl border border-white/10 bg-black">
                <div className="relative aspect-[4/5] max-h-[65vh]">
                  <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
                  <div className="pointer-events-none absolute inset-[16%] rounded-3xl border-2 border-emerald-300/90" />
                  <button type="button" onClick={() => setCameraOpen(false)} aria-label="Close camera" className="absolute right-3 top-3 rounded-full bg-black/70 p-3 text-white">
                    <X size={20} />
                  </button>
                </div>
                <p className="p-3 text-center text-xs text-slate-300">Align a product QR code or barcode inside the frame.</p>
              </section>
            ) : (
              <button
                type="button"
                onClick={() => { setNotice(null); setCameraOpen(true); }}
                disabled={busy}
                className="flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-emerald-400 px-5 text-lg font-black text-emerald-950 shadow-lg shadow-emerald-950/30 disabled:opacity-60"
              >
                {busy ? <LoaderCircle size={22} className="animate-spin" /> : <Camera size={22} />}
                {busy ? 'Adding scan…' : 'Scan Product'}
              </button>
            )}

            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <h2 className="flex items-center gap-2 text-sm font-bold text-white">
                  <Package size={17} className="text-emerald-300" /> POS scan queue
                </h2>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-slate-200">{queue.length}</span>
              </div>
              {queue.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-slate-400">Scanned products will appear here and sync to your POS terminal.</p>
              ) : (
                <ul className="divide-y divide-white/5">
                  {queue.map((item, index) => (
                    <li key={item.id || item.queueId || `${item.sku}-${index}`} className="flex items-center justify-between gap-4 px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{item.product_name || item.name || item.sku}</p>
                        <p className="mt-1 font-mono text-[11px] text-slate-400">{item.sku || item.barcode || item.qr_payload || 'Product'}</p>
                      </div>
                      <span className="shrink-0 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-bold text-emerald-200">×{item.quantity || 1}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <p className="text-center text-[11px] leading-5 text-slate-500">Keep this page open while scanning. The phone must have camera permission and an internet connection.</p>
          </div>
        )}
      </div>
    </main>
  );
}
