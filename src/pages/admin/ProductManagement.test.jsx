// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ProductManagement from './ProductManagement';
import { products, categories } from '../../services/api';

const showToast = vi.hoisted(() => vi.fn());

vi.mock('../../services/api', () => ({
  default: { post: vi.fn() },
  products: {
    getAllAdmin: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    toggleStatus: vi.fn(),
    delete: vi.fn(),
    getUploadUrl: vi.fn(),
    saveImageKeys: vi.fn(),
    deleteImage: vi.fn(),
  },
  categories: { getAll: vi.fn() },
  serials: { getByProduct: vi.fn(), generate: vi.fn() },
}));
vi.mock('../../context/ToastContext', () => ({
  useToast: () => ({ showToast }),
}));
vi.mock('../../utils/productImageUrl', () => ({
  getProductImageUrl: () => '/logo.webp',
}));
vi.mock('../../utils/compressImageForUpload', () => ({
  default: vi.fn(),
}));

const formulations = [
  { id: 11, name: 'Formulation One' },
  { id: 12, name: 'Formulation Two' },
  { id: 13, name: 'Formulation Three' },
  { id: 14, name: 'Formulation Four' },
].map(product => ({
  ...product,
  slug: product.name.toLowerCase().replaceAll(' ', '-'),
  category_id: 1,
  price: 100,
  discount_price: 90,
  quantity: 20,
  status: 'active',
  specifications: {},
}));

const combo = {
  id: 20,
  name: 'Test Combo',
  slug: 'test-combo',
  category_id: 1,
  price: 300,
  discount_price: 250,
  quantity: 20,
  status: 'active',
  specifications: {
    is_combo: true,
    product_type: 'combo',
    combo_items: formulations.slice(0, 3).map(product => ({
      product_id: product.id,
      slug: product.slug,
      name: product.name,
      quantity: 1,
    })),
  },
};

describe('admin combo item editing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    products.getAllAdmin.mockResolvedValue({ data: [combo, ...formulations] });
    categories.getAll.mockResolvedValue({ data: [{ id: 1, name: 'Skincare' }] });
    products.update.mockResolvedValue({ data: { data: combo } });
  });

  afterEach(() => {
    cleanup();
  });

  it('adds and removes constituent items and persists the changed selection', async () => {
    render(<ProductManagement />);

    await screen.findByText('Test Combo');
    fireEvent.click(screen.getAllByTitle('Edit Product')[0]);

    const formFour = await screen.findByRole('checkbox', { name: 'Include Formulation Four in combo' });
    const formThree = screen.getByRole('checkbox', { name: 'Include Formulation Three in combo' });
    expect(formThree.checked).toBe(true);

    fireEvent.click(formFour);
    expect(formFour.checked).toBe(true);
    expect(screen.getByText('4 items bundled in this combo')).toBeTruthy();

    fireEvent.click(formThree);
    expect(formThree.checked).toBe(false);
    expect(screen.getByText('3 items bundled in this combo')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Save Product' }));

    await waitFor(() => expect(products.update).toHaveBeenCalledTimes(1));
    const payload = products.update.mock.calls[0][1];
    expect(payload.specifications.combo_items.map(item => item.product_id)).toEqual([11, 12, 14]);
  });
});
