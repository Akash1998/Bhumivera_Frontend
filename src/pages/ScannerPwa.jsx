import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  CloudUpload,
  LoaderCircle,
  LogOut,
  PackageCheck,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Upload,
  X,
} from 'lucide-react';
import api from '../services/api';
import { startCamera, startScanLoop, stopCamera } from '../utils/qrScanEngine';

const TOKEN_KEY = 'BV_SCANNER_PWA_TOKEN';
const STAFF_KEY = 'BV_SCANNER_PWA_STAFF';

const readSession = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STAFF_KEY) || 'null');
    const token = localStorage.getItem(TOKEN_KEY);
    return stored?.sessionCode && token ? { ...stored, token } : null;
  } catch {
    return null;
  }
};

const authConfig = session => ({
  headers: { Authorization: `Bearer ${session.token}` },
});

const getBatchKey = username => `BV_SCANNER_PWA_PACKED_BATCH_${String(username || 'staff').toLowerCase()}`;

const readPackedBatch = username => {
  try {
    const entries = JSON.parse(localStorage.getItem(getBatchKey(username)) || '[]');
    return Array.isArray(entries) ? entries : [];
  } catch {
    return [];
  }
};

const normalizeProductCode = value => {
  let code = String(value || '').trim();
  if (!code) return '';
  if (code.startsWith('{')) {
    try {
      const payload = JSON.parse(code);
      code = String(payload.sku || payload.barcode || payload.serialNumber || payload.code || '').trim();
    } catch {
      return '';
    }
  }
  if (/^https?:\/\//i.test(code)) {
    try {
      const url = new URL(code);
      code = url.searchParams.get('sku') ||
        url.searchParams.get('barcode') ||
        url.searchParams.get('serial') ||
        url.searchParams.get('code') ||
        url.pathname.split('/').filter(Boolean).pop() ||
        '';
    } catch {
      return '';
    }
  }
  if (/^BV-QR[:|]/i.test(code) || /^BV[:|]/i.test(code)) {
    code = code.split(/[:|]/).map(part => part.trim())[1] || '';
  }
  return code.trim();
};

const getOrderId = value => {
  const raw = String(value || '').trim();
  const match = raw.match(/^(?:ORD:|BV-ORD-)?(.+)$/i);
  return match?.[1]?.replace(/^#/, '').trim() || '';
};

const decodeFulfillmentQr = value => {
  const raw = String(value || '').trim();
  if (!raw.startsWith('BV-PWA1:')) return null;
  const encoded = raw.slice('BV-PWA1:'.length).replace(/-/g, '+').replace(/_/g, '/');
  const binary = window.atob(encoded.padEnd(Math.ceil(encoded.length / 4) * 4, '='));
  const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
  const payload = JSON.parse(new TextDecoder().decode(bytes));
  if (payload?.v !== 1 || !payload?.i || !Array.isArray(payload?.x)) {
    throw new Error('This fulfillment QR does not contain a valid order manifest.');
  }
  return {
    id: payload.i,
    orderNumber: payload.n || String(payload.i),
    invoiceNumber: payload.f || '',
    createdAt: payload.d || null,
    status: payload.s || 'pending',
    customerName: payload.c || 'Customer',
    customerPhone: payload.p || '',
    customerEmail: payload.e || '',
    shippingAddress: payload.a || '',
    totalAmount: Number(payload.t?.total) || 0,
    subtotal: Number(payload.t?.subtotal) || 0,
    discount: Number(payload.t?.discount) || 0,
    shippingCost: Number(payload.t?.shipping) || 0,
    totalItemsCount: payload.x.reduce((sum, item) => sum + (Number(item.q) || 0), 0),
    items: payload.x.map(item => ({
      orderItemId: item.i,
      productId: item.p,
      name: item.n || 'Product',
      sku: item.k || '',
      barcode: item.b || item.k || '',
      quantity: Number(item.q) || 1,
      price: Number(item.u) || 0,
      mrp: Number(item.m) || Number(item.u) || 0,
      gstHsnCode: item.h || '',
      gstRate: Number(item.g) || 5,
    })),
  };
};

const formatError = error => error.response?.data?.message || error.message || 'The request could not be completed.';

export default function ScannerPwa() {
  const [session, setSession] = useState(readSession);
  const [onWork, setOnWork] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState('order');
  const [cameraAttempt, setCameraAttempt] = useState(0);
  const [orderInput, setOrderInput] = useState('');
  const [activeOrder, setActiveOrder] = useState(null);
  const [scanProgress, setScanProgress] = useState({});
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [batch, setBatch] = useState(() => readPackedBatch(readSession()?.staff?.username));
  const [notice, setNotice] = useState(null);
  const videoRef = useRef(null);

  const staffName = session?.staff?.fullName || session?.staff?.username || 'Staff';
  const staffUsername = session?.staff?.username || '';
  const orderItems = activeOrder?.items || [];
  const scannedUnits = Object.values(scanProgress).reduce((sum, item) => sum + item.codes.length, 0);
  const expectedUnits = orderItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  const orderComplete = expectedUnits > 0 && scannedUnits === expectedUnits;
  const selectedItem = orderItems.find(item => String(item.orderItemId) === String(selectedItemId));

  const persistBatch = useCallback((nextBatch, usernameForKey = staffUsername) => {
    localStorage.setItem(getBatchKey(usernameForKey), JSON.stringify(nextBatch));
    setBatch(nextBatch);
  }, [staffUsername]);

  const updateWorkroom = useCallback(async (body, targetSession = session) => {
    if (!targetSession?.token) return;
    await api.post(
      '/inventory-software/workroom/toggle-work',
      {
        sessionCode: targetSession.sessionCode,
        operatorUsername: targetSession.staff?.username,
        operatorName: targetSession.staff?.fullName || targetSession.staff?.username,
        deviceName: 'Bhumivera Scanner PWA',
        savedBulkOrders: batch.map(order => ({
          orderId: String(order.orderId),
          orderNumber: String(order.orderNumber || order.orderId),
        })),
        ...body,
      },
      authConfig(targetSession)
    );
  }, [batch, session]);

  const sendHeartbeat = useCallback(async () => {
    if (!session?.token || !onWork) return;
    await api.post(
      '/inventory-software/workroom/heartbeat',
      {
        sessionCode: session.sessionCode,
        operatorUsername: staffUsername,
        operatorName: staffName,
        deviceName: 'Bhumivera Scanner PWA',
        mode: activeOrder ? 'PACKING' : 'IDLE',
        activeOrder: activeOrder?.orderNumber || '',
        activeOrderItems: activeOrder
          ? (activeOrder.items || []).map(item => ({
            orderItemId: item.orderItemId,
            name: item.name,
            sku: item.sku,
            expectedUnits: Number(item.quantity) || 1,
            scannedUnits: scanProgress[String(item.orderItemId)]?.codes.length || 0,
          }))
          : [],
        scannedUnits,
        expectedUnits,
        savedBulkOrders: batch.map(order => ({
          orderId: String(order.orderId),
          orderNumber: String(order.orderNumber || order.orderId),
        })),
      },
      authConfig(session)
    );
  }, [activeOrder, batch, expectedUnits, onWork, scannedUnits, scanProgress, session, staffName, staffUsername]);

  useEffect(() => {
    const manifest = document.querySelector('link[rel="manifest"]');
    const previousHref = manifest?.getAttribute('href');
    manifest?.setAttribute('href', '/scanner-manifest.json');
    return () => {
      if (manifest && previousHref) manifest.setAttribute('href', previousHref);
    };
  }, []);

  useEffect(() => {
    if (!session || !onWork) return undefined;
    const heartbeat = () => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat().catch(error => {
          setNotice({ type: 'error', text: `Live workroom update failed: ${formatError(error)}` });
        });
      }
    };
    heartbeat();
    const timer = window.setInterval(heartbeat, 15000);
    document.addEventListener('visibilitychange', heartbeat);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', heartbeat);
    };
  }, [onWork, sendHeartbeat, session]);

  const handleLogin = async event => {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      const { data } = await api.post('/inventory-software/scanner/auth/login', {
        username: username.trim(),
        password,
        deviceName: 'Bhumivera Scanner PWA',
      });
      if (!data?.success || !data.token || !data.sessionCode) {
        throw new Error(data?.message || 'Sign-in did not return a scanner session.');
      }
      const nextSession = {
        token: data.token,
        sessionCode: data.sessionCode,
        staff: data.staff,
      };
      localStorage.setItem(TOKEN_KEY, nextSession.token);
      localStorage.setItem(STAFF_KEY, JSON.stringify({
        sessionCode: nextSession.sessionCode,
        staff: nextSession.staff,
      }));
      setSession(nextSession);
      setBatch(readPackedBatch(nextSession.staff?.username));
      setPassword('');
      setOnWork(false);
      setNotice({ type: 'success', text: `Signed in as ${data.staff?.fullName || username}. Tap Go to Work when ready.` });
    } catch (error) {
      setNotice({ type: 'error', text: formatError(error) });
    } finally {
      setBusy(false);
    }
  };

  const handleGoToWork = async () => {
    setBusy(true);
    try {
      await updateWorkroom({ onWork: true, mode: 'IDLE' });
      setOnWork(true);
      setNotice({ type: 'success', text: 'You are on work. Your status is visible in Inventory Software.' });
    } catch (error) {
      setNotice({ type: 'error', text: `Could not start work: ${formatError(error)}` });
    } finally {
      setBusy(false);
    }
  };

  const clearActiveOrder = useCallback(() => {
    setActiveOrder(null);
    setScanProgress({});
    setSelectedItemId(null);
    setCameraOpen(false);
  }, []);

  const loadOrder = useCallback(async rawOrderCode => {
    if (!session || !onWork) {
      setNotice({ type: 'error', text: 'Tap Go to Work before loading an order.' });
      return;
    }
    setBusy(true);
    try {
      const order = decodeFulfillmentQr(rawOrderCode);
      if (!order) {
        const orderRef = getOrderId(rawOrderCode);
        throw new Error(orderRef
          ? 'This QR contains only an order number. Print a new fulfillment QR with the embedded item manifest.'
          : 'Scan the fulfillment QR printed from Inventory Software. The QR must contain the order manifest.');
      }
      if (String(order.status).toLowerCase() !== 'confirmed') {
        throw new Error(`Order #${order.orderNumber || order.id} must be confirmed before packing. Current status: ${order.status}.`);
      }
      if (!order.id || order.items.length === 0) {
        throw new Error('The fulfillment QR has no packable items.');
      }
      const progress = Object.fromEntries(order.items.map(item => [
        String(item.orderItemId),
        { codes: [], quantity: Number(item.quantity) || 1 },
      ]));
      setActiveOrder(order);
      setScanProgress(progress);
      setOrderInput('');
      setNotice({ type: 'success', text: `Order #${order.orderNumber || order.id} loaded. Scan only the products shown.` });
    } catch (error) {
      setNotice({ type: 'error', text: formatError(error) });
    } finally {
      setBusy(false);
    }
  }, [onWork, session]);

  const matchesOrderItem = (code, item) => {
    const clean = normalizeProductCode(code).toLowerCase();
    return [item.sku, item.barcode].filter(Boolean).some(value => String(value).trim().toLowerCase() === clean);
  };

  const handleProductScan = useCallback(rawCode => {
    if (!selectedItem) {
      setNotice({ type: 'error', text: 'Choose the product card you are packing before opening the camera.' });
      return false;
    }
    const cleanCode = normalizeProductCode(rawCode);
    if (!matchesOrderItem(cleanCode, selectedItem)) {
      setNotice({
        type: 'error',
        text: `Wrong product. This scan does not match ${selectedItem.name} (${selectedItem.sku}).`,
      });
      return false;
    }
    const key = String(selectedItem.orderItemId);
    const current = scanProgress[key] || { codes: [], quantity: Number(selectedItem.quantity) || 1 };
    if (current.codes.length >= current.quantity) {
      setNotice({ type: 'error', text: `${selectedItem.name} is already fully scanned.` });
      return false;
    }
    const nextProgress = {
      ...scanProgress,
      [key]: { ...current, codes: [...current.codes, cleanCode] },
    };
    setScanProgress(nextProgress);
    setNotice({
      type: 'success',
      text: `${selectedItem.name}: ${current.codes.length + 1}/${current.quantity} scanned.`,
    });
    return true;
  }, [scanProgress, selectedItem]);

  const savePackedOrder = () => {
    if (!activeOrder || !orderComplete) return;
    const entry = {
      orderId: activeOrder.id,
      orderNumber: activeOrder.orderNumber,
      invoiceNumber: activeOrder.invoiceNumber,
      customerName: activeOrder.customerName,
      packedAt: Date.now(),
      packedBy: staffName,
      verifiedItems: orderItems.map(item => ({
        orderItemId: item.orderItemId,
        quantity: Number(item.quantity) || 1,
        verifiedCount: Number(item.quantity) || 1,
        scannedCodes: scanProgress[String(item.orderItemId)]?.codes || [],
      })),
    };
    setConfirmedOrder(entry);
  };

  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const uploadPackedOrders = async packedOrders => {
    if (!session || packedOrders.length === 0) return;
    setBusy(true);
    try {
      const { data } = await api.post(
        '/inventory-software/fulfillment/pwa-batch',
        {
          sessionCode: session.sessionCode,
          operatorUsername: staffUsername,
          operatorName: staffName,
          packedOrders,
        },
        authConfig(session)
      );
      if (!data?.success || Number(data.count) !== packedOrders.length) {
        throw new Error(data?.message || 'The server did not confirm every packed order.');
      }
      let nextBatch = batch;
      if (batch.some(item => packedOrders.some(packed => String(packed.orderId) === String(item.orderId)))) {
        const sentIds = new Set(packedOrders.map(item => String(item.orderId)));
        nextBatch = batch.filter(item => !sentIds.has(String(item.orderId)));
        persistBatch(nextBatch);
      }
      setConfirmedOrder(null);
      clearActiveOrder();
      try {
        await updateWorkroom({
          onWork: true,
          mode: 'IDLE',
          activeOrder: '',
          activeOrderItems: [],
          scannedUnits: 0,
          expectedUnits: 0,
          savedBulkOrders: nextBatch.map(order => ({
            orderId: String(order.orderId),
            orderNumber: String(order.orderNumber || order.orderId),
          })),
        });
        setNotice({ type: 'success', text: data.message || 'Packed orders uploaded to Inventory Software.' });
      } catch (presenceError) {
        setNotice({ type: 'error', text: `Orders uploaded successfully, but live workroom presence did not refresh: ${formatError(presenceError)}` });
      }
    } catch (error) {
      setNotice({ type: 'error', text: `Upload failed; your packed order is preserved: ${formatError(error)}` });
    } finally {
      setBusy(false);
    }
  };

  const handleSaveBulk = async () => {
    if (!confirmedOrder) return;
    const nextBatch = [
      confirmedOrder,
      ...batch.filter(item => String(item.orderId) !== String(confirmedOrder.orderId)),
    ];
    persistBatch(nextBatch);
    setConfirmedOrder(null);
    clearActiveOrder();
    try {
      await updateWorkroom({
        onWork: true,
        mode: 'IDLE',
        activeOrder: '',
        activeOrderItems: [],
        scannedUnits: 0,
        expectedUnits: 0,
        savedBulkOrders: nextBatch.map(order => ({
          orderId: String(order.orderId),
          orderNumber: String(order.orderNumber || order.orderId),
        })),
      });
      setNotice({ type: 'success', text: 'Packed order saved on this device. Inventory is unchanged until you upload the bulk queue.' });
    } catch (error) {
      setNotice({ type: 'error', text: `Order is saved locally, but live workroom presence did not update: ${formatError(error)}` });
    }
  };

  const handleCancelPacking = async () => {
    if (!activeOrder || !window.confirm('Cancel this packing attempt? No stock is changed; the customer order stays open.')) return;
    setBusy(true);
    clearActiveOrder();
    setConfirmedOrder(null);
    try {
      await updateWorkroom({ onWork: true, mode: 'IDLE', activeOrder: '', activeOrderItems: [], scannedUnits: 0, expectedUnits: 0 });
      setNotice({ type: 'info', text: 'Packing attempt canceled. The customer order remains open and its existing stock reservation is unchanged.' });
    } catch (error) {
      setNotice({ type: 'error', text: `Packing was canceled locally, but live workroom presence did not update: ${formatError(error)}` });
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    setBusy(true);
    try {
      if (onWork) await updateWorkroom({ onWork: false, mode: 'OFF_WORK' });
    } catch (error) {
      setNotice({ type: 'error', text: `Could not close the live work session: ${formatError(error)}` });
      setBusy(false);
      return;
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STAFF_KEY);
    setSession(null);
    setOnWork(false);
    setBatch([]);
    clearActiveOrder();
    setConfirmedOrder(null);
    setBusy(false);
  };

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
        onResult: rawValue => {
          if (!active) return;
          if (cameraMode === 'order') {
            stopLoop();
            setCameraOpen(false);
            loadOrder(rawValue);
          } else {
            if (handleProductScan(rawValue)) {
              stopLoop();
              setCameraOpen(false);
            } else {
              setCameraAttempt(value => value + 1);
            }
          }
        },
      });
    }).catch(error => {
      if (!active) return;
      setCameraOpen(false);
      setNotice({ type: 'error', text: error.message || 'Camera access failed. Allow camera access and retry.' });
    });
    return () => {
      active = false;
      stopLoop();
      stopCamera(video);
    };
  }, [cameraAttempt, cameraMode, cameraOpen, handleProductScan, loadOrder]);

  const batchUnits = useMemo(
    () => batch.reduce((sum, order) => sum + order.verifiedItems.reduce((units, item) => units + item.verifiedCount, 0), 0),
    [batch]
  );

  return (
    <main className="min-h-screen bg-[#07110d] px-4 py-6 text-slate-100 sm:px-6">
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/40 bg-emerald-400/10 text-emerald-300">
              <ScanLine size={23} />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-300">Bhumivera · Fulfillment</p>
              <h1 className="text-xl font-black text-white">Packer Scanner</h1>
            </div>
          </div>
          {session && (
            <button type="button" disabled={busy} onClick={handleLogout} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 px-3 text-xs font-semibold text-slate-300 hover:bg-white/5">
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
              <video ref={videoRef} autoPlay muted playsInline className="absolute inset-0 h-full w-full object-cover" />
              <button type="button" onClick={() => setCameraOpen(false)} aria-label="Close camera" className="absolute right-3 top-3 z-20 rounded-full bg-black/70 p-3 text-white">
                <X size={20} />
              </button>
            </div>
            <p className="p-3 text-center text-xs text-slate-300">
              {cameraMode === 'order' ? 'Scan the fulfillment QR. It contains the order manifest; loading it does not fetch from the database.' : `Scan the SKU or barcode for ${selectedItem?.name || 'the selected item'}.`}
            </p>
          </section>
        )}

        {!session ? (
          <section className="rounded-3xl border border-emerald-400/30 bg-emerald-400/[0.06] p-5 shadow-2xl sm:p-7">
            <div className="mb-5 flex items-start gap-3">
              <ShieldCheck className="mt-0.5 shrink-0 text-emerald-300" size={23} />
              <div>
                <h2 className="font-bold text-white">Staff sign in</h2>
                <p className="mt-1 text-sm leading-6 text-slate-300">Use the login ID and password assigned by your administrator. The staff roster must be loaded from Workroom → Staff Accounts before the backend can validate a scanner login.</p>
              </div>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block text-xs font-semibold text-slate-300">
                Staff ID
                <input autoComplete="username" value={username} onChange={event => setUsername(event.target.value)} required className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-base text-white outline-none focus:border-emerald-400" />
              </label>
              <label className="block text-xs font-semibold text-slate-300">
                Password
                <input autoComplete="current-password" type="password" value={password} onChange={event => setPassword(event.target.value)} required className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-base text-white outline-none focus:border-emerald-400" />
              </label>
              <button type="submit" disabled={busy} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 font-black text-emerald-950 disabled:opacity-60">
                {busy && <LoaderCircle size={17} className="animate-spin" />}
                {busy ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </section>
        ) : !onWork ? (
          <section className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <Smartphone className="text-emerald-300" />
              <div>
                <h2 className="font-bold text-white">Welcome, {staffName}</h2>
                <p className="text-sm text-slate-400">Signed in · {session.sessionCode}</p>
              </div>
            </div>
            <button type="button" disabled={busy} onClick={handleGoToWork} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 font-black text-emerald-950 disabled:opacity-60">
              {busy ? <LoaderCircle size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              Go to Work
            </button>
            <p className="text-xs leading-5 text-slate-400">Your live work status is visible in the Inventory Software workroom. Scanning the embedded order QR and saving a bulk pack uses backend memory and your device only; SQL is used when you explicitly upload.</p>
          </section>
        ) : confirmedOrder ? (
          <section className="space-y-4 rounded-3xl border border-emerald-400/30 bg-emerald-400/[0.06] p-5 sm:p-7">
            <div className="text-center">
              <PackageCheck className="mx-auto mb-2 text-emerald-300" size={38} />
              <h2 className="text-xl font-black text-white">Confirm Packed</h2>
              <p className="mt-1 text-sm text-slate-300">Order #{confirmedOrder.orderNumber} · {confirmedOrder.verifiedItems.reduce((sum, item) => sum + item.quantity, 0)} verified units</p>
            </div>
            <button type="button" disabled={busy} onClick={() => uploadPackedOrders([confirmedOrder])} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 font-black text-emerald-950 disabled:opacity-60">
              {busy ? <LoaderCircle size={18} className="animate-spin" /> : <CloudUpload size={19} />}
              Upload Now
            </button>
            <button type="button" disabled={busy} onClick={handleSaveBulk} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 font-bold text-white disabled:opacity-60">
              Save Bulk on This Device
            </button>
            <p className="text-center text-xs leading-5 text-slate-400">Save Bulk keeps this completed packing record on this device. Inventory marks the order packed only after a successful upload.</p>
          </section>
        ) : activeOrder ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Order #{activeOrder.orderNumber}</p>
                <h2 className="font-bold text-white">{activeOrder.customerName}</h2>
                <p className="text-xs text-slate-400">{scannedUnits}/{expectedUnits} units scanned</p>
              </div>
              <button type="button" aria-label="Back to scanner home" onClick={handleCancelPacking} disabled={busy} className="rounded-lg p-2 text-slate-300 hover:bg-white/10"><ArrowLeft size={18} /></button>
            </div>
            <div className="space-y-3">
              {orderItems.map(item => {
                const progress = scanProgress[String(item.orderItemId)] || { codes: [], quantity: Number(item.quantity) || 1 };
                const complete = progress.codes.length >= progress.quantity;
                return (
                  <article key={item.orderItemId} className={`rounded-2xl border p-4 ${complete ? 'border-emerald-400/40 bg-emerald-400/[0.06]' : 'border-white/10 bg-white/[0.03]'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-white">{item.name}</h3>
                        <p className="mt-1 font-mono text-xs text-slate-400">{item.sku} · Qty {progress.codes.length}/{progress.quantity}</p>
                      </div>
                      {complete && <CheckCircle2 size={19} className="shrink-0 text-emerald-300" />}
                    </div>
                    {!complete && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => {
                          setSelectedItemId(item.orderItemId);
                          setCameraMode('product');
                          setCameraOpen(true);
                        }}
                        className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-400/10 font-bold text-emerald-200"
                      >
                        <Camera size={17} /> Scan {item.name}
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
            {orderComplete && (
              <button type="button" onClick={savePackedOrder} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 font-black text-emerald-950">
                <PackageCheck size={19} /> Confirm Packed
              </button>
            )}
            <button type="button" disabled={busy} onClick={handleCancelPacking} className="w-full py-3 text-xs font-bold text-rose-300 disabled:opacity-60">Cancel packing attempt</button>
          </section>
        ) : (
          <section className="space-y-4">
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.06] p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-200">
                <CheckCircle2 size={17} /> On work · {staffName}
              </div>
              <p className="mt-1 text-xs text-slate-400">Inventory Software sees your status live. Order stock remains reserved by the existing customer order.</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="mb-3 font-bold text-white">Scan Order</h2>
              <button type="button" disabled={busy || cameraOpen} onClick={() => { setCameraMode('order'); setCameraOpen(true); }} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 font-black text-emerald-950 disabled:opacity-60">
                <Camera size={20} /> Scan Order Bill QR
              </button>
              <form onSubmit={event => { event.preventDefault(); loadOrder(orderInput); }} className="mt-3 flex gap-2">
                <input value={orderInput} onChange={event => setOrderInput(event.target.value)} placeholder="Or enter ORD number" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-3 font-mono text-sm text-white outline-none focus:border-emerald-400" />
                <button type="submit" disabled={busy} className="rounded-xl border border-white/15 px-4 text-xs font-bold text-white">Load</button>
              </form>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white">Saved Bulk · {batch.length} order(s)</h3>
                  <p className="text-xs text-slate-400">{batchUnits} verified units saved on this device</p>
                </div>
                <button type="button" disabled={busy || batch.length === 0} onClick={() => uploadPackedOrders(batch)} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-400 px-3 text-xs font-black text-emerald-950 disabled:opacity-50">
                  {busy ? <LoaderCircle size={15} className="animate-spin" /> : <Upload size={15} />} Upload Bulk
                </button>
              </div>
              {batch.length > 0 && (
                <ul className="mt-3 space-y-2 border-t border-white/10 pt-3">
                  {batch.map(order => (
                    <li key={order.orderId} className="flex justify-between gap-2 text-xs">
                      <span className="font-mono text-slate-200">Order #{order.orderNumber}</span>
                      <span className="text-slate-400">{order.verifiedItems.reduce((sum, item) => sum + item.quantity, 0)} units</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button type="button" disabled={busy} onClick={async () => {
              setBusy(true);
              try {
                await updateWorkroom({ onWork: false, mode: 'OFF_WORK' });
                setOnWork(false);
                setNotice({ type: 'info', text: 'You are off work. Your saved bulk orders remain on this device.' });
              } catch (error) {
                setNotice({ type: 'error', text: `Could not end work: ${formatError(error)}` });
              } finally {
                setBusy(false);
              }
            }} className="w-full py-2 text-xs font-semibold text-slate-400">Go Off Work</button>
          </section>
        )}
      </div>
    </main>
  );
}
