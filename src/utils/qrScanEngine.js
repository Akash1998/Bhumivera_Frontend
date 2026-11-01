import {
  BarcodeFormat,
  BinaryBitmap,
  DecodeHintType,
  HybridBinarizer,
  InvertedLuminanceSource,
  MultiFormatReader,
} from '@zxing/library';
import { HTMLCanvasElementLuminanceSource } from '@zxing/browser';

const DECODE_SIZE = 960;
const SCAN_INTERVAL_MS = 90;

const buildReader = () => {
  const hints = new Map();
  hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);
  hints.set(DecodeHintType.TRY_HARDER, true);
  const reader = new MultiFormatReader();
  reader.setHints(hints);
  return reader;
};

const decodeCanvas = (reader, canvas, inverted) => {
  try {
    const source = new HTMLCanvasElementLuminanceSource(canvas);
    const bitmap = new BinaryBitmap(new HybridBinarizer(inverted ? new InvertedLuminanceSource(source) : source));
    return reader.decode(bitmap).getText();
  } catch {
    return null;
  }
};

export const getTrack = video => video?.srcObject?.getVideoTracks?.()[0] || null;

export const getCameraCapabilities = video => {
  const track = getTrack(video);
  const caps = track?.getCapabilities?.() || {};
  return {
    zoom: caps.zoom ? { min: caps.zoom.min, max: caps.zoom.max, step: caps.zoom.step || 0.1 } : null,
    torch: Boolean(caps.torch),
    focus: Array.isArray(caps.focusMode) ? caps.focusMode : [],
  };
};

export const startCamera = async video => {
  const attempts = [
    { facingMode: { ideal: 'environment' }, width: { ideal: 3840 }, height: { ideal: 2160 }, frameRate: { ideal: 30 } },
    { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
    { facingMode: { ideal: 'environment' } },
    true,
  ];
  let lastError;
  for (const videoConstraints of attempts) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: false });
      video.srcObject = stream;
      await video.play().catch(() => {});
      const track = stream.getVideoTracks()[0];
      const caps = track?.getCapabilities?.() || {};
      const advanced = [];
      if (caps.focusMode?.includes('continuous')) advanced.push({ focusMode: 'continuous' });
      if (caps.exposureMode?.includes('continuous')) advanced.push({ exposureMode: 'continuous' });
      if (caps.whiteBalanceMode?.includes('continuous')) advanced.push({ whiteBalanceMode: 'continuous' });
      if (advanced.length) await track.applyConstraints({ advanced }).catch(() => {});
      return stream;
    } catch (error) {
      lastError = error;
      if (error?.name === 'NotAllowedError' || error?.name === 'SecurityError') break;
    }
  }
  throw lastError || new Error('Unable to start the camera.');
};

export const stopCamera = video => {
  const stream = video?.srcObject;
  stream?.getTracks?.().forEach(track => track.stop());
  if (video) video.srcObject = null;
};

export const setZoom = async (video, value, digitalFallback) => {
  const track = getTrack(video);
  const zoom = track?.getCapabilities?.()?.zoom;
  if (zoom) {
    await track.applyConstraints({ advanced: [{ zoom: Math.min(zoom.max, Math.max(zoom.min, value)) }] });
    return 'hardware';
  }
  digitalFallback?.(value);
  return 'digital';
};

export const setTorch = async (video, on) => {
  const track = getTrack(video);
  if (!track?.getCapabilities?.()?.torch) return false;
  await track.applyConstraints({ advanced: [{ torch: on }] });
  return true;
};

export const focusAt = async (video, x, y) => {
  const track = getTrack(video);
  const caps = track?.getCapabilities?.() || {};
  if (!caps.focusMode) return false;
  const advanced = [{ pointsOfInterest: [{ x, y }] }];
  if (caps.focusMode.includes('single-shot')) advanced.push({ focusMode: 'single-shot' });
  await track.applyConstraints({ advanced }).catch(() => {});
  if (caps.focusMode.includes('continuous')) {
    window.setTimeout(() => {
      track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] }).catch(() => {});
    }, 1200);
  }
  return true;
};

// Scans repeatedly until a QR is decoded. Each pass tries the centre square (what the user sees),
// then the full frame, then a tighter centre crop, each normal and colour-inverted.
export const startScanLoop = (video, { onResult, getDigitalZoom = () => 1 }) => {
  const reader = buildReader();
  const canvas = document.createElement('canvas');
  canvas.width = DECODE_SIZE;
  canvas.height = DECODE_SIZE;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  const nativeDetector = typeof window.BarcodeDetector === 'function'
    ? new window.BarcodeDetector({ formats: ['qr_code'] })
    : null;
  let stopped = false;
  let frame = 0;
  let timer;

  const regionsFor = (vw, vh) => {
    const side = Math.min(vw, vh);
    const zoom = Math.max(1, getDigitalZoom());
    const visible = side / zoom;
    const centre = { sx: (vw - visible) / 2, sy: (vh - visible) / 2, sw: visible, sh: visible };
    const tight = { sx: (vw - visible * 0.6) / 2, sy: (vh - visible * 0.6) / 2, sw: visible * 0.6, sh: visible * 0.6 };
    const full = { sx: 0, sy: 0, sw: vw, sh: vh };
    return [centre, full, tight];
  };

  const tick = async () => {
    if (stopped) return;
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (vw && vh && video.readyState >= 2) {
      frame += 1;
      try {
        if (nativeDetector) {
          const codes = await nativeDetector.detect(video);
          const hit = codes.find(code => code.rawValue);
          if (hit && !stopped) {
            onResult(hit.rawValue);
            return;
          }
        }
        const regions = regionsFor(vw, vh);
        const region = regions[frame % regions.length];
        const outWidth = region.sw >= region.sh ? DECODE_SIZE : Math.round(DECODE_SIZE * (region.sw / region.sh));
        const outHeight = region.sh > region.sw ? DECODE_SIZE : Math.round(DECODE_SIZE * (region.sh / region.sw));
        canvas.width = outWidth;
        canvas.height = outHeight;
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        context.drawImage(video, region.sx, region.sy, region.sw, region.sh, 0, 0, outWidth, outHeight);
        const text = decodeCanvas(reader, canvas, false) || decodeCanvas(reader, canvas, true);
        if (text && !stopped) {
          onResult(text);
          return;
        }
      } catch {
        // A failed frame is ignored; the next tick tries again.
      }
    }
    timer = window.setTimeout(tick, SCAN_INTERVAL_MS);
  };

  timer = window.setTimeout(tick, SCAN_INTERVAL_MS);
  return () => {
    stopped = true;
    window.clearTimeout(timer);
  };
};
