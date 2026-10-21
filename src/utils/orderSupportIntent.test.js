import { describe, expect, it } from 'vitest';
import { isOrderCancellationRequest } from './orderSupportIntent';

describe('isOrderCancellationRequest', () => {
  it.each([
    'Please cancel my order',
    'I want to cancel order #123456789',
    'Order cancellation request',
    'Can you help me cancel this order?',
  ])('identifies cancellation request: %s', message => {
    expect(isOrderCancellationRequest(message)).toBe(true);
  });

  it('does not classify unrelated order support as cancellation', () => {
    expect(isOrderCancellationRequest('Please track my order #123456789')).toBe(false);
  });
});
