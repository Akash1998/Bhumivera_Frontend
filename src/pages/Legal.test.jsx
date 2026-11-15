// @vitest-environment jsdom
import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Legal from './Legal';

vi.mock('../components/SEO', () => ({ default: () => null }));

const renderLegal = (entry) => render(
  <MemoryRouter initialEntries={[entry]}>
    <Routes>
      <Route path="/legal/:sectionSlug" element={<Legal />} />
    </Routes>
  </MemoryRouter>,
);

describe('legal page imagery', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it.each([
    '/legal/conditions-of-use',
    '/legal/shipping-hygiene',
    '/legal/unboxing-antiscam',
    '/legal/wallet-loyalty-referrals',
    '/legal/warranty-affiliate-b2b',
    '/legal/privacy-dpdp',
    '/legal/medical-ip-shield',
    '/legal/arbitration-grievance',
  ])('renders %s without part images', (path) => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const { container } = renderLegal(path);

    expect(container.querySelectorAll('img')).toHaveLength(0);
  });
});

describe('legal customer and creator protections', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('does not make optional evidence or internal review a condition of raising a product issue', () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const { container } = renderLegal('/legal/shipping-hygiene');
    const text = container.textContent.toLowerCase();

    expect(text).toContain('optional supporting information');
    expect(text).toContain('not by itself waive a right');
    expect(text).not.toContain('100% non-returnable');
    expect(text).not.toContain('video requirement');
  });

  it('requires campaign economics to be agreed in writing and protects good-faith creator speech', () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const { container } = renderLegal('/legal/warranty-affiliate-b2b');
    const text = container.textContent.toLowerCase();

    expect(text).toContain('compensation and payout timing');
    expect(text).toContain('before a creator accepts a campaign or starts work');
    expect(text).toContain('will not use this clause to suppress criticism');
    expect(text).toContain('earned and undisputed commissions');
  });
});
