// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Contact from './Contact';
import api from '../services/api';

vi.mock('../services/api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));
vi.mock('../components/SEO', () => ({
  default: () => null,
  GLOBAL_CORPORATE_FAQS: [],
}));
vi.mock('../context/AuthContext', () => {
  const user = { name: 'Mira Example', email: 'mira@example.com' };
  return { useAuth: () => ({ user }) };
});
vi.mock('../context/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

const renderContact = () => render(
  <MemoryRouter initialEntries={['/contact?topic=return']}>
    <Routes>
      <Route path="/contact" element={<Contact />} />
    </Routes>
  </MemoryRouter>,
);

describe('contact return request intake', () => {
  beforeEach(() => {
    api.get.mockResolvedValue({
      data: [{
        id: 12,
        order_number: 'BHVM000012',
        status: 'delivered',
        total: 520,
        can_request_return: true,
        non_returnable_reason: null,
      }],
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('submits an eligible delivered-order issue through the return-review endpoint', async () => {
    api.post.mockResolvedValue({
      data: { message: 'Your request has been received for review. Submission does not guarantee a refund or replacement.' },
    });
    renderContact();

    await screen.findByRole('option', { name: /order #bhvm000012/i });
    fireEvent.change(screen.getByLabelText('Delivered Order'), { target: { value: '12' } });
    fireEvent.change(screen.getByLabelText('Your Message'), { target: { value: 'The bottle leaked during delivery.' } });
    fireEvent.click(screen.getByRole('button', { name: /submit product-issue request/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/returns', {
        order_id: 12,
        reason: 'Damaged or leaking item',
        description: 'The bottle leaked during delivery.',
      });
    });
    expect(api.post).not.toHaveBeenCalledWith('/contact', expect.anything());
    expect(await screen.findByRole('heading', { name: 'Request Received' })).toBeTruthy();
    expect(screen.getByText(/does not guarantee a refund or replacement/i)).toBeTruthy();
  });

  it('shows the server error and does not display a success state when submission fails', async () => {
    api.post.mockRejectedValue({
      response: { data: { message: 'Only delivered orders can be submitted for return.' } },
    });
    renderContact();

    await screen.findByRole('option', { name: /order #bhvm000012/i });
    fireEvent.change(screen.getByLabelText('Delivered Order'), { target: { value: '12' } });
    fireEvent.change(screen.getByLabelText('Your Message'), { target: { value: 'The bottle leaked during delivery.' } });
    fireEvent.click(screen.getByRole('button', { name: /submit product-issue request/i }));

    expect((await screen.findByRole('alert')).textContent).toContain('Only delivered orders can be submitted for return.');
    expect(screen.queryByRole('heading', { name: 'Request Received' })).toBeNull();
  });
});
