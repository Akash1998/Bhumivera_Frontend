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
  const { settings: publicSettings, loadSettings, updatePublicSettings } = useSettings();
  return <>
    <button type="button" onClick={() => { void loadSettings(); }}>Load public settings</button>
    <button type="button" onClick={() => updatePublicSettings({ free_shipping_threshold: '599' })}>Update threshold</button>
    <p>{publicSettings?.free_shipping_threshold ?? 'Not loaded'}</p>
  </>;
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
      fireEvent.click(screen.getByRole('button', { name: 'Load public settings' }));
      fireEvent.click(screen.getByRole('button', { name: 'Load public settings' }));
    });

    await waitFor(() => expect(screen.getByText('4000')).toBeTruthy());
    expect(settings.getPublic).toHaveBeenCalledTimes(1);
  });

  it('updates already-loaded public settings after an admin save', async () => {
    render(
      <SettingsProvider>
        <SettingsProbe />
      </SettingsProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Load public settings' }));
    });
    await waitFor(() => expect(screen.getByText('4000')).toBeTruthy());

    fireEvent.click(screen.getByRole('button', { name: 'Update threshold' }));

    expect(screen.getByText('599')).toBeTruthy();
    expect(settings.getPublic).toHaveBeenCalledTimes(1);
  });
});
