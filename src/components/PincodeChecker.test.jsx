// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PincodeChecker from './PincodeChecker';
import { addresses, shipping } from '../services/api';

const authState = vi.hoisted(() => ({ current: { user: null, loading: false } }));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => authState.current,
}));

vi.mock('../services/api', () => ({
  addresses: { getAll: vi.fn() },
  shipping: { checkPincode: vi.fn() },
}));

describe('PincodeChecker saved address lookup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.current = { user: { id: 42, role: 'user' }, loading: false };
    addresses.getAll.mockResolvedValue({
      data: {
        addresses: [
          { id: 1, label: 'Work', postal_code: '400001', is_default: false },
          { id: 2, label: 'Home', postal_code: '713359', is_default: true },
        ],
      },
    });
    shipping.checkPincode.mockImplementation(async pincode => ({
      data: {
        success: true,
        serviceable: true,
        pincode,
        estimated_delivery: 'Fri, Oct 17',
        estimated_days: '3-6 business days',
        cod_available: true,
        free_delivery_above: 500,
      },
    }));
  });

  afterEach(() => {
    cleanup();
  });

  it('automatically checks the default saved address pincode', async () => {
    render(<PincodeChecker useSavedAddress />);

    await waitFor(() => expect(shipping.checkPincode).toHaveBeenCalledWith('713359'));
    expect(addresses.getAll).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('textbox').value).toBe('713359');
    expect(await screen.findByText('Delivery available to 713359')).toBeTruthy();
    expect(screen.getByText('Checking the pincode from your home address.')).toBeTruthy();
  });

  it('uses the authenticated API client for a manually entered pincode', async () => {
    authState.current = { user: null, loading: false };
    render(<PincodeChecker />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '713359' } });
    fireEvent.click(screen.getByRole('button', { name: 'Check' }));

    await waitFor(() => expect(shipping.checkPincode).toHaveBeenCalledWith('713359'));
    expect(addresses.getAll).not.toHaveBeenCalled();
    expect(await screen.findByText('Delivery available to 713359')).toBeTruthy();
  });
});
