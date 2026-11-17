// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import PromoCodeCenter from './PromoCodeCenter';

vi.mock('./PromoterProgramManagement', () => ({ default: () => <div>Creator promo controls</div> }));
vi.mock('./CouponManagement', () => ({ default: () => <div>Regular coupon controls</div> }));

describe('PromoCodeCenter', () => {
  afterEach(cleanup);

  it('switches between creator promos and regular store coupons', async () => {
    render(<PromoCodeCenter/>);

    expect(await screen.findByText('Creator promo controls')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Store coupons/ }));
    expect(await screen.findByText('Regular coupon controls')).toBeTruthy();
    expect(screen.queryByText('Creator promo controls')).toBeNull();
  });
});
