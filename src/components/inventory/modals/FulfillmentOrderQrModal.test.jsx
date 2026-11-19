// @vitest-environment jsdom
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FulfillmentOrderQrModal from './FulfillmentOrderQrModal';
import { getInvoiceNumber } from '../../../utils/invoiceNumber';
import { encodeOrderManifest } from '../../../utils/fulfillmentOrderManifest';

describe('fulfillment order QR and invoice', () => {
  it('creates a stable fiscal-year invoice number unique to the order ID', () => {
    const date = '2026-11-10T12:00:00.000Z';

    expect(getInvoiceNumber({ id: 9, createdAt: date })).toBe('BV/26-27/0009');
    expect(getInvoiceNumber({ id: 10, createdAt: date })).toBe('BV/26-27/0010');
    expect(getInvoiceNumber({ id: 9, createdAt: date })).toBe('BV/26-27/0009');
  });

  it('assigns orders before April to the preceding fiscal year', () => {
    expect(getInvoiceNumber({ id: 12, createdAt: '2027-02-01T12:00:00.000Z' })).toBe('BV/26-27/0012');
  });

  it('encodes every combo component as an individual line in the order QR manifest', () => {
    const order = {
      id: 12,
      orderNumber: 'ORD-12',
      status: 'confirmed',
      customerName: 'Sample Customer',
      items: [
        { id: 101, name: 'Creators Combo — Charcoal Face Wash', sku: 'SKU-1', barcode: 'BAR-1', quantity: 1 },
        { id: 102, name: 'Creators Combo — Aloe Vera Soap', sku: 'SKU-2', barcode: 'BAR-2', quantity: 1 },
        { id: 103, name: 'Creators Combo — Shampoo', sku: 'SKU-3', barcode: 'BAR-3', quantity: 2 },
        { id: 104, name: 'Creators Combo — Aloe Vera Moisturiser', sku: 'SKU-4', barcode: 'BAR-4', quantity: 1 },
      ],
    };
    const encoded = encodeOrderManifest(order);
    const base64 = encoded.slice('BV-PWA2:'.length).replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));
    const payload = JSON.parse(new TextDecoder().decode(
      Uint8Array.from(binary, character => character.charCodeAt(0)),
    ));

    expect(payload[5]).toHaveLength(4);
    expect(payload[5].map(item => [item[0], item[1], item[2], item[3], item[4]])).toEqual([
      [101, 'Creators Combo — Charcoal Face Wash', 'SKU-1', 'BAR-1', 1],
      [102, 'Creators Combo — Aloe Vera Soap', 'SKU-2', 'BAR-2', 1],
      [103, 'Creators Combo — Shampoo', 'SKU-3', 'BAR-3', 2],
      [104, 'Creators Combo — Aloe Vera Moisturiser', 'SKU-4', 'BAR-4', 1],
    ]);
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
