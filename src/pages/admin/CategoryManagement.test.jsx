// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CategoryManagement from './CategoryManagement';
import api from '../../services/api';

const { showToastMock } = vi.hoisted(() => ({ showToastMock: vi.fn() }));

vi.mock('../../services/api', () => ({
  default: { get: vi.fn() },
}));

vi.mock('../../context/ToastContext', () => ({
  useToast: () => ({ showToast: showToastMock }),
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

  it('uses distinct AI batch IDs when categories and subcategories share a database ID', async () => {
    api.get.mockImplementation(path => {
      if (path === '/categories') {
        return Promise.resolve({ data: { data: [{ id: 1, name: 'Skin Care', slug: '' }] } });
      }
      if (path === '/subcategories') {
        return Promise.resolve({ data: { data: [{ id: 1, category_id: 1, name: 'Cleansers', slug: '' }] } });
      }
      if (path === '/categories/admin/audit?limit=30') {
        return Promise.resolve({ data: { data: [] } });
      }
      throw new Error(`Unexpected API request: ${path}`);
    });
    api.post = vi.fn(async (_path, payload) => ({
      data: {
        items: payload.items.map(item => ({
          id: item.id,
          slug: `${item.name.toLowerCase().replace(/\s+/g, '-')}-seo`,
          description: `${item.name} category.`,
          meta_title: `${item.name} | Bhumivera`,
          meta_description: `Explore ${item.name.toLowerCase()} at Bhumivera.`,
        })),
      },
    }));
    api.put = vi.fn().mockResolvedValue({ data: { success: true } });

    render(<CategoryManagement />);
    fireEvent.click(await screen.findByRole('button', { name: /generate missing seo/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
      expect(api.put).toHaveBeenCalledTimes(2);
    });

    const submittedIds = api.post.mock.calls[0][1].items.map(item => item.id);
    expect(submittedIds).toEqual(['category:1', 'subcategory:1']);
    expect(api.put).toHaveBeenCalledWith('/categories/1', expect.any(Object), expect.any(Object));
    expect(api.put).toHaveBeenCalledWith('/subcategories/1', expect.any(Object), expect.any(Object));
  });
});
