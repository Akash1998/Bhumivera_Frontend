// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ReviewManagement from './ReviewManagement';
import api from '../../services/api';

const showToast = vi.hoisted(() => vi.fn());

vi.mock('../../services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
vi.mock('../../context/ToastContext', () => ({
  useToast: () => ({ showToast }),
}));

describe('database-backed admin reviews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('shows an empty database without bringing back bundled reviews', async () => {
    api.get.mockResolvedValue({ data: [] });
    render(React.createElement(ReviewManagement));

    expect(await screen.findByText('No database reviews match these filters.')).toBeTruthy();
    expect(screen.getByText('Customer Reviews & Media Database (0 reviews)')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Refresh customer reviews' }));
    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(2));
    expect(screen.getByText('Customer Reviews & Media Database (0 reviews)')).toBeTruthy();
  });

  it('shows the actual 450 records returned by the database', async () => {
    api.get.mockResolvedValue({
      data: Array.from({ length: 450 }, (_, index) => ({
        id: index + 1, product_id: 10, rating: 5, reviewer_name: `Customer ${index + 1}`,
        is_approved: 1, created_at: '2026-01-01',
      })),
    });
    render(React.createElement(ReviewManagement));

    expect(await screen.findByText('Customer Reviews & Media Database (450 reviews)')).toBeTruthy();
  });

  it('reports load failures instead of showing the bundled reviews', async () => {
    api.get.mockRejectedValue(new Error('Database unavailable'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(React.createElement(ReviewManagement));

    expect((await screen.findByRole('alert')).textContent).toContain('Reviews could not be loaded from the database.');
    expect(screen.getByText('Customer Reviews & Media Database (0 reviews)')).toBeTruthy();
    expect(showToast).toHaveBeenCalledWith('Could not load reviews from the database.', 'error');
  });

  it('keeps a successfully deleted review gone on refresh', async () => {
    api.get.mockResolvedValueOnce({ data: [{ id: 21, product_id: 10, rating: 5, reviewer_name: 'Customer', is_approved: 1 }] })
      .mockResolvedValue({ data: [] });
    api.delete.mockResolvedValue({ data: { deleted: true } });
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(React.createElement(ReviewManagement));

    fireEvent.click(await screen.findByRole('checkbox', { name: 'Select review 21' }));
    fireEvent.change(screen.getByRole('combobox', { name: 'Bulk action for selected reviews' }), { target: { value: 'delete' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply to selected' }));
    await waitFor(() => expect(api.delete).toHaveBeenCalledWith('/reviews/admin/21?permanent=true', { adminAuth: true }));
    expect(await screen.findByText('Customer Reviews & Media Database (0 reviews)')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Refresh customer reviews' }));
    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(2));
    expect(screen.getByText('Customer Reviews & Media Database (0 reviews)')).toBeTruthy();
  });

  it('keeps a review visible when deletion fails', async () => {
    api.get.mockResolvedValue({ data: [{ id: 21, product_id: 10, rating: 5, reviewer_name: 'Customer', is_approved: 1 }] });
    api.delete.mockRejectedValue(new Error('Delete failed'));
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(React.createElement(ReviewManagement));

    fireEvent.click(await screen.findByRole('checkbox', { name: 'Select review 21' }));
    fireEvent.change(screen.getByRole('combobox', { name: 'Bulk action for selected reviews' }), { target: { value: 'delete' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply to selected' }));
    await waitFor(() => expect(showToast).toHaveBeenCalledWith(
      'Permanently delete 0 review(s); 1 failed and remain selected.', 'error',
    ));
    expect(screen.getByText('Customer Reviews & Media Database (1 reviews)')).toBeTruthy();
  });
});
