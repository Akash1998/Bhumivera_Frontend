// @vitest-environment jsdom
import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CategoryManagement from './CategoryManagement';
import api from '../../services/api';

vi.mock('../../services/api', () => ({
  default: { get: vi.fn() },
}));

vi.mock('../../context/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

describe('CategoryManagement audit history', () => {
  afterEach(cleanup);

  it('renders persisted category changes returned by the audit API', async () => {
    api.get.mockImplementation(path => {
      if (path === '/categories') return Promise.resolve({ data: { data: [] } });
      if (path === '/subcategories') return Promise.resolve({ data: { data: [] } });
      if (path === '/categories/admin/audit?limit=30') {
        return Promise.resolve({
          data: {
            data: [{
              id: 5,
              action: 'updated',
              category_id: 12,
              actor_email: 'admin@example.com',
              before_state: { name: 'Old name' },
              after_state: { name: 'Botanical care' },
              created_at: '2026-10-11T10:00:00.000Z',
            }],
          },
        });
      }
      throw new Error(`Unexpected API request: ${path}`);
    });

    render(<CategoryManagement />);

    await waitFor(() => {
      expect(screen.getByText('Botanical care')).toBeTruthy();
    });
    expect(screen.getByText(/updated/i)).toBeTruthy();
    expect(screen.getByText(/admin@example.com/)).toBeTruthy();
    expect(api.get).toHaveBeenCalledWith('/categories/admin/audit?limit=30');
  });
});
