export const getInvoiceNumber = order => {
  const orderId = Number(order?.id);
  if (!Number.isSafeInteger(orderId) || orderId <= 0) {
    return order?.invoiceNumber || `BV/${order?.orderNumber || 'INVOICE'}`;
  }
  const date = order?.createdAt ? new Date(order.createdAt) : new Date();
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
  const dateParts = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'numeric',
  }).formatToParts(safeDate);
  const year = Number(dateParts.find(part => part.type === 'year')?.value) || safeDate.getFullYear();
  const month = Number(dateParts.find(part => part.type === 'month')?.value) || safeDate.getMonth() + 1;
  const fiscalYearStart = month >= 4 ? year : year - 1;
  return `BV/${String(fiscalYearStart).slice(-2)}-${String(fiscalYearStart + 1).slice(-2)}/${String(orderId).padStart(4, '0')}`;
};
