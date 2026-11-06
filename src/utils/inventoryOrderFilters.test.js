import { describe, expect, it } from 'vitest';
import { filterLifecycleOrders, localOrderDate } from './inventoryOrderFilters';

const orders = [
  { id: 1, orderNumber: 'A101', status: 'pending', createdAt: '2026-11-06T09:00:00', customerName: 'Anita', items: [{ name: 'Soap' }] },
  { id: 2, orderNumber: 'A102', status: 'packed', createdAt: '2026-11-05T09:00:00', trackingNumber: 'AWB42' },
  { id: 3, orderNumber: 'A103', status: 'delivered', createdAt: '2026-11-06T10:00:00' },
];

describe('inventory lifecycle filters', () => {
  it('combines dispatch, local date and search filters', () => {
    expect(filterLifecycleOrders(orders, { status: 'DISPATCH', date: '2026-11-06', query: 'soap' }).map(o => o.id)).toEqual([1]);
    expect(filterLifecycleOrders(orders, { status: 'ALL', date: '', query: 'awb42' }).map(o => o.id)).toEqual([2]);
    expect(filterLifecycleOrders(orders, { status: 'delivered', date: '2026-11-06', query: '' }).map(o => o.id)).toEqual([3]);
  });

  it('uses the local calendar date and excludes invalid dates', () => {
    expect(localOrderDate(new Date(2026, 10, 6, 23, 59))).toBe('2026-11-06');
    expect(localOrderDate(null)).toBe('');
    expect(localOrderDate('invalid')).toBe('');
  });
});
