// Safe haptics utility for native mobile apps with web vibration fallback
export const haptics = {
  impactLight: async () => {
    try {
      if (typeof window !== 'undefined' && window.Capacitor?.isPluginAvailable('Haptics')) {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        await Haptics.impact({ style: ImpactStyle.Light });
      } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(15);
      }
    } catch {
      // Haptics not available
    }
  },

  impactMedium: async () => {
    try {
      if (typeof window !== 'undefined' && window.Capacitor?.isPluginAvailable('Haptics')) {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        await Haptics.impact({ style: ImpactStyle.Medium });
      } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(30);
      }
    } catch {
      // Haptics not available
    }
  },

  notificationSuccess: async () => {
    try {
      if (typeof window !== 'undefined' && window.Capacitor?.isPluginAvailable('Haptics')) {
        const { Haptics, NotificationType } = await import('@capacitor/haptics');
        await Haptics.notification({ type: NotificationType.Success });
      } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([30, 50, 30]);
      }
    } catch {
      // Haptics not available
    }
  },

  notificationError: async () => {
    try {
      if (typeof window !== 'undefined' && window.Capacitor?.isPluginAvailable('Haptics')) {
        const { Haptics, NotificationType } = await import('@capacitor/haptics');
        await Haptics.notification({ type: NotificationType.Error });
      } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([50, 100, 50]);
      }
    } catch {
      // Haptics not available
    }
  },
};
