// @vitest-environment jsdom
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import ABExperimentLab from './ABExperimentLab';

describe('ABExperimentLab unavailable state', () => {
  afterEach(cleanup);

  it('explains that labels are not measured experiments and offers no simulated controls', () => {
    render(<ABExperimentLab />);

    expect(screen.getByRole('heading', { name: 'A/B testing unavailable' })).toBeTruthy();
    expect(screen.getByText(/does not assign customers to variants or measure exposures, conversions/i)).toBeTruthy();
    expect(screen.queryByRole('button', { name: /create experiment|winner/i })).toBeNull();
  });
});
