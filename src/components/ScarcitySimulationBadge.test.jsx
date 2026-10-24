// @vitest-environment jsdom
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import ScarcitySimulationBadge from './ScarcitySimulationBadge';

describe('ScarcitySimulationBadge', () => {
  afterEach(cleanup);

  it('labels stock and order counters as illustrative', () => {
    render(
      <ScarcitySimulationBadge
        snapshot={{ enabled: true, remaining: 123, dailyCap: 250, simulatedSoldToday: 127 }}
        productName="Sea Buckthorn Face Wash"
      />
    );

    expect(screen.getByText(/Illustrative inventory simulation/i)).toBeTruthy();
    expect(screen.getByText(/not live stock, customer orders, or buyer identities/i)).toBeTruthy();
    expect(screen.getByText(/Illustrative units remaining:/i)).toBeTruthy();
    expect(screen.getByText(/Simulated units sold today:/i)).toBeTruthy();
    expect(screen.getByText(/127/)).toBeTruthy();
    expect(screen.queryByText(/lifetime/i)).toBeNull();
  });

  it('labels sample buyers as fictional, not real orders', () => {
    render(
      <ScarcitySimulationBadge
        snapshot={{
          enabled: true,
          remaining: 123,
          dailyCap: 250,
          sampleActivity: [{ buyer: 'Sample shopper #123', city: 'Kolkata', time: '10:30 am' }],
        }}
        productName="Sea Buckthorn Face Wash"
        sampleActivityEnabled
      />
    );

    expect(screen.getByText(/Fictional sample shoppers · Not real orders/i)).toBeTruthy();
    expect(screen.getByText(/Sample shopper #123 · Sea Buckthorn Face Wash · Kolkata · 10:30 am/i)).toBeTruthy();
  });

  it('does not render when the simulator is disabled for a product', () => {
    const { container } = render(
      <ScarcitySimulationBadge snapshot={{ enabled: false, remaining: 0, dailyCap: 250 }} />
    );
    expect(container.firstChild).toBeNull();
  });
});
