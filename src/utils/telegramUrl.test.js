import { describe, expect, it } from 'vitest';
import { normalizeTelegramBotUrl } from './telegramUrl';

describe('normalizeTelegramBotUrl', () => {
  it('converts Telegram app deep links to web links and retains start parameters', () => {
    expect(normalizeTelegramBotUrl(
      'tg://resolve?domain=BhumiveraBot&start=f140a35277c348c4c0b6403496d4ba3f7b83b52010a47743'
    )).toBe(
      'https://t.me/BhumiveraBot?start=f140a35277c348c4c0b6403496d4ba3f7b83b52010a47743'
    );
  });

  it('keeps existing Telegram web links', () => {
    expect(normalizeTelegramBotUrl('https://t.me/BhumiveraBot?start=welcome'))
      .toBe('https://t.me/BhumiveraBot?start=welcome');
  });

  it('uses the default bot link for unsupported or malformed URLs', () => {
    expect(normalizeTelegramBotUrl('javascript:alert(1)')).toBe('https://t.me/BhumiveraBot');
    expect(normalizeTelegramBotUrl('tg://resolve?start=missing-domain')).toBe('https://t.me/BhumiveraBot');
  });
});
