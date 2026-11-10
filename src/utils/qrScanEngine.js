import { BarcodeFormat, DecodeHintType } from '@zxing/library';
import { BrowserMultiFormatReader } from '@zxing/browser';

function buildReader() {
  const hints = new Map();
  hints.set(DecodeHintType.POSSIBLE_FORMATS, [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.CODE_128,
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
  ]);
  hints.set(DecodeHintType.TRY_HARDER, true);
  return new BrowserMultiFormatReader(hints);
}

/**
 * Starts rear camera with HD preference for small or distant QR / barcode labels.
 * @param {HTMLVideoElement} videoElement
 * @returns {Promise<MediaStream>}
 */
export async function startCamera(videoElement) {
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1920, min: 640 },
        height: { ideal: 1080, min: 480 },
      },
      audio: false,
    });
  } catch {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false,
    });
  }

  videoElement.srcObject = stream;
  videoElement.setAttribute('playsinline', 'true');
  await videoElement.play();

  const [track] = stream.getVideoTracks();
  if (track && typeof track.getCapabilities === 'function') {
    const caps = track.getCapabilities();
    const advanced = [];
    if (Array.isArray(caps.focusMode) && caps.focusMode.includes('continuous')) {
      advanced.push({ focusMode: 'continuous' });
    }
    if (advanced.length) {
      track.applyConstraints({ advanced }).catch(() => {});
    }
  }

  return stream;
}

export function stopCamera(videoElement) {
  const stream = videoElement?.srcObject;
  if (stream && typeof stream.getTracks === 'function') {
    stream.getTracks().forEach((t) => t.stop());
  }
  if (videoElement) {
    videoElement.srcObject = null;
  }
}

export function getCameraCapabilities(videoElement) {
  const track = videoElement?.srcObject?.getVideoTracks?.()?.[0];
  if (!track || typeof track.getCapabilities !== 'function') {
    return { torch: false, hardwareZoom: null };
  }
  const caps = track.getCapabilities();
  return {
    torch: Boolean(caps.torch),
    hardwareZoom:
      caps.zoom && typeof caps.zoom.min === 'number'
        ? { min: caps.zoom.min, max: caps.zoom.max, step: caps.zoom.step || 0.1 }
        : null,
  };
}

export async function setTorch(videoElement, enabled) {
  const track = videoElement?.srcObject?.getVideoTracks?.()?.[0];
  if (!track) return false;
  try {
    await track.applyConstraints({ advanced: [{ torch: Boolean(enabled) }] });
    return true;
  } catch {
    return false;
  }
}

export async function setHardwareZoom(videoElement, zoomLevel) {
  const track = videoElement?.srcObject?.getVideoTracks?.()?.[0];
  if (!track) return false;
  try {
    await track.applyConstraints({ advanced: [{ zoom: Number(zoomLevel) }] });
    return true;
  } catch {
    return false;
  }
}

/**
 * Runs a frame scan loop: full frame first, then center crop for small/far QR codes,
 * with digital zoom crop when hardware zoom is unavailable.
 * Supports continuous scanning mode (`continuous: true`) with an automatic cooldown per code.
 * @param {HTMLVideoElement} videoElement
 * @param {{
 *   onResult: (raw: string) => void,
 *   getDigitalZoom?: () => number,
 *   continuous?: boolean,
 *   cooldownMs?: number,
 * }} options
 * @returns {() => void} stop function
 */
export function startScanLoop(videoElement, { onResult, getDigitalZoom, continuous = false, cooldownMs = 1100 }) {
  let stopped = false;
  let timerId = null;
  let lastRawValue = '';
  let lastRawAt = 0;

  const fullCanvas = document.createElement('canvas');
  const cropCanvas = document.createElement('canvas');
  const fullCtx = fullCanvas.getContext('2d', { willReadFrequently: true });
  const cropCtx = cropCanvas.getContext('2d', { willReadFrequently: true });

  const nativeDetector =
    typeof window !== 'undefined' && 'BarcodeDetector' in window
      ? new window.BarcodeDetector({ formats: ['qr_code', 'code_128', 'ean_13', 'ean_8'] })
      : null;

  const zxingReader = buildReader();

  async function tryDecodeCanvas(canvas) {
    if (nativeDetector) {
      try {
        const codes = await nativeDetector.detect(canvas);
        if (codes && codes.length > 0 && codes[0].rawValue) {
          return codes[0].rawValue.trim();
        }
      } catch {
        // Fall through to ZXing
      }
    }
    try {
      const res = zxingReader.decodeFromCanvas(canvas);
      if (res && res.getText()) {
        return res.getText().trim();
      }
    } catch {
      // NotFoundException on empty frame is expected
    }
    return null;
  }

  async function tick() {
    if (stopped) return;

    if (videoElement && videoElement.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      const vw = videoElement.videoWidth;
      const vh = videoElement.videoHeight;

      if (vw > 0 && vh > 0) {
        const dZoom = Math.max(1, Number(getDigitalZoom ? getDigitalZoom() : 1) || 1);

        fullCanvas.width = vw;
        fullCanvas.height = vh;

        if (dZoom > 1.05) {
          const sw = vw / dZoom;
          const sh = vh / dZoom;
          const sx = (vw - sw) / 2;
          const sy = (vh - sh) / 2;
          fullCtx.drawImage(videoElement, sx, sy, sw, sh, 0, 0, vw, vh);
        } else {
          fullCtx.drawImage(videoElement, 0, 0, vw, vh);
        }

        let decoded = await tryDecodeCanvas(fullCanvas);

        if (!decoded) {
          const cropRatio = 0.52;
          const cw = Math.floor(vw * cropRatio);
          const ch = Math.floor(vh * cropRatio);
          const cx = Math.floor((vw - cw) / 2);
          const cy = Math.floor((vh - ch) / 2);

          cropCanvas.width = 720;
          cropCanvas.height = 720;
          cropCtx.imageSmoothingEnabled = true;
          cropCtx.imageSmoothingQuality = 'high';
          cropCtx.drawImage(fullCanvas, cx, cy, cw, ch, 0, 0, 720, 720);

          decoded = await tryDecodeCanvas(cropCanvas);
        }

        if (decoded && !stopped) {
          const now = Date.now();
          if (!continuous) {
            stopped = true;
            onResult(decoded);
            return;
          }
          if (decoded !== lastRawValue || now - lastRawAt > cooldownMs) {
            lastRawValue = decoded;
            lastRawAt = now;
            onResult(decoded);
          }
        }
      }
    }

    if (!stopped) {
      timerId = window.setTimeout(tick, 130);
    }
  }

  tick();

  return () => {
    stopped = true;
    if (timerId) {
      window.clearTimeout(timerId);
    }
  };
}
