// @vitest-environment jsdom
import React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { settings } from '../services/api';
import { SettingsProvider, useSettings } from './SettingsContext';

vi.mock('../services/api', () => ({
  settings: { getPublic: vi.fn() },
}));

function SettingsProbe() {
  const { settings: publicSettings, loadSettings } = useSettings();
  return (
    <button type="button" onClick={() => { void loadSettings(); }}>
      {publicSettings?.free_shipping_threshold ?? 'Load settings'}
    </button>
  );
}

describe('SettingsProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    settings.getPublic.mockResolvedValue({
      data: { settings: { free_shipping_threshold: 4000 } },
    });
  });

  afterEach(cleanup);

  it('loads public settings only when requested and shares an in-flight request', async () => {
    render(
      <SettingsProvider>
        <SettingsProbe />
      </SettingsProvider>
    );

    expect(settings.getPublic).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByRole('button'));
    });

    await waitFor(() => expect(screen.getByRole('button').textContent).toBe('4000'));
    expect(settings.getPublic).toHaveBeenCalledTimes(1);
  });
});
