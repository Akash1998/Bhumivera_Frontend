import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Flashlight,
  LoaderCircle,
  LogOut,
  Minus,
  Package,
  Plus,
  QrCode,
  RefreshCw,
  ScanLine,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import api from '../services/api';
import { setTorch, startCamera, startScanLoop, stopCamera } from '../utils/qrScanEngine';

const TOKEN_KEY = 'BV_SCANNER_PWA_TOKEN';
const STAFF_KEY = 'BV_SCANNER_PWA_STAFF';

const getSavedSession = () => {
  try {
    const staff = JSON.parse(localStorage.getItem(STAFF_KEY) || 'null');
    const token = localStorage.getItem(TOKEN_KEY);
    if (!staff?.sessionCode || (!token && !staff.scannerApiKey)) return null;
    return { ...staff, ...(token ? { token } : {}) };
  } catch {
    return null;
  }
};

const saveSession = session => {
  if (session.token) localStorage.setItem(TOKEN_KEY, session.token);
  else localStorage.removeItem(TOKEN_KEY);
  localStorage.setItem(STAFF_KEY, JSON.stringify({
    scannerApiKey: session.scannerApiKey || '',
    sessionCode: session.sessionCode,
    staff: session.staff || null,
    operatorName: session.operatorName || '',
    expiresAt: session.expiresAt || null,
  }));
};

const authConfig = session => session.scannerApiKey
  ? { headers: { 'x-scanner-api-key': session.scannerApiKey } }
  : { headers: { ['Authorization']: ['Bearer', session.token].join(' ') } };

const getProductCode = rawValue => {
  const raw = String(rawValue || '').trim();
  if (!raw) return '';

  if (raw.startsWith('{')) {
    try {
      const payload = JSON.parse(raw);
      if (payload.scannerApiKey) return raw;
      return String(payload.sku || payload.barcode || payload.serialNumber || payload.code || '').trim();
    } catch {
      return raw;
    }
  }

  if (/^https?:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      return url.searchParams.get('sku') ||
        url.searchParams.get('barcode') ||
        url.searchParams.get('serial') ||
        url.searchParams.get('code') ||
        url.pathname.split('/').filter(Boolean).pop() ||
        raw;
    } catch {
      return raw;
    }
  }

  return raw;
};

export default function WarehouseScannerPwa() {
  const [session, setSession] = useState(getSavedSession);
  const [restoring, setRestoring] = useState(Boolean(getSavedSession()));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState('product');
  const [torchOn, setTorchOn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [queue, setQueue] = useState([]);
  const [manualCode, setManualCode] = useState('');
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

  const connectSession = useCallback(async nextSession => {
    const response = await api.post(
      '/inventory-software/scanner/connect',
      { sessionCode: nextSession.sessionCode, deviceName: 'Bhumivera Scanner PWA' },
      authConfig(nextSession)
    );
    if (!response.data?.success) {
      throw new Error(response.data?.message || 'The terminal did not accept the connection.');
    }
    setQueue(Array.isArray(response.data?.queue) ? response.data.queue : []);
    setSession({ ...nextSession, isConnected: true });
    setIsConnected(true);
    saveSession(nextSession);
    setNotice({ type: 'success', text: `Connected to live terminal ${nextSession.sessionCode}.` });
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
      authConfig(session)
    ).then(response => {
      if (!response.data?.success) throw new Error(response.data?.message || 'The terminal did not accept the connection.');
      if (active) {
        setQueue(Array.isArray(response.data?.queue) ? response.data.queue : []);
        setIsConnected(true);
      }
    }).catch(error => {
      if (!active) return;
      setIsConnected(false);
      setNotice({ type: 'error', text: error.response?.data?.message || error.message || 'Could not reconnect to the live terminal. Tap Connect / Resume to retry.' });
    }).finally(() => {
      if (active) setRestoring(false);
    });

    return () => {
      active = false;
    };
  // Restore only the session present when this screen mounts.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnect = async () => {
    if (!session) return;
    setBusy(true);
    setNotice({ type: 'info', text: `Connecting to terminal ${session.sessionCode}…` });
    try {
      await connectSession(session);
    } catch (error) {
      setIsConnected(false);
      setNotice({ type: 'error', text: error.response?.data?.message || error.message || 'Could not connect to the live terminal.' });
    } finally {
      setBusy(false);
    }
  };

  const handlePause = async () => {
    if (!session) return;
    setBusy(true);
    try {
      const response = await api.post(
        '/inventory-software/scanner/disconnect',
        { sessionCode: session.sessionCode },
        authConfig(session)
      );
      if (!response.data?.success) throw new Error(response.data?.message || 'The terminal did not confirm disconnect.');
      setIsConnected(false);
      setSession(current => current ? { ...current, isConnected: false } : current);
      setCameraOpen(false);
      setNotice({ type: 'info', text: `Paused terminal ${session.sessionCode}. Your pairing is saved; connect again to resume.` });
    } catch (error) {
      setNotice({ type: 'error', text: error.response?.data?.message || error.message || 'Could not pause the terminal connection.' });
    } finally {
      setBusy(false);
    }
  };

  const handlePairingQr = useCallback(async rawValue => {
    let payload;
    try {
      payload = JSON.parse(String(rawValue || '').trim());
    } catch {
      throw new Error('That is not a terminal pairing QR. Open Mobile Scanner in Inventory Software and scan its pairing code.');
    }

    if (!payload?.scannerApiKey || !payload?.sessionCode) {
      throw new Error('This QR does not include a scanner key and terminal session. Generate a fresh pairing QR in Inventory Software.');
    }
    if (payload.app && payload.app !== 'BHUMIVERA_ANDROID_QR_SCANNER') {
      throw new Error('This QR code belongs to a different app.');
    }
    if (!String(payload.scannerApiKey).startsWith('BV-SCAN-')) {
      throw new Error('The terminal pairing key is invalid. Generate a fresh pairing QR.');
    }
    if (payload.expiresAt && Date.parse(payload.expiresAt) <= Date.now()) {
      throw new Error('This terminal pairing QR has expired. Generate a new one in Inventory Software.');
    }

    const pairedSession = {
      scannerApiKey: String(payload.scannerApiKey),
      sessionCode: String(payload.sessionCode).trim(),
      operatorName: String(payload.operatorName || ''),
      expiresAt: payload.expiresAt || null,
      staff: payload.operatorName ? { fullName: payload.operatorName } : null,
    };
    saveSession(pairedSession);
    setSession(pairedSession);
    setIsConnected(false);
    await connectSession(pairedSession);
  }, [connectSession]);

  useEffect(() => {
    if (!session || !isConnected) return undefined;
    let active = true;
    const syncQueue = async () => {
      try {
        const response = await api.get('/inventory-software/scanner/queue', {
          params: { sessionCode: session.sessionCode },
          ...authConfig(session),
        });
        if (!active) return;
        if (response.data?.connected === false) {
          setIsConnected(false);
          setNotice({ type: 'error', text: response.data?.message || 'The terminal paused. Tap Connect / Resume to reconnect.' });
          return;
        }
        if (Array.isArray(response.data?.queue)) setQueue(response.data.queue);
      } catch (error) {
        if (!active) return;
        if (error.response?.status === 408 || error.response?.status === 401) {
          setIsConnected(false);
          setNotice({ type: 'error', text: error.response?.data?.message || 'The live terminal connection expired. Scan a fresh pairing QR or reconnect.' });
        } else {
          setNotice({ type: 'error', text: error.response?.data?.message || 'Live queue sync failed. Check your connection and tap Refresh.' });
        }
      }
    };
    const intervalId = window.setInterval(syncQueue, 3000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [isConnected, session]);

  const handleRefreshQueue = async () => {
    if (!session || !isConnected) return;
    setBusy(true);
    try {
      const response = await api.get('/inventory-software/scanner/queue', {
        params: { sessionCode: session.sessionCode },
        ...authConfig(session),
      });
      if (!response.data?.success) throw new Error(response.data?.message || 'The terminal did not return its queue.');
      setQueue(Array.isArray(response.data.queue) ? response.data.queue : []);
      setNotice({ type: 'success', text: 'Live terminal queue refreshed.' });
    } catch (error) {
      setNotice({ type: 'error', text: error.response?.data?.message || error.message || 'Could not refresh the terminal queue.' });
    } finally {
      setBusy(false);
    }
  };

  const handleTorchToggle = async () => {
    const enabled = await setTorch(videoRef.current, !torchOn);
    if (enabled) {
      setTorchOn(value => !value);
    } else {
      setNotice({ type: 'error', text: 'Torch is not available on this camera.' });
    }
  };

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
      const staffSession = {
        token: data.token,
        sessionCode: data.sessionCode,
        staff: data.staff,
      };
      saveSession(staffSession);
      setSession(staffSession);
      await connectSession(staffSession);
      setPassword('');
    } catch (error) {
      setNotice({ type: 'error', text: error.response?.data?.message || error.message || 'Sign-in failed. Check your staff credentials and try again.' });
    } finally {
      setBusy(false);
    }
  };

  const handleScan = useCallback(async code => {
    if (!session || !isConnected) {
      setNotice({ type: 'error', text: 'Connect to a live terminal before scanning products.' });
      return;
    }
    const cleanCode = getProductCode(code);
    if (!cleanCode) {
      setNotice({ type: 'error', text: 'No product code was found in that QR or barcode.' });
      return;
    }
    setBusy(true);
    setNotice({ type: 'info', text: `Adding ${cleanCode} to ${session.sessionCode}…` });
    try {
      const response = await api.post(
        '/inventory-software/scanner/scan',
        {
          qrCode: cleanCode,
          quantity: 1,
          sessionCode: session.sessionCode,
          deviceName: 'Bhumivera Scanner PWA',
        },
        authConfig(session)
      );
      setQueue(Array.isArray(response.data?.queue) ? response.data.queue : []);
      setNotice({ type: 'success', text: response.data?.message || `Scanned ${code} into the POS queue.` });
    } catch (error) {
      setNotice({ type: 'error', text: error.response?.data?.message || 'Could not add this code to the POS queue.' });
    } finally {
      setBusy(false);
    }
  }, [isConnected, session]);

  const handleRemoveQueueItem = async item => {
    if (!session) return;
    setBusy(true);
    try {
      const response = await api.post(
        '/inventory-software/scanner/queue/remove',
        { id: item.id, sku: item.sku, metaId: item.meta_id, sessionCode: session.sessionCode },
        authConfig(session)
      );
      if (!response.data?.success) throw new Error(response.data?.message || 'The terminal did not confirm the queue update.');
      setQueue(Array.isArray(response.data.queue) ? response.data.queue : []);
      setNotice({ type: 'success', text: `${item.product_name || item.sku || 'Item'} removed from the live terminal queue.` });
    } catch (error) {
      setNotice({ type: 'error', text: error.response?.data?.message || error.message || 'Could not remove this queue item.' });
    } finally {
      setBusy(false);
    }
  };

  const handleQueueQuantity = async (item, delta) => {
    if (!session) return;
    setBusy(true);
    try {
      const response = await api.post(
        '/inventory-software/scanner/queue/item',
        {
          sessionCode: session.sessionCode,
          sku: item.sku,
          metaId: item.meta_id,
          delta,
        },
        authConfig(session)
      );
      if (!response.data?.success) throw new Error(response.data?.message || 'The terminal did not confirm the quantity update.');
      setQueue(Array.isArray(response.data.queue) ? response.data.queue : []);
      setNotice({ type: 'success', text: 'Live terminal quantity updated.' });
    } catch (error) {
      setNotice({ type: 'error', text: error.response?.data?.message || error.message || 'Could not update the terminal quantity.' });
    } finally {
      setBusy(false);
    }
  };

  const handleClearQueue = async () => {
    if (!session || queue.length === 0 || !window.confirm('Clear every queued item from this live POS terminal?')) return;
    setBusy(true);
    try {
      const response = await api.post(
        '/inventory-software/scanner/queue/clear',
        { sessionCode: session.sessionCode },
        authConfig(session)
      );
      if (!response.data?.success) throw new Error(response.data?.message || 'The terminal did not confirm clearing the queue.');
      setQueue([]);
      setNotice({ type: 'success', text: 'Live POS queue cleared.' });
    } catch (error) {
      setNotice({ type: 'error', text: error.response?.data?.message || error.message || 'Could not clear the terminal queue.' });
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!cameraOpen || !videoRef.current) return undefined;
    const video = videoRef.current;
    let active = true;
    let stopLoop = () => {};
    setTorchOn(false);

    startCamera(video).then(() => {
      if (!active) {
        stopCamera(video);
        return;
      }
      stopLoop = startScanLoop(video, {
        onResult: rawValue => {
          if (!active) return;
          stopLoop();
          setCameraOpen(false);
          if (cameraMode === 'pair') {
            handlePairingQr(rawValue).catch(error => {
              setNotice({ type: 'error', text: error.message || 'Could not pair with this terminal.' });
            });
          } else {
            handleScan(rawValue);
          }
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
  }, [cameraMode, cameraOpen, handlePairingQr, handleScan]);

  const handleLogout = async () => {
    if (session) {
      try {
        await api.post(
          '/inventory-software/scanner/disconnect',
          { sessionCode: session.sessionCode },
          authConfig(session)
        );
      } catch (error) {
        console.error('[SCANNER_PWA_DISCONNECT_ERROR]', error);
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STAFF_KEY);
    setSession(null);
    setIsConnected(false);
    setQueue([]);
    setNotice(null);
  };

  const staffName = session?.operatorName || session?.staff?.fullName || session?.staff?.username || 'Staff';

  const submitManualCode = event => {
    event.preventDefault();
    const code = manualCode.trim();
    if (!code) return;
    setManualCode('');
    handleScan(code);
  };

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

        {cameraOpen && (
          <section className="mb-5 overflow-hidden rounded-3xl border border-white/10 bg-black">
            <div className="relative aspect-[4/5] max-h-[65vh]">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover [backface-visibility:hidden]"
                style={{ filter: 'none', WebkitFilter: 'none', backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
              />
              <button type="button" onClick={() => setCameraOpen(false)} aria-label="Close camera" className="absolute right-3 top-3 z-20 rounded-full bg-black/70 p-3 text-white">
                <X size={20} />
              </button>
              <button type="button" onClick={handleTorchToggle} aria-label={torchOn ? 'Turn torch off' : 'Turn torch on'} className="absolute bottom-3 right-3 z-20 rounded-full bg-black/70 p-3 text-white">
                <Flashlight size={20} className={torchOn ? 'text-amber-300' : ''} />
              </button>
            </div>
            <p className="p-3 text-center text-xs text-slate-300">
              {cameraMode === 'pair' ? 'Point at the live pairing QR shown in Inventory Software.' : 'Align a product QR code or barcode with the camera.'}
            </p>
          </section>
        )}

        {restoring ? (
          <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-slate-300" role="status">
            <LoaderCircle size={20} className="animate-spin text-emerald-300" /> Reconnecting scanner…
          </div>
        ) : !session ? (
          <div className="space-y-4">
            <section className="rounded-3xl border border-emerald-400/30 bg-emerald-400/[0.06] p-5 shadow-2xl sm:p-7">
              <div className="mb-5 flex items-start gap-3">
                <QrCode className="mt-0.5 shrink-0 text-emerald-300" size={23} />
                <div>
                  <h2 className="font-bold text-white">Connect to your live POS terminal</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    On the computer, open <b>Inventory Software → Mobile Scanner → Connect Scanner Now</b>. Scan the pairing QR shown there to connect this phone to that exact terminal.
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={busy || cameraOpen}
                onClick={() => {
                  setCameraMode('pair');
                  setNotice(null);
                  setCameraOpen(true);
                }}
                className="flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-emerald-400 px-4 font-black text-emerald-950 disabled:opacity-60"
              >
                <Camera size={20} /> Scan Terminal Pairing QR
              </button>
              <p className="mt-3 text-center text-xs leading-5 text-slate-400">This is the recommended way to attach the scanner to the terminal already open on your computer.</p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <button type="button" onClick={() => setShowLogin(value => !value)} className="flex min-h-10 w-full items-center justify-between text-left text-sm font-semibold text-slate-200">
                <span className="flex items-center gap-2"><ShieldCheck size={17} className="text-slate-400" /> Or sign in with a staff account</span>
                <span aria-hidden="true">{showLogin ? '−' : '+'}</span>
              </button>
              {showLogin && (
                <form onSubmit={handleLogin} className="mt-4 space-y-4">
                  <p className="text-xs leading-5 text-amber-100/80">Staff sign-in connects to that staff member’s own session. To join an existing computer terminal, use its pairing QR above.</p>
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
                  <button type="submit" disabled={busy} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 font-bold text-white disabled:opacity-60">
                    {busy && <LoaderCircle size={17} className="animate-spin" />}
                    {busy ? 'Signing in…' : 'Sign in and connect'}
                  </button>
                </form>
              )}
            </section>
          </div>
        ) : (
          <div className="space-y-5">
            <section className={`rounded-2xl border p-4 ${isConnected ? 'border-emerald-400/30 bg-emerald-400/[0.06]' : 'border-amber-400/30 bg-amber-400/[0.05]'}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                    <span className={`h-2.5 w-2.5 rounded-full ${isConnected ? 'animate-pulse bg-emerald-400' : 'bg-amber-400'}`} />
                    {isConnected ? 'Live terminal connected' : 'Terminal disconnected'}
                  </p>
                  <p className="mt-2 font-mono text-sm font-bold text-white">{session.sessionCode}</p>
                  <p className="mt-1 text-xs text-slate-400">Operator: {staffName}</p>
                  {session.expiresAt && <p className="mt-1 text-[11px] text-slate-500">Pairing expires: {new Date(session.expiresAt).toLocaleString()}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {isConnected ? (
                    <button type="button" onClick={handlePause} disabled={busy} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-amber-300/30 px-3 text-xs font-bold text-amber-100 disabled:opacity-50">
                      {busy ? <LoaderCircle size={15} className="animate-spin" /> : null} Pause connection
                    </button>
                  ) : (
                    <button type="button" onClick={handleConnect} disabled={busy} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-400 px-3 text-xs font-black text-emerald-950 disabled:opacity-50">
                      {busy ? <LoaderCircle size={15} className="animate-spin" /> : <RefreshCw size={15} />} Connect / Resume
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { setCameraMode('pair'); setNotice(null); setCameraOpen(true); }}
                    disabled={busy || cameraOpen}
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 px-3 text-xs font-semibold text-slate-200 disabled:opacity-50"
                  >
                    <QrCode size={15} /> Pair terminal
                  </button>
                </div>
              </div>
            </section>

            {isConnected && !cameraOpen && (
              <>
                <button
                  type="button"
                  onClick={() => { setCameraMode('product'); setNotice(null); setCameraOpen(true); }}
                  disabled={busy}
                  className="flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-emerald-400 px-5 text-lg font-black text-emerald-950 shadow-lg shadow-emerald-950/30 disabled:opacity-60"
                >
                  {busy ? <LoaderCircle size={22} className="animate-spin" /> : <Camera size={22} />}
                  Scan Product
                </button>
                <form onSubmit={submitManualCode} className="flex gap-2">
                  <input
                    aria-label="Manual product code"
                    autoComplete="off"
                    value={manualCode}
                    onChange={event => setManualCode(event.target.value)}
                    placeholder="Type or paste SKU / barcode"
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
                  />
                  <button type="submit" disabled={busy || !manualCode.trim()} className="min-h-11 rounded-xl bg-white/10 px-4 text-sm font-bold text-white disabled:opacity-40">Add</button>
                </form>
              </>
            )}

            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <h2 className="flex items-center gap-2 text-sm font-bold text-white">
                  <Package size={17} className="text-emerald-300" /> POS scan queue
                </h2>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-slate-200">{queue.length}</span>
                  <button type="button" onClick={handleRefreshQueue} disabled={!isConnected || busy} aria-label="Refresh live queue" className="rounded-lg p-2 text-slate-300 hover:bg-white/10 disabled:opacity-40">
                    <RefreshCw size={15} />
                  </button>
                  <button type="button" onClick={handleClearQueue} disabled={!isConnected || busy || queue.length === 0} aria-label="Clear live queue" className="rounded-lg p-2 text-rose-200 hover:bg-rose-400/10 disabled:opacity-40">
                    <Trash2 size={15} />
                  </button>
                </div>
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
                      <div className="flex shrink-0 items-center gap-1">
                        <button type="button" onClick={() => handleQueueQuantity(item, -1)} disabled={!isConnected || busy} aria-label={`Decrease ${item.product_name || item.sku} quantity`} className="rounded-lg p-2 text-slate-200 hover:bg-white/10 disabled:opacity-40">
                          <Minus size={14} />
                        </button>
                        <span className="min-w-8 text-center text-xs font-bold text-emerald-200">×{item.quantity || 1}</span>
                        <button type="button" onClick={() => handleQueueQuantity(item, 1)} disabled={!isConnected || busy} aria-label={`Increase ${item.product_name || item.sku} quantity`} className="rounded-lg p-2 text-slate-200 hover:bg-white/10 disabled:opacity-40">
                          <Plus size={14} />
                        </button>
                        <button type="button" onClick={() => handleRemoveQueueItem(item)} disabled={!isConnected || busy} aria-label={`Remove ${item.product_name || item.sku}`} className="rounded-lg p-2 text-rose-200 hover:bg-rose-400/10 disabled:opacity-40">
                          <Trash2 size={14} />
                        </button>
                      </div>
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
