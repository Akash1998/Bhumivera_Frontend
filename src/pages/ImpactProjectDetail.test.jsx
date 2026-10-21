// @vitest-environment jsdom
import React from 'react';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ImpactProjectDetail from './ImpactProjectDetail';
import { IMPACT_PROJECTS, findProjectById } from '../data/impactDeepDiveData';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

vi.mock('../components/SEO', () => ({
  default: () => <div data-testid="mock-seo" />,
}));

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { totals: [] } }),
    post: vi.fn(),
  },
}));
vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));

beforeAll(() => {
  window.scrollTo = vi.fn();
});

describe('ImpactProjectDetail component', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ user: null, isAuthenticated: false });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    localStorage.clear();
    delete window.Razorpay;
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

  it('verifies every sponsorship payment and displays the emailed certificate', async () => {
    useAuth.mockReturnValue({
      user: { id: 17, name: 'Meera Iyer', email: 'meera@example.com' },
      isAuthenticated: true,
    });
    api.post
      .mockResolvedValueOnce({
        data: { order_id: 'order_123', amount: 10000, currency: 'INR', key_id: 'rzp_test_key' },
      })
      .mockResolvedValueOnce({
        data: {
          success: true,
          certificateSent: true,
          certificate: {
            code: 'BV-HUNG-TEST-01',
            name: 'Meera Iyer',
            email: 'meera@example.com',
            amount: 100,
            projectTitle: 'Warm Meal Annadaan & Hunger Relief Kitchen',
            dedication: null,
            issuedAt: '2026-10-18T12:00:00.000Z',
          },
        },
      });
    window.Razorpay = class {
      constructor(options) {
        this.options = options;
      }
      on() {}
      open() {
        void this.options.handler({
          razorpay_order_id: 'order_123',
          razorpay_payment_id: 'pay_123',
          razorpay_signature: 'signed',
        });
      }
    };

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

    expect(screen.getByDisplayValue('Meera Iyer').readOnly).toBe(true);
    expect(screen.getByDisplayValue('meera@example.com').readOnly).toBe(true);
    const submitBtn = screen.getByRole('button', { name: /Pay ₹100 & Co-Sponsor/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Stewardship Certificate Issued!/i)).toBeTruthy();
    expect(screen.getAllByText(/Meera Iyer/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/certificate was emailed to meera@example\.com/i)).toBeTruthy();
    expect(api.post).toHaveBeenNthCalledWith(
      1,
      '/impact/donations/create-order',
      { amount: 100, projectKey: 'hungry-feeding', dedication: '' },
      { notify: false },
    );
    expect(api.post).toHaveBeenNthCalledWith(2, '/impact/donations/verify-payment', {
      razorpay_order_id: 'order_123',
      razorpay_payment_id: 'pay_123',
      razorpay_signature: 'signed',
      amountPaise: 10000,
      dedication: '',
    }, { notify: false });
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
