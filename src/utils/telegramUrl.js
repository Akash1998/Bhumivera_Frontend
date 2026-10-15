const DEFAULT_TELEGRAM_BOT_URL = 'https://web.telegram.org/k/#@BhumiveraBot';
const TELEGRAM_HOSTS = new Set(['t.me', 'www.t.me', 'telegram.me', 'www.telegram.me']);

function webTelegramUrl(username, params) {
  const query = params.toString();
  return `https://web.telegram.org/k/#@${encodeURIComponent(username)}${query ? `?${query}` : ''}`;
}

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
      return webTelegramUrl(domain, url.searchParams);
    }

    if (url.protocol === 'https:' && TELEGRAM_HOSTS.has(url.hostname.toLowerCase())) {
      const username = url.pathname.split('/').filter(Boolean)[0];
      return username ? webTelegramUrl(username, url.searchParams) : DEFAULT_TELEGRAM_BOT_URL;
    }

    if (url.protocol === 'https:' && url.hostname.toLowerCase() === 'web.telegram.org') {
      return url.toString();
    }
  } catch {
    return DEFAULT_TELEGRAM_BOT_URL;
  }

  return DEFAULT_TELEGRAM_BOT_URL;
}
