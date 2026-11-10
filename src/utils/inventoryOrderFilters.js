export const DISPATCH_STATUSES = ['pending', 'confirmed', 'packed'];

export function localOrderDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function matchesOrderStatus(order, status) {
  return status === 'ALL' || (status === 'DISPATCH'
    ? DISPATCH_STATUSES.includes(order.status)
    : order.status === status);
}

export function filterLifecycleOrders(orders, { status, date, query }) {
  const term = query.trim().toLowerCase();
  return orders.filter(order => {
    const matchesQuery = !term || [
      order.orderNumber, order.id, order.customerName, order.customerPhone,
      order.city, order.state, order.pincode, order.trackingNumber, order.courier,
      ...(order.items || []).map(item => item.name),
    ].some(value => String(value ?? '').toLowerCase().includes(term));
    return matchesOrderStatus(order, status) && (!date || localOrderDate(order.createdAt) === date) && matchesQuery;
  });
}
