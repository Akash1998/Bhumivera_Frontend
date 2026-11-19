export const encodeOrderManifest = order => {
  const manifest = [
    2,
    order.id,
    order.orderNumber || String(order.id),
    order.status || 'pending',
    order.customerName || 'Customer',
    (order.items || []).map(item => [
      item.id || item.orderItemId,
      item.name || 'Product',
      item.sku || '',
      item.barcode || item.sku || '',
      Number(item.quantity) || 1,
    ]),
  ];
  const bytes = new TextEncoder().encode(JSON.stringify(manifest));
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return `BV-PWA2:${btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')}`;
};
