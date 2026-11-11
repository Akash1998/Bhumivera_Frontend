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
