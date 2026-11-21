export const PAPER_FORMATS = {
  A4: { widthMm: 210, heightMm: 297 },
  A3: { widthMm: 297, heightMm: 420 },
};

export const QR_CELL_WIDTH_MM = 18;
export const QR_CELL_HEIGHT_MM = 16;
export const QR_SIZE_MM = 16;
export const MAX_PAGE_LENGTH_MM = 3000;

export function calculateQrSheetLayout(widthMm, heightMm) {
  const width = Number(widthMm);
  const height = Number(heightMm);
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width < QR_CELL_WIDTH_MM ||
    height < QR_CELL_HEIGHT_MM ||
    height > MAX_PAGE_LENGTH_MM
  ) {
    throw new Error(`Paper length must be between ${QR_CELL_HEIGHT_MM} and ${MAX_PAGE_LENGTH_MM} mm.`);
  }

  const columns = Math.floor(width / QR_CELL_WIDTH_MM);
  const rows = Math.floor(height / QR_CELL_HEIGHT_MM);
  return {
    widthMm: width,
    heightMm: height,
    columns,
    rows,
    qrCount: columns * rows,
    offsetXmm: (width - columns * QR_CELL_WIDTH_MM) / 2,
    offsetYmm: (height - rows * QR_CELL_HEIGHT_MM) / 2,
  };
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
