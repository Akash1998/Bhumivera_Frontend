// @vitest-environment jsdom
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SystemHealth from './SystemHealth';
import { systemAdmin } from '../../services/api';

const mocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
}));

vi.mock('../../services/api', () => ({
  systemAdmin: {
    getHealth: vi.fn(),
    purgeCaches: vi.fn(),
  },
}));

vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ token: 'admin-token' }) }));
vi.mock('../../context/ToastContext', () => ({
  useToast: () => ({ success: mocks.success, error: mocks.error }),
}));

describe('SystemHealth cache cleaner', () => {
  let originalServiceWorkerDescriptor;
  let controller;
  let activeChannel;

  afterEach(() => {
    cleanup();
    if (originalServiceWorkerDescriptor) {
      Object.defineProperty(navigator, 'serviceWorker', originalServiceWorkerDescriptor);
    } else {
      delete navigator.serviceWorker;
    }
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    originalServiceWorkerDescriptor = Object.getOwnPropertyDescriptor(navigator, 'serviceWorker');
    systemAdmin.getHealth.mockResolvedValue({
      data: {
        status: 'healthy',
        healthIssues: [],
        checkedAt: new Date().toISOString(),
        process: { uptimeSeconds: 30, heapUsed: 1024, rss: 2048 },
        services: {
          database: { status: 'healthy' },
          email: { status: 'configured', deliveryMetrics: {} },
          payments: { status: 'configured' },
          rateLimits: { status: 'connected' },
          responseCache: { status: 'connected', configured: true, ttlSeconds: 900, maxCacheableResponseBytes: 1024 * 1024, metrics: {} },
        },
        requestMetrics: { recentRequests: [], recentServerErrors: [], healthIssues: [] },
        modules: [],
        limitations: 'Metrics cover this backend process.',
      },
    });
    systemAdmin.purgeCaches.mockResolvedValue({
      data: {
        status: 'complete',
        layers: {
          redis: { status: 'cleared', deletedEntries: 4 },
          processMemory: { status: 'cleared', entries: 2, bytes: 100 },
          backendInstances: { status: 'published', recipients: 2 },
          vercel: { status: 'cleared', scope: 'entire_project' },
        },
        note: 'Public caches refill on demand.',
      },
    });
    vi.stubGlobal('MessageChannel', class {
      constructor() {
        activeChannel = this;
        this.port1 = { onmessage: null, close: vi.fn() };
        this.port2 = {};
      }
    });
    controller = {
      postMessage: vi.fn(() => {
        queueMicrotask(() => activeChannel.port1.onmessage?.({
          data: { type: 'APP_CACHE_CLEARED', deletedCacheCount: 1 },
        }));
      }),
    };
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { controller },
    });
  });

  it('purges server caches and the current browser app cache without touching saved data', async () => {
    render(<SystemHealth />);
    fireEvent.click(await screen.findByRole('button', { name: 'Deep-clean caches' }));

    await waitFor(() => expect(systemAdmin.purgeCaches).toHaveBeenCalledTimes(1));
    expect(controller.postMessage).toHaveBeenCalledWith(
      { type: 'CLEAR_APP_CACHE' },
      expect.any(Array)
    );
    expect(await screen.findByText('Cache purge complete')).toBeTruthy();
    expect(screen.getByText(/1 cache\(s\) removed/)).toBeTruthy();
    expect(mocks.success).toHaveBeenCalledWith(expect.stringMatching(/will refill/));
  });
});
