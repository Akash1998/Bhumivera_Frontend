// @vitest-environment jsdom
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
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

  it('renders the privacy notice without images or image-based examples', () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const { container } = renderLegal('/legal/privacy-dpdp');

    expect(screen.getByRole('heading', { name: /Privacy & DPDP Act 2023 Notice/i })).toBeTruthy();
    expect(container.querySelectorAll('img')).toHaveLength(0);
    expect(screen.queryByText(/Real-Life Case Precedents/i)).toBeNull();
  });
});
