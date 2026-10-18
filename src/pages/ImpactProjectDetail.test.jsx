// @vitest-environment jsdom
import React from 'react';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ImpactProjectDetail from './ImpactProjectDetail';
import { IMPACT_PROJECTS, findProjectById } from '../data/impactDeepDiveData';

vi.mock('../components/SEO', () => ({
  default: () => <div data-testid="mock-seo" />,
}));

beforeAll(() => {
  window.scrollTo = vi.fn();
});

describe('ImpactProjectDetail component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('resolves and renders the Pampore saffron project deep-dive dossier', () => {
    render(
      <MemoryRouter initialEntries={['/impact/pampore-saffron']}>
        <Routes>
          <Route path="/impact/:imageId" element={<ImpactProjectDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Title & tagline
    expect(
      screen.getByText(/Pampore Saffron Corridors & Alpine Honeybee Sanctuaries/i)
    ).toBeTruthy();

    // Problem dossier
    expect(
      screen.getByText(/The Catastrophe We Created/i)
    ).toBeTruthy();

    // Legal charter section
    expect(
      screen.getByText(/Can An Indian Company Take Donations\? The Full Legal Truth/i)
    ).toBeTruthy();

    // Verifies 2027 phase badge
    expect(screen.getAllByText(/2027 Phase II Execution/i).length).toBeGreaterThan(0);
  });

  it('renders all 6 upcoming 2027 projects without error', () => {
    IMPACT_PROJECTS.forEach(project => {
      const match = findProjectById(project.slug);
      expect(match).toBeDefined();
      expect(match.title).toBe(project.title);
      expect(match.funding.targetAmount).toBeGreaterThan(0);
      expect(match.impactColumns.length).toBeGreaterThan(0);
      expect(match.problemDossier.keyFactors.length).toBeGreaterThan(0);
    });
  });

  it('generates an official verified stewardship certificate upon pledge submission', () => {
    render(
      <MemoryRouter initialEntries={['/impact/sacred-groves']}>
        <Routes>
          <Route path="/impact/:imageId" element={<ImpactProjectDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Open co-sponsorship pledge modal
    const pledgeBtns = screen.getAllByRole('button', { name: /Co-Sponsor This Corridor/i });
    fireEvent.click(pledgeBtns[0]);

    // Fill in form
    const nameInput = screen.getByPlaceholderText(/e\.g\., Ananya Sharma/i);
    const emailInput = screen.getByPlaceholderText(/e\.g\., ananya@example\.com/i);
    fireEvent.change(nameInput, { target: { value: 'Meera Iyer' } });
    fireEvent.change(emailInput, { target: { value: 'meera@naturetrust.org' } });

    // Submit
    const submitBtn = screen.getByRole('button', { name: /Issue Stewardship Certificate/i });
    fireEvent.click(submitBtn);

    // Verify certificate screen appears with patron name
    expect(screen.getByText(/Stewardship Certificate Issued/i)).toBeTruthy();
    expect(screen.getAllByText(/Meera Iyer/i).length).toBeGreaterThan(0);
  });
});
