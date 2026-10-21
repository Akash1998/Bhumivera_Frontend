import { Capacitor } from '@capacitor/core';

const LOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };

export const hasCoordinates = (latitude, longitude) =>
  latitude !== null && latitude !== undefined &&
  longitude !== null && longitude !== undefined;

export const getCurrentCoordinates = async () => {
  if (Capacitor.isNativePlatform()) {
    const { Geolocation } = await import('@capacitor/geolocation');
    let permission = await Geolocation.checkPermissions();
    if (permission.location !== 'granted') {
      permission = await Geolocation.requestPermissions();
    }
    if (permission.location !== 'granted') {
      throw new Error('LOCATION_PERMISSION_DENIED');
    }
    const position = await Geolocation.getCurrentPosition(LOCATION_OPTIONS);
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  }

  if (!window.isSecureContext) {
    throw new Error('LOCATION_REQUIRES_SECURE_CONTEXT');
  }
  if (!navigator.geolocation) {
    throw new Error('GEOLOCATION_UNAVAILABLE');
  }

  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, LOCATION_OPTIONS);
  });
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
};

export const reverseGeocodeCoordinates = async (latitude, longitude) => {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.search = new URLSearchParams({
    format: 'jsonv2',
    lat: String(latitude),
    lon: String(longitude),
    'accept-language': navigator.language || 'en',
  }).toString();

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Reverse geocoding failed with status ${response.status}.`);
  }

  const { address = {} } = await response.json();
  return {
    addressLine1: address.road || address.suburb || address.neighbourhood || address.residential || '',
    city: address.city || address.town || address.village || address.county || address.state_district || '',
    state: address.state || '',
    pincode: address.postcode || '',
  };
};

export const getLocationErrorMessage = error => {
  if (error?.message === 'LOCATION_PERMISSION_DENIED' || error?.code === 1) {
    return 'Location permission was denied. Please allow location access or enter your address manually.';
  }
  if (error?.code === 3) {
    return 'Location request timed out. Please enter your address manually.';
  }
  if (error?.message === 'LOCATION_REQUIRES_SECURE_CONTEXT') {
    return 'Location access requires HTTPS. Open the secure Bhumivera website or enter your address manually.';
  }
  if (error?.message === 'GEOLOCATION_UNAVAILABLE') {
    return 'Location is not supported on this device. Please enter your address manually.';
  }
  return 'Unable to fetch your location. Please enter your address manually.';
};
