// @vitest-environment jsdom
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import ScarcitySimulationBadge from './ScarcitySimulationBadge';

describe('ScarcitySimulationBadge', () => {
  afterEach(cleanup);

  it('prominently labels simulated counters and distinguishes actual checkout availability', () => {
    render(
      <ScarcitySimulationBadge
        snapshot={{ enabled: true, remaining: 123, dailyCap: 250, lifetimeSold: 18000 }}
        productName="Sea Buckthorn Face Wash"
      />
    );

    expect(screen.getByText(/Live Sales/i)).toBeTruthy();
    expect(screen.getByText(/Not live inventory, actual sales, or verified customer activity/i)).toBeTruthy();
    expect(screen.getByText(/Today's units remaining:/i)).toBeTruthy();
    expect(screen.getByText(/Illustrative sold total:/i)).toBeTruthy();
  });

  it('labels sample activity as a non-real order', () => {
    render(
      <ScarcitySimulationBadge
        snapshot={{ enabled: true, remaining: 123, dailyCap: 250, lifetimeSold: 18000 }}
        productName="Sea Buckthorn Face Wash"
        sampleActivityEnabled
      />
    );

    expect(screen.getByText(/Sample scenario only:/i)).toBeTruthy();
    expect(screen.getByText(/Not a real order/i)).toBeTruthy();
  });

  it('does not render when the simulator is disabled for a product', () => {
    const { container } = render(
      <ScarcitySimulationBadge snapshot={{ enabled: false, remaining: 0, dailyCap: 250 }} />
    );
    expect(container.firstChild).toBeNull();
  });
});
