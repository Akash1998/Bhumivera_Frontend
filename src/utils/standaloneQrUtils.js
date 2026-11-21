export const MAX_QRS = 300;
export const MAX_QRS_PER_A4_PAGE = 30;
export const MAX_QR_SIZE_MM = 38;

export function computeStandaloneA4QrLayout(requestedCount = MAX_QRS_PER_A4_PAGE) {
  const count = Math.max(1, Math.min(MAX_QRS_PER_A4_PAGE, Math.trunc(Number(requestedCount) || 1)));
  const printableWidthMm = 200;
  const printableHeightMm = 287;
  const gapMm = 2;
  const labelAllowanceMm = 8;
  let bestLayout = null;

  for (let cols = 1; cols <= count; cols += 1) {
    const rows = Math.ceil(count / cols);
    const cellWidthMm = (printableWidthMm - (cols - 1) * gapMm) / cols;
    const cellHeightMm = (printableHeightMm - (rows - 1) * gapMm) / rows;
    const qrSizeMm = Math.max(1, Math.floor(Math.min(
      MAX_QR_SIZE_MM,
      cellWidthMm,
      cellHeightMm - labelAllowanceMm,
    )));
    const shapeDifference = Math.abs(cellWidthMm - (cellHeightMm - labelAllowanceMm));

    if (
      !bestLayout ||
      qrSizeMm > bestLayout.qrSizeMm ||
      (qrSizeMm === bestLayout.qrSizeMm && cols * rows < bestLayout.capacity) ||
      (qrSizeMm === bestLayout.qrSizeMm && cols * rows === bestLayout.capacity && shapeDifference < bestLayout.shapeDifference)
    ) {
      bestLayout = { cols, rows, qrSizeMm, capacity: cols * rows, shapeDifference };
    }
  }

  return {
    count,
    cols: bestLayout.cols,
    rows: bestLayout.rows,
    qrSizeMm: bestLayout.qrSizeMm,
    gapMm,
  };
}

export function getStandaloneQrPageCount(totalCount) {
  return Math.ceil(Math.max(0, Number(totalCount) || 0) / MAX_QRS_PER_A4_PAGE);
}

export function createUniqueQrCode(existingCodes) {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Secure QR code generation is unavailable in this browser.');
  }

  let code;
  do {
    const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
    const token = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
    code = `BV-QR-${token}`;
  } while (existingCodes.has(code));

  existingCodes.add(code);
  return code;
}
