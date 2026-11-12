import React, { createContext, useState, useCallback, useContext, useRef } from 'react';
import { settings as settingsApi } from '../services/api';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const request = useRef(null);

  const loadSettings = useCallback(() => {
    if (settings !== null) return Promise.resolve(settings);
    if (request.current) return request.current;

    setLoading(true);
    request.current = settingsApi.getPublic()
      .then(res => {
        const data = res.data;
        const publicSettings = data.settings || data;
        setSettings(publicSettings);
        return publicSettings;
      })
      .catch(() => {
        setSettings({});
        return {};
      })
      .finally(() => {
        request.current = null;
        setLoading(false);
      });

    return request.current;
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, loadSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
