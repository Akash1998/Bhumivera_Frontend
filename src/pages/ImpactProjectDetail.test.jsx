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

  it('resolves and renders the immediate December 2026 hunger relief project', () => {
    render(
      <MemoryRouter initialEntries={['/impact/hungry-feeding']}>
        <Routes>
          <Route path="/impact/:imageId" element={<ImpactProjectDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Title & tagline
    expect(
      screen.getByText(/Warm Meal Annadaan & Hunger Relief Kitchen/i)
    ).toBeTruthy();

    // Problem dossier
    expect(
      screen.getByText(/The Reality: Hunger on the Streets of Our Own Towns/i)
    ).toBeTruthy();

    // Legal charter section
    expect(
      screen.getByText(/Can An Indian Company Take Donations\? The Full Legal Truth/i)
    ).toBeTruthy();

    // Verifies December 2026 badge
    expect(screen.getAllByText(/Launching December 2026/i).length).toBeGreaterThan(0);
  });

  it('renders all immediate and ecological projects without error', () => {
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
      <MemoryRouter initialEntries={['/impact/hungry-feeding']}>
        <Routes>
          <Route path="/impact/:imageId" element={<ImpactProjectDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Open co-sponsorship pledge modal
    const sponsorBtns = screen.getAllByRole('button', { name: /Co-Sponsor Materials/i });
    fireEvent.click(sponsorBtns[0]);

    // Fill in form
    const nameInput = screen.getByPlaceholderText(/e\.g\., Ananya Sharma/i);
    const emailInput = screen.getByPlaceholderText(/e\.g\., ananya@example\.com/i);
    fireEvent.change(nameInput, { target: { value: 'Meera Iyer' } });
    fireEvent.change(emailInput, { target: { value: 'meera@naturetrust.org' } });

    // Submit
    const submitBtn = screen.getByRole('button', { name: /Issue Stewardship Certificate/i });
    fireEvent.click(submitBtn);

    // Verify certificate screen appears with patron name
    expect(screen.getByText(/Stewardship Certificate Issued!/i)).toBeTruthy();
    expect(screen.getAllByText(/Meera Iyer/i).length).toBeGreaterThan(0);
  });

  it('allows registering as a volunteer and issues a volunteer certificate', () => {
    render(
      <MemoryRouter initialEntries={['/impact/stray-animal-care']}>
        <Routes>
          <Route path="/impact/:imageId" element={<ImpactProjectDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Open volunteer modal
    const volunteerBtn = screen.getByRole('button', { name: /Join as a Volunteer/i });
    fireEvent.click(volunteerBtn);

    // Fill in form
    const nameInput = screen.getByPlaceholderText(/e\.g\., Sourav Ganguly/i);
    const phoneInput = screen.getByPlaceholderText(/e\.g\., 9876543210/i);
    const emailInput = screen.getByPlaceholderText(/e\.g\., sourav@example\.com/i);
    fireEvent.change(nameInput, { target: { value: 'Subhashish Roy' } });
    fireEvent.change(phoneInput, { target: { value: '9832109876' } });
    fireEvent.change(emailInput, { target: { value: 'subhashish@gmail.com' } });

    // Submit
    const submitBtn = screen.getByRole('button', { name: /Confirm Volunteer Registration/i });
    fireEvent.click(submitBtn);

    // Verify volunteer certificate appears
    expect(screen.getByText(/Volunteer Registration Confirmed!/i)).toBeTruthy();
    expect(screen.getAllByText(/Subhashish Roy/i).length).toBeGreaterThan(0);
  });
});
