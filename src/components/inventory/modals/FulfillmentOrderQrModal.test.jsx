// @vitest-environment jsdom
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FulfillmentOrderQrModal from './FulfillmentOrderQrModal';
import { getInvoiceNumber } from '../../../utils/invoiceNumber';

describe('fulfillment invoice numbering', () => {
  it('creates a stable fiscal-year invoice number unique to the order ID', () => {
    const date = '2026-11-10T12:00:00.000Z';

    expect(getInvoiceNumber({ id: 9, createdAt: date })).toBe('BV/26-27/0009');
    expect(getInvoiceNumber({ id: 10, createdAt: date })).toBe('BV/26-27/0010');
    expect(getInvoiceNumber({ id: 9, createdAt: date })).toBe('BV/26-27/0009');
  });

  it('assigns orders before April to the preceding fiscal year', () => {
    expect(getInvoiceNumber({ id: 12, createdAt: '2027-02-01T12:00:00.000Z' })).toBe('BV/26-27/0012');
  });

  it('renders the fulfillment QR as a scalable crisp-edge SVG', async () => {
    render(
      <FulfillmentOrderQrModal
        order={{
          id: 12,
          orderNumber: 'ORD-12',
          status: 'confirmed',
          items: [{ id: 1, name: 'Test Product', sku: 'TEST-1', quantity: 1 }],
        }}
        onClose={() => {}}
      />,
    );

    const qr = await screen.findByAltText('Fulfillment manifest QR for order ORD-12');
    const svg = decodeURIComponent(qr.getAttribute('src').split(',')[1]);
    expect(qr.getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
    expect(svg).toContain('width="2048"');
    expect(svg).toContain('shape-rendering="crispEdges"');
  });
});
