// @vitest-environment jsdom
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import ScarcitySimulationBadge from './ScarcitySimulationBadge';

describe('ScarcitySimulationBadge', () => {
  afterEach(cleanup);

  it('renders stock and order counters with total inventory header', () => {
    render(
      <ScarcitySimulationBadge
        snapshot={{ enabled: true, remaining: 123, dailyCap: 250, simulatedSoldToday: 127 }}
        productName="Sea Buckthorn Face Wash"
      />
    );

    expect(screen.getByText(/Total inventory/i)).toBeTruthy();
    expect(screen.getByText(/Units remaining:/i)).toBeTruthy();
    expect(screen.getByText(/Units Sold Today:/i)).toBeTruthy();
    expect(screen.getByText(/127/)).toBeTruthy();
    expect(screen.queryByText(/lifetime/i)).toBeNull();
  });

  it('does not render live viewing indicator', () => {
    render(
      <ScarcitySimulationBadge
        snapshot={{ enabled: true, remaining: 123, dailyCap: 250, simulatedSoldToday: 127 }}
        productName="Sea Buckthorn Face Wash"
      />
    );

    expect(screen.queryByTestId('live-viewers-badge')).toBeNull();
    expect(screen.queryByText(/people are viewing/i)).toBeNull();
    expect(screen.queryByText(/Live store activity/i)).toBeNull();
  });

  it('displays recent verified dispatches when activity feed is enabled', () => {
    render(
      <ScarcitySimulationBadge
        snapshot={{
          enabled: true,
          remaining: 123,
          dailyCap: 250,
          sampleActivity: [{ buyer: 'Verified Patron #123', city: 'Kolkata', time: '10:30 am' }],
        }}
        productName="Sea Buckthorn Face Wash"
        sampleActivityEnabled
      />
    );

    expect(screen.getByText(/Recent verified dispatches/i)).toBeTruthy();
    expect(screen.getByText(/Verified Patron #123 · Sea Buckthorn Face Wash · Kolkata · 10:30 am/i)).toBeTruthy();
  });

  it('does not render when disabled or paused for a product', () => {
    const { container } = render(
      <ScarcitySimulationBadge snapshot={{ enabled: false, remaining: 0, dailyCap: 250 }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('keeps hook order stable when simulator data changes from disabled to enabled', () => {
    const { container, rerender } = render(
      <ScarcitySimulationBadge snapshot={{ enabled: false, remaining: 0, dailyCap: 250 }} />
    );

    rerender(
      <ScarcitySimulationBadge snapshot={{ enabled: true, remaining: 123, dailyCap: 250, simulatedSoldToday: 127 }} />
    );

    expect(container.firstChild).not.toBeNull();
    expect(screen.getByText(/Units remaining:/i)).toBeTruthy();
  });
});
