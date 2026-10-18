// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { getCurrentCoordinates, getLocationErrorMessage, hasCoordinates, reverseGeocodeCoordinates } from './geolocation';

vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: vi.fn() },
}));

vi.mock('@capacitor/geolocation', () => ({
  Geolocation: {
    checkPermissions: vi.fn(),
    requestPermissions: vi.fn(),
    getCurrentPosition: vi.fn(),
  },
}));

describe('geolocation helpers', () => {
  beforeEach(() => {
    Capacitor.isNativePlatform.mockReturnValue(false);
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('requests native permission only when a native location action is used', async () => {
    Capacitor.isNativePlatform.mockReturnValue(true);
    Geolocation.checkPermissions.mockResolvedValue({ location: 'prompt' });
    Geolocation.requestPermissions.mockResolvedValue({ location: 'granted' });
    Geolocation.getCurrentPosition.mockResolvedValue({
      coords: { latitude: 0, longitude: 0 },
    });

    await expect(getCurrentCoordinates()).resolves.toEqual({ latitude: 0, longitude: 0 });
    expect(Geolocation.requestPermissions).toHaveBeenCalledOnce();
    expect(Geolocation.getCurrentPosition).toHaveBeenCalledOnce();
  });

  it('does not read a native location after permission is denied', async () => {
    Capacitor.isNativePlatform.mockReturnValue(true);
    Geolocation.checkPermissions.mockResolvedValue({ location: 'denied' });
    Geolocation.requestPermissions.mockResolvedValue({ location: 'denied' });

    await expect(getCurrentCoordinates()).rejects.toThrow('LOCATION_PERMISSION_DENIED');
    expect(Geolocation.getCurrentPosition).not.toHaveBeenCalled();
    expect(getLocationErrorMessage(new Error('LOCATION_PERMISSION_DENIED'))).toMatch(/permission was denied/i);
  });

  it('uses secure browser geolocation and accepts zero-valued coordinates', async () => {
    Object.defineProperty(window, 'isSecureContext', { configurable: true, value: true });
    const getPosition = vi.fn(success => success({ coords: { latitude: 0, longitude: 0 } }));
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: { getCurrentPosition: getPosition },
    });

    await expect(getCurrentCoordinates()).resolves.toEqual({ latitude: 0, longitude: 0 });
    expect(getPosition).toHaveBeenCalledOnce();
    expect(hasCoordinates(0, 0)).toBe(true);
    expect(hasCoordinates(null, 0)).toBe(false);
  });

  it('normalizes reverse-geocoded delivery fields and reports provider errors', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        address: {
          road: 'Garden Road',
          city: 'Pune',
          state: 'Maharashtra',
          postcode: '411001',
        },
      }),
    });

    await expect(reverseGeocodeCoordinates(18.5, 73.8)).resolves.toEqual({
      addressLine1: 'Garden Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
    });
    expect(String(fetch.mock.calls[0][0])).toContain('lat=18.5');

    fetch.mockResolvedValue({ ok: false, status: 429 });
    await expect(reverseGeocodeCoordinates(18.5, 73.8)).rejects.toThrow('status 429');
  });
});
