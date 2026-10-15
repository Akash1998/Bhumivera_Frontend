const DEFAULT_TELEGRAM_BOT_URL = 'https://t.me/BhumiveraBot';
const TELEGRAM_HOSTS = new Set(['t.me', 'www.t.me', 'telegram.me', 'www.telegram.me']);

export function normalizeTelegramBotUrl(value) {
  if (typeof value !== 'string' || !value.trim()) {
    return DEFAULT_TELEGRAM_BOT_URL;
  }

  try {
    const url = new URL(value.trim());

    if (url.protocol === 'tg:' && url.hostname === 'resolve') {
      const domain = url.searchParams.get('domain');
      if (!domain) return DEFAULT_TELEGRAM_BOT_URL;

      url.searchParams.delete('domain');
      const query = url.searchParams.toString();
      return `https://t.me/${encodeURIComponent(domain)}${query ? `?${query}` : ''}`;
    }

    if (url.protocol === 'https:' && TELEGRAM_HOSTS.has(url.hostname.toLowerCase())) {
      return url.toString();
    }
  } catch {
    return DEFAULT_TELEGRAM_BOT_URL;
  }

  return DEFAULT_TELEGRAM_BOT_URL;
}
