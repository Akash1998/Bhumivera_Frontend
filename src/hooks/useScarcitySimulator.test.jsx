// @vitest-environment jsdom
import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useScarcitySimulator from './useScarcitySimulator';
import { scarcitySimulator } from '../services/api';

vi.mock('../services/api', () => ({
  scarcitySimulator: {
    getPublic: vi.fn(),
  },
}));

describe('useScarcitySimulator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(cleanup);

  it('loads the shared backend allocation snapshot for a product', async () => {
    scarcitySimulator.getPublic.mockResolvedValue({
      data: {
        enabled: true,
        products: {
          17: { simulatedSoldToday: 210, soldToday: 210 },
        },
      },
    });

    const { result } = renderHook(({ ids }) => useScarcitySimulator(ids), {
      initialProps: { ids: ['17'] },
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.products['17'].simulatedSoldToday).toBe(210);
    expect(scarcitySimulator.getPublic).toHaveBeenCalledOnce();
    expect(scarcitySimulator.getPublic).toHaveBeenCalledWith(['17']);
  });

  it('does not request a snapshot until a product ID is available', async () => {
    const { result, rerender } = renderHook(({ ids }) => useScarcitySimulator(ids), {
      initialProps: { ids: [] },
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(scarcitySimulator.getPublic).not.toHaveBeenCalled();

    scarcitySimulator.getPublic.mockResolvedValue({
      data: { enabled: true, products: { 17: { simulatedSoldToday: 210 } } },
    });
    rerender({ ids: ['17'] });

    await waitFor(() => expect(result.current.products['17']?.simulatedSoldToday).toBe(210));
    expect(scarcitySimulator.getPublic).toHaveBeenCalledOnce();
  });
});
