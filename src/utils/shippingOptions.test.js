import { describe, expect, it } from 'vitest';
import { calculateDeliveryCosts } from './shippingOptions';

describe('checkout delivery costs', () => {
  const options = {
    standardCharge: 50,
    premiumCharge: 150,
    freeShippingThreshold: 599,
  };

  it('keeps Standard paid below the configured free-delivery threshold', () => {
    expect(calculateDeliveryCosts({ ...options, subtotal: 598 })).toEqual({
      standardCost: 50,
      premiumCost: 150,
    });
  });

  it('unlocks free Standard delivery at the configured threshold', () => {
    expect(calculateDeliveryCosts({ ...options, subtotal: 599 })).toEqual({
      standardCost: 0,
      premiumCost: 100,
    });
  });

  it('uses the configured Premium rate once the cart reaches 799', () => {
    expect(calculateDeliveryCosts({ ...options, subtotal: 799 })).toEqual({
      standardCost: 0,
      premiumCost: 150,
    });
  });
});
