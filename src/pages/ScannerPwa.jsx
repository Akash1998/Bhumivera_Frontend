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

const getActiveOrderKey = username => `BV_SCANNER_ACTIVE_ORDER_${String(username || 'staff').toLowerCase()}`;

const readActivePackingState = username => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(getActiveOrderKey(username)) || 'null');
    return saved?.order && saved?.progress ? saved : null;
  } catch {
    return null;
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
  const isCompactManifest = raw.startsWith('BV-PWA2:');
  if (!isCompactManifest && !raw.startsWith('BV-PWA1:')) return null;
  const prefix = isCompactManifest ? 'BV-PWA2:' : 'BV-PWA1:';
  const encoded = raw.slice(prefix.length).replace(/-/g, '+').replace(/_/g, '/');
  const binary = window.atob(encoded.padEnd(Math.ceil(encoded.length / 4) * 4, '='));
  const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
  const payload = JSON.parse(new TextDecoder().decode(bytes));
  if (isCompactManifest && Array.isArray(payload)) {
    if (payload[0] !== 2 || !payload[1] || !Array.isArray(payload[5])) {
      throw new Error('This compact fulfillment QR does not contain a valid order manifest.');
    }
    const items = payload[5].map(item => {
      if (!Array.isArray(item)) throw new Error('This fulfillment QR contains an invalid item entry.');
      return {
        orderItemId: item[0],
        name: item[1] || 'Product',
        sku: item[2] || '',
        barcode: item[3] || item[2] || '',
        quantity: Number(item[4]) || 1,
      };
    });
    return {
      id: payload[1],
      orderNumber: payload[2] || String(payload[1]),
      status: payload[3] || 'pending',
      customerName: payload[4] || 'Customer',
      totalItemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
      items,
    };
  }
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
  const [activeOrder, setActiveOrder] = useState(() => readActivePackingState(readSession()?.staff?.username)?.order || null);
  const [scanProgress, setScanProgress] = useState(() => readActivePackingState(readSession()?.staff?.username)?.progress || {});
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [batch, setBatch] = useState(() => readPackedBatch(readSession()?.staff?.username));
  const [notice, setNotice] = useState(null);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
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
    if (!session?.token || !onWork || !isOnline) return;
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
  }, [activeOrder, batch, expectedUnits, isOnline, onWork, scannedUnits, scanProgress, session, staffName, staffUsername]);

  useEffect(() => {
    const updateNetworkState = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateNetworkState);
    window.addEventListener('offline', updateNetworkState);
    return () => {
      window.removeEventListener('online', updateNetworkState);
      window.removeEventListener('offline', updateNetworkState);
    };
  }, []);

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
  }, [isOnline, onWork, sendHeartbeat, session]);

  useEffect(() => {
    if (!staffUsername) return;
    const key = getActiveOrderKey(staffUsername);
    if (activeOrder) {
      sessionStorage.setItem(key, JSON.stringify({ order: activeOrder, progress: scanProgress }));
    } else {
      sessionStorage.removeItem(key);
    }
  }, [activeOrder, scanProgress, staffUsername]);

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
      const savedPackingState = readActivePackingState(nextSession.staff?.username);
      setActiveOrder(savedPackingState?.order || null);
      setScanProgress(savedPackingState?.progress || {});
      setPassword('');
      setOnWork(false);
      setNotice({
        type: 'success',
        text: savedPackingState?.order
          ? `Signed in as ${data.staff?.fullName || username}. Your unfinished order was restored from this browser tab.`
          : `Signed in as ${data.staff?.fullName || username}. Tap Go to Work when ready.`,
      });
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
    if (staffUsername) sessionStorage.removeItem(getActiveOrderKey(staffUsername));
    setActiveOrder(null);
    setScanProgress({});
    setSelectedItemId(null);
    setCameraOpen(false);
  }, [staffUsername]);

  const loadOrder = useCallback(async rawOrderCode => {
    if (!session || !onWork) {
      setNotice({ type: 'error', text: 'Tap Go to Work before loading an order.' });
      return;
    }
    setBusy(true);
    try {
      let order = decodeFulfillmentQr(rawOrderCode);
      if (!order) {
        const orderRef = getOrderId(rawOrderCode);
        if (!orderRef) {
          throw new Error('Enter an order ID or scan the fulfillment QR printed from Inventory Software.');
        }
        const { data } = await api.get(
          `/inventory-software/orders/${encodeURIComponent(orderRef)}/manifest`,
          authConfig(session),
        );
        if (!data?.success || !data.order) {
          throw new Error(data?.message || `Order "${orderRef}" could not be loaded.`);
        }
        order = data.order;
      }
      if (String(order.status).toLowerCase() !== 'confirmed') {
        throw new Error(`Order #${order.orderNumber || order.id} must be confirmed before packing. Current status: ${order.status}.`);
      }
      if (!order.id || !Array.isArray(order.items) || order.items.length === 0) {
        throw new Error('The order manifest has no packable items.');
      }
      order.items = order.items.map(item => ({
        ...item,
        quantity: Number(item.quantity) || 1,
        sku: item.sku || '',
        barcode: item.barcode || item.sku || '',
      }));
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
    if (!navigator.onLine) {
      setNotice({ type: 'error', text: 'You are offline. Your packed order is preserved on this device; reconnect before uploading.' });
      return;
    }
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
    <main className="relative min-h-screen overflow-hidden bg-[#07110d] px-3 py-4 text-slate-100 sm:px-6 sm:py-7">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.12),transparent_38%),radial-gradient(ellipse_at_bottom_left,rgba(20,83,45,0.18),transparent_40%)]" />
      <div className="relative mx-auto w-full max-w-2xl">
        <header className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0b1812]/90 p-3 shadow-xl shadow-black/20 backdrop-blur sm:mb-7 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/30 bg-gradient-to-br from-emerald-300/20 to-emerald-900/30 text-emerald-200 shadow-inner">
              <ScanLine size={24} strokeWidth={2.2} />
            </div>
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-300">Bhumivera · Operations</p>
              <h1 className="text-lg font-black tracking-tight text-white sm:text-xl">Fulfillment Scanner</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-bold ${isOnline ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200' : 'border-amber-400/30 bg-amber-400/10 text-amber-200'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-emerald-300' : 'bg-amber-300'}`} />
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
            {session && (
              <button type="button" disabled={busy} onClick={handleLogout} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 px-3 text-xs font-semibold text-slate-300 transition hover:border-rose-400/30 hover:bg-rose-400/10 hover:text-rose-100 disabled:opacity-50">
                <LogOut size={15} /> <span className="hidden sm:inline">Sign out</span>
              </button>
            )}
          </div>
        </header>

        {session && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs">
            <span className="font-semibold text-white">{staffName}</span>
            <span className="font-mono text-[10px] text-slate-400">{session.sessionCode}</span>
            <span className={`rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wider ${onWork ? 'bg-emerald-400/15 text-emerald-200' : 'bg-white/10 text-slate-300'}`}>
              {onWork ? 'On shift' : 'Signed in'}
            </span>
          </div>
        )}

        {notice && (
          <div role={notice.type === 'error' ? 'alert' : 'status'} className={`mb-4 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm shadow-lg ${
            notice.type === 'error' ? 'border-rose-400/30 bg-rose-400/10 text-rose-100'
              : notice.type === 'success' ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100'
                : 'border-sky-400/30 bg-sky-400/10 text-sky-100'
          }`}>
            {notice.type === 'error' ? <AlertCircle size={17} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={17} className="mt-0.5 shrink-0" />}
            <span>{notice.text}</span>
          </div>
        )}

        {cameraOpen && (
          <section className="mb-5 overflow-hidden bg-black">
            <div className="relative aspect-[4/5] max-h-[62vh]">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-contain"
                style={{ filter: 'none', opacity: 1, transform: 'none' }}
              />
              <button type="button" onClick={() => setCameraOpen(false)} aria-label="Close camera" className="absolute right-3 top-3 z-20 rounded-full bg-black p-3 text-white">
                <X size={20} />
              </button>
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white">Align code in view</span>
            </div>
            <p className="p-3 text-center text-xs leading-5 text-slate-300">
              {cameraMode === 'order' ? 'Scan the compact fulfillment QR. It contains order and product codes and loads locally.' : `Scan the SKU or barcode for ${selectedItem?.name || 'the selected item'}.`}
            </p>
          </section>
        )}

        {!session ? (
          <section className="overflow-hidden rounded-3xl border border-emerald-300/25 bg-[#0b1812]/95 shadow-2xl shadow-black/30">
            <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-emerald-900/60 via-[#0b1812] to-[#0b1812] p-6 sm:p-8">
              <div aria-hidden="true" className="absolute -right-10 -top-16 h-48 w-48 rounded-full border border-emerald-300/10" />
              <div aria-hidden="true" className="absolute -right-2 -top-8 h-32 w-32 rounded-full border border-emerald-300/10" />
              <div className="relative flex items-start gap-4">
                <div className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 p-3 text-emerald-200"><ShieldCheck size={25} /></div>
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">Secure staff workspace</p>
                  <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Welcome back</h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">Sign in with the staff credentials created by your administrator. Your packing work stays local until you choose to upload.</p>
                </div>
              </div>
            </div>
            <div className="p-5 sm:p-8">
            <div className="mb-5 rounded-xl border border-sky-300/15 bg-sky-300/[0.05] p-3 text-xs leading-5 text-sky-100/80">
              Staff roster must be loaded from Inventory Software → Workroom → Staff Accounts before first sign-in after a backend restart.
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Staff ID
                <input autoComplete="username" value={username} onChange={event => setUsername(event.target.value)} required className="mt-2 min-h-13 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-base normal-case tracking-normal text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/10" placeholder="Enter your assigned staff ID" />
              </label>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Password
                <input autoComplete="current-password" type="password" value={password} onChange={event => setPassword(event.target.value)} required className="mt-2 min-h-13 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-base normal-case tracking-normal text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/10" placeholder="Your password" />
              </label>
              <button type="submit" disabled={busy || !isOnline} className="flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-300 to-teal-300 px-4 font-black text-[#062017] shadow-lg shadow-emerald-950/30 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50">
                {busy && <LoaderCircle size={17} className="animate-spin" />}
                {busy ? 'Signing in…' : isOnline ? 'Sign in to scanner' : 'Internet required to sign in'}
              </button>
            </form>
            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/10 pt-5 text-center">
              {[['01', 'Scan order'], ['02', 'Verify items'], ['03', 'Upload when ready']].map(([number, label]) => (
                <div key={number} className="rounded-xl bg-white/[0.03] px-2 py-3">
                  <span className="block font-mono text-[10px] font-bold text-emerald-300">{number}</span>
                  <span className="mt-1 block text-[10px] font-semibold text-slate-300 sm:text-xs">{label}</span>
                </div>
              ))}
            </div>
            </div>
          </section>
        ) : !onWork ? (
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b1812]/95 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-4 border-b border-white/10 bg-gradient-to-r from-emerald-900/45 to-transparent p-5 sm:p-7">
              <div className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-3 text-emerald-200"><Smartphone size={24} /></div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">Ready for your shift</p>
                <h2 className="mt-1 truncate text-xl font-black text-white">Welcome, {staffName}</h2>
                <p className="mt-1 text-xs text-slate-400">Device session · {session.sessionCode}</p>
              </div>
            </div>
            <div className="p-5 sm:p-7">
              <div className="mb-5 grid grid-cols-3 gap-2">
                {[['Camera', 'Ready on demand'], ['Packing data', 'Saved on device'], ['Inventory', 'Upload to update']].map(([title, detail]) => (
                  <div key={title} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                    <span className="block text-[9px] font-black uppercase tracking-wider text-emerald-300">{title}</span>
                    <span className="mt-1 block text-[10px] leading-4 text-slate-300">{detail}</span>
                  </div>
                ))}
              </div>
              <button type="button" disabled={busy || !isOnline} onClick={handleGoToWork} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-300 to-teal-300 px-4 font-black text-[#062017] shadow-lg shadow-emerald-950/30 transition hover:brightness-105 disabled:opacity-50">
                {busy ? <LoaderCircle size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                {isOnline ? 'Start shift · Go to Work' : 'Reconnect to start shift'}
              </button>
              <p className="mt-4 text-center text-xs leading-5 text-slate-400">Work status is visible in Inventory Software. QR decoding, product verification, and local bulk saves do not query SQL. Upload only when ready.</p>
            </div>
          </section>
        ) : confirmedOrder ? (
          <section className="space-y-4 rounded-3xl border border-emerald-300/25 bg-[#0b1812]/95 p-5 shadow-2xl shadow-black/30 sm:p-7">
            <div className="rounded-2xl border border-emerald-300/15 bg-gradient-to-br from-emerald-300/10 to-transparent p-5 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-300/10 shadow-[0_0_30px_rgba(16,185,129,0.12)]">
                <PackageCheck className="text-emerald-200" size={34} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">Verification complete</p>
              <h2 className="mt-1 text-2xl font-black text-white">Ready to upload</h2>
              <p className="mt-2 text-sm text-slate-300">Order #{confirmedOrder.orderNumber} · {confirmedOrder.verifiedItems.reduce((sum, item) => sum + item.quantity, 0)} verified units</p>
            </div>
            <button type="button" disabled={busy || !isOnline} onClick={() => uploadPackedOrders([confirmedOrder])} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-300 to-teal-300 px-4 font-black text-[#062017] shadow-lg shadow-emerald-950/30 disabled:opacity-50">
              {busy ? <LoaderCircle size={18} className="animate-spin" /> : <CloudUpload size={19} />}
              {isOnline ? 'Upload Now · Update Inventory' : 'Saved locally · reconnect to upload'}
            </button>
            <button type="button" disabled={busy} onClick={handleSaveBulk} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 font-bold text-white disabled:opacity-60">
              Save Bulk on This Device
            </button>
            <p className="text-center text-xs leading-5 text-slate-400">Save Bulk keeps this completed packing record on this device. Inventory marks the order packed only after a successful upload.</p>
          </section>
        ) : activeOrder ? (
          <section className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-emerald-300/20 bg-[#0b1812]/95 shadow-xl">
              <div className="flex items-start justify-between gap-3 p-4 sm:p-5">
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">Active packing order</p>
                  <h2 className="mt-1 truncate text-lg font-black text-white">#{activeOrder.orderNumber}</h2>
                  <p className="mt-1 text-xs text-slate-400">{activeOrder.customerName} · {orderItems.length} product lines</p>
                </div>
                <button type="button" aria-label="Back to scanner home" onClick={handleCancelPacking} disabled={busy} className="shrink-0 rounded-xl border border-white/10 p-2.5 text-slate-300 transition hover:border-rose-300/30 hover:bg-rose-300/10 hover:text-rose-100"><ArrowLeft size={18} /></button>
              </div>
              <div className="border-t border-white/8 bg-black/10 px-4 py-3 sm:px-5">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Scan progress</span>
                  <span className="font-mono font-bold text-emerald-200">{scannedUnits} / {expectedUnits} units</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-300" style={{ width: `${expectedUnits ? Math.min(100, (scannedUnits / expectedUnits) * 100) : 0}%` }} />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {orderItems.map(item => {
                const progress = scanProgress[String(item.orderItemId)] || { codes: [], quantity: Number(item.quantity) || 1 };
                const complete = progress.codes.length >= progress.quantity;
                return (
                  <article key={item.orderItemId} className={`rounded-2xl border p-4 shadow-lg shadow-black/10 transition ${complete ? 'border-emerald-300/35 bg-emerald-300/[0.06]' : 'border-white/10 bg-[#0b1812]/90'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-bold text-white">{item.name}</h3>
                        <p className="mt-1 truncate font-mono text-xs text-slate-400">{item.sku || item.barcode || 'Barcode not listed'} · Qty {progress.codes.length}/{progress.quantity}</p>
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
                        className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-emerald-300/30 bg-gradient-to-r from-emerald-300/15 to-teal-300/10 font-bold text-emerald-100 transition hover:border-emerald-200/60 hover:bg-emerald-300/20"
                      >
                        <Camera size={17} /> Scan {item.name}
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
            {orderComplete && (
              <button type="button" onClick={savePackedOrder} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-300 to-teal-300 px-4 font-black text-[#062017] shadow-lg shadow-emerald-950/30">
                <PackageCheck size={19} /> Confirm Packed
              </button>
            )}
            <button type="button" disabled={busy} onClick={handleCancelPacking} className="w-full py-3 text-xs font-bold text-rose-300 disabled:opacity-60">Cancel packing attempt</button>
          </section>
        ) : (
          <section className="space-y-4">
            <div className="rounded-2xl border border-emerald-300/20 bg-gradient-to-r from-emerald-900/35 to-[#0b1812] p-4 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-100">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-300/15"><CheckCircle2 size={17} /></span>
                  On work · {staffName}
                </div>
                <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-200">Live shift</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">Fulfillment QR scans load locally; manual order-ID lookup fetches the manifest from Inventory Software. Product scans stay on this device until upload.</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0b1812]/95 p-5 shadow-xl shadow-black/20 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">Packing station</p>
                  <h2 className="mt-1 text-lg font-black text-white">Start an order</h2>
                </div>
                <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-2.5 text-emerald-200"><Camera size={19} /></div>
              </div>
              <button type="button" disabled={busy || cameraOpen} onClick={() => { setCameraMode('order'); setCameraOpen(true); }} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-300 to-teal-300 px-4 font-black text-[#062017] shadow-lg shadow-emerald-950/30 transition hover:brightness-105 disabled:opacity-50">
                <Camera size={20} /> Scan Order Bill QR
              </button>
              <div className="my-4 flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-slate-500"><span className="h-px flex-1 bg-white/10" />or enter order number<span className="h-px flex-1 bg-white/10" /></div>
              <form onSubmit={event => { event.preventDefault(); loadOrder(orderInput); }} className="flex gap-2">
                <input value={orderInput} onChange={event => setOrderInput(event.target.value)} placeholder="Order number" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-3 font-mono text-sm text-white outline-none transition placeholder:font-sans placeholder:text-slate-500 focus:border-emerald-300" />
                <button type="submit" disabled={busy || !orderInput.trim()} className="rounded-xl border border-white/15 px-5 text-xs font-black text-white transition hover:border-emerald-300/40 hover:bg-emerald-300/10 disabled:opacity-40">Load</button>
              </form>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1812]/95 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="rounded-xl border border-sky-300/20 bg-sky-300/10 p-2.5 text-sky-200"><CloudUpload size={18} /></div>
                  <div className="min-w-0">
                    <h3 className="font-black text-white">Bulk upload queue</h3>
                    <p className="text-xs text-slate-400">{batch.length} order(s) · {batchUnits} verified units saved on device</p>
                  </div>
                </div>
                <button type="button" disabled={busy || batch.length === 0 || !isOnline} onClick={() => uploadPackedOrders(batch)} className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl bg-emerald-300 px-3 text-xs font-black text-[#062017] transition hover:brightness-105 disabled:opacity-40">
                  {busy ? <LoaderCircle size={15} className="animate-spin" /> : <Upload size={15} />} Upload
                </button>
              </div>
              {batch.length > 0 && (
                <ul className="space-y-2 border-t border-white/10 p-4 sm:px-5">
                  {batch.map(order => (
                    <li key={order.orderId} className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.03] px-3 py-2.5 text-xs">
                      <span className="min-w-0 truncate font-mono font-bold text-slate-200">Order #{order.orderNumber}</span>
                      <span className="shrink-0 rounded-full bg-white/5 px-2 py-1 text-[10px] text-slate-400">{order.verifiedItems.reduce((sum, item) => sum + item.quantity, 0)} units</span>
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
