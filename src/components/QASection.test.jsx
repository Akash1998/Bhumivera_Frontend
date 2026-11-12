// @vitest-environment jsdom
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import QASection from './QASection';

const mocks = vi.hoisted(() => ({
  fetchProductQA: vi.fn(),
  submitProductQuestion: vi.fn(),
}));

vi.mock('../services/api', () => ({
  fetchProductQA: mocks.fetchProductQA,
  submitProductQuestion: mocks.submitProductQuestion,
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

describe('QASection', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders only questions returned by the product Q&A API', async () => {
    mocks.fetchProductQA.mockResolvedValue({
      data: [{
        id: 21,
        question: 'Does this product contain fragrance?',
        answer: 'No fragrance is listed.',
        user_name: 'Catalog customer',
        helpful_count: 3,
        created_at: '2026-10-10T10:00:00.000Z',
      }],
    });

    render(<QASection productId={42} />);

    expect(await screen.findByText('Does this product contain fragrance?')).toBeTruthy();
    expect(screen.getByText('Helpful (3)')).toBeTruthy();
    expect(screen.queryByText('Verified Formulation Patron')).toBeNull();
    expect(mocks.fetchProductQA).toHaveBeenCalledWith(42);
  });

  it('shows an empty state when the API has no product questions', async () => {
    mocks.fetchProductQA.mockResolvedValue({ data: [] });

    render(<QASection productId={42} />);

    expect(await screen.findByText('No inquiries matching this search.')).toBeTruthy();
  });
});
