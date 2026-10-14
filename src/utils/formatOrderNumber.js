export const formatOrderNumber = orderId => {
  const numericId = Number(orderId);
  if (!Number.isSafeInteger(numericId) || numericId < 1) return '—';
  return String(numericId).padStart(9, '0');
};
