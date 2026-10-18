// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import AddressBook from './AddressBook';

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  toast: { error: vi.fn(), success: vi.fn() },
  addresses: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    setDefault: vi.fn(),
  },
}));

vi.mock('../context/AuthContext', () => ({ useAuth: mocks.useAuth }));
vi.mock('../context/ToastContext', () => ({ useToast: () => mocks.toast }));
vi.mock('../services/api', () => ({ addresses: mocks.addresses }));

describe('AddressBook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mocks.useAuth.mockReturnValue({ user: { id: 21 } });
    mocks.addresses.getAll.mockResolvedValue({ data: { addresses: [] } });
  });

  afterEach(cleanup);

  it('keeps a failed signed-in address save visible instead of claiming it was saved locally', async () => {
    mocks.addresses.create.mockRejectedValue({
      response: { data: { message: 'Address service unavailable.' } },
    });

    render(<AddressBook />);
    fireEvent.click(await screen.findByRole('button', { name: /Add your first address/i }));

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test Customer' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/Street Address/i), { target: { value: '10 Garden Road' } });
    fireEvent.change(screen.getByLabelText(/^City/i), { target: { value: 'Pune' } });
    fireEvent.change(screen.getByLabelText(/^State/i), { target: { value: 'Maharashtra' } });
    fireEvent.change(screen.getByLabelText(/PIN Code/i), { target: { value: '411001' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Address' }));

    expect(await screen.findByText('Address service unavailable.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Save Address' })).toBeTruthy();
    expect(localStorage.getItem('bhumivera_guest_addresses')).toBeNull();
    expect(mocks.toast.error).toHaveBeenCalledWith('Address service unavailable.');
  });

  it('saves guest addresses locally when no account is signed in', async () => {
    mocks.useAuth.mockReturnValue({ user: null });

    render(<AddressBook />);
    fireEvent.click(await screen.findByRole('button', { name: /Add your first address/i }));

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Guest Customer' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/Street Address/i), { target: { value: '10 Garden Road' } });
    fireEvent.change(screen.getByLabelText(/^City/i), { target: { value: 'Pune' } });
    fireEvent.change(screen.getByLabelText(/^State/i), { target: { value: 'Maharashtra' } });
    fireEvent.change(screen.getByLabelText(/PIN Code/i), { target: { value: '411001' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Address' }));

    expect(await screen.findByText('Address added successfully')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('bhumivera_guest_addresses'))).toHaveLength(1);
    expect(mocks.addresses.create).not.toHaveBeenCalled();
  });
});
