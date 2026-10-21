import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('native push notification setup', () => {
  let PushNotifications;
  let registerPushNotifications;
  let initPushNotifications;

  beforeEach(async () => {
    vi.resetModules();
    const module = await import('./pushNotifications');
    registerPushNotifications = module.registerPushNotifications;
    initPushNotifications = module.initPushNotifications;
    PushNotifications = {
      addListener: vi.fn().mockResolvedValue({ remove: vi.fn() }),
      checkPermissions: vi.fn(),
      requestPermissions: vi.fn(),
      register: vi.fn(),
    };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('does not request permission during startup when the permission is undecided', async () => {
    const calls = [];
    PushNotifications.addListener.mockImplementation(async name => {
      calls.push(`listener:${name}`);
      return { remove: vi.fn() };
    });
    PushNotifications.checkPermissions.mockImplementation(async () => {
      calls.push('check');
      return { receive: 'prompt' };
    });

    await expect(registerPushNotifications({ PushNotifications, userToken: 'token' })).resolves.toBe(false);
    expect(PushNotifications.requestPermissions).not.toHaveBeenCalled();
    expect(PushNotifications.register).not.toHaveBeenCalled();
    expect(calls.slice(0, 3)).toEqual([
      'listener:registration',
      'listener:registrationError',
      'listener:pushNotificationReceived',
    ]);
  });

  it('requests permission only from an explicit user action and registers after grant', async () => {
    PushNotifications.checkPermissions.mockResolvedValue({ receive: 'prompt' });
    PushNotifications.requestPermissions.mockResolvedValue({ receive: 'granted' });

    await expect(registerPushNotifications({
      PushNotifications,
      userToken: 'token',
      requestPermission: true,
    })).resolves.toBe(true);

    expect(PushNotifications.requestPermissions).toHaveBeenCalledOnce();
    expect(PushNotifications.register).toHaveBeenCalledOnce();
  });

  it('does not invoke Firebase registration when Android Firebase config is absent', async () => {
    vi.stubGlobal('window', {
      Capacitor: {
        isNativePlatform: () => true,
      },
    });

    await expect(initPushNotifications('token')).resolves.toBe(false);
  });
});
