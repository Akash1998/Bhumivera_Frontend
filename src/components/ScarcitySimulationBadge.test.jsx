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

  it('renders live viewing indicator starting at 77+', () => {
    render(
      <ScarcitySimulationBadge
        snapshot={{ enabled: true, remaining: 123, dailyCap: 250, simulatedSoldToday: 127 }}
        productName="Sea Buckthorn Face Wash"
      />
    );

    const badge = screen.getByTestId('live-viewers-badge');
    expect(badge).toBeTruthy();
    expect(badge.className).toContain('bg-gradient-to-r');

    const viewerText = screen.getByText(/77\+ people are viewing/i);
    expect(viewerText).toBeTruthy();
    expect(screen.getByText(/Live store activity/i)).toBeTruthy();
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
});
