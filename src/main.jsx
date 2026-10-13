import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";
import { reportClientError } from "./services/api.js";
import { initializeNativeApp } from "./utils/nativeApp.js";
import { Capacitor } from "@capacitor/core";

void initializeNativeApp();

if (
  import.meta.env.PROD &&
  !Capacitor.isNativePlatform() &&
  'serviceWorker' in navigator
) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(error => {
      console.error('[SERVICE_WORKER_REGISTRATION_ERROR]', error);
    });
  }, { once: true });
}

if (!window.__bhumiveraErrorReporterInstalled) {
  window.__bhumiveraErrorReporterInstalled = true;
  let lastReportedAt = 0;
  const report = error => {
    if (Date.now() - lastReportedAt < 5000) return;
    lastReportedAt = Date.now();
    void reportClientError(error);
  };

  window.onerror = (message, source, lineNumber, columnNumber, error) => {
    report({ message, source, lineNumber, columnNumber, stack: error?.stack });
    return false;
  };
  window.addEventListener('unhandledrejection', event => report(event.reason));
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </HelmetProvider>
  </StrictMode>
);
