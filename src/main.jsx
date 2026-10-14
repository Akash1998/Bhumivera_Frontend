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
    let approvedUpdate = false;
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then(registration => {
      const announceWaitingUpdate = () => {
        if (!registration.waiting || !navigator.serviceWorker.controller) return;
        window.__bhumiveraWaitingWorker = registration.waiting;
        window.dispatchEvent(new CustomEvent('bhumivera:pwa-update-ready', {
          detail: { worker: registration.waiting },
        }));
      };

      announceWaitingUpdate();
      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;
        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed') announceWaitingUpdate();
        });
      });

      const checkForUpdate = () => {
        if (navigator.onLine) {
          registration.update().catch(error => {
            console.error('[SERVICE_WORKER_UPDATE_CHECK_ERROR]', error);
          });
        }
      };
      window.setInterval(checkForUpdate, 5 * 60 * 1000);
      window.addEventListener('focus', checkForUpdate);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkForUpdate();
      });

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!approvedUpdate) return;
        approvedUpdate = false;
        window.location.reload();
      });
      window.addEventListener('bhumivera:pwa-apply-update', event => {
        if (!event.detail?.worker) return;
        approvedUpdate = true;
        event.detail.worker.postMessage({ type: 'SKIP_WAITING' });
        window.__bhumiveraWaitingWorker = null;
      });
    }).catch(error => {
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
