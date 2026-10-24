import { describe, expect, it } from 'vitest';
import { normalizeTelegramBotUrl } from './telegramUrl';

describe('normalizeTelegramBotUrl', () => {
  it('converts Telegram app deep links to web links and retains start parameters', () => {
    expect(normalizeTelegramBotUrl(
      'tg://resolve?domain=BhumiveraBot&start=f140a35277c348c4c0b6403496d4ba3f7b83b52010a47743'
    )).toBe(
      'https://web.telegram.org/k/#@BhumiveraBot?start=f140a35277c348c4c0b6403496d4ba3f7b83b52010a47743'
    );
  });

  it('converts t.me redirects to direct Telegram Web links', () => {
    expect(normalizeTelegramBotUrl('https://t.me/BhumiveraBot?start=welcome'))
      .toBe('https://web.telegram.org/k/#@BhumiveraBot?start=welcome');
  });

  it('keeps direct Telegram Web links', () => {
    expect(normalizeTelegramBotUrl('https://web.telegram.org/k/#@BhumiveraBot'))
      .toBe('https://web.telegram.org/k/#@BhumiveraBot');
  });

  it('uses the default bot link for unsupported or malformed URLs', () => {
    expect(normalizeTelegramBotUrl('javascript:alert(1)')).toBe('https://web.telegram.org/k/#@BhumiveraBot');
    expect(normalizeTelegramBotUrl('tg://resolve?start=missing-domain')).toBe('https://web.telegram.org/k/#@BhumiveraBot');
  });
});
