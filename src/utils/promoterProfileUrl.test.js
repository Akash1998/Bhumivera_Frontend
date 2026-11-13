import { describe, expect, it } from 'vitest';
import { parsePromoterProfileUrl } from './promoterProfileUrl';

describe('parsePromoterProfileUrl', () => {
  it('detects supported account URLs without making a network request', () => {
    expect(parsePromoterProfileUrl('https://www.instagram.com/creator.name/')).toEqual({
      platform: 'Instagram',
      handle: '@creator.name',
    });
    expect(parsePromoterProfileUrl('https://youtube.com/@creatorchannel')).toEqual({
      platform: 'YouTube',
      handle: '@creatorchannel',
    });
    expect(parsePromoterProfileUrl('https://www.facebook.com/profile.php?id=123456')).toEqual({
      platform: 'Facebook',
      handle: '123456',
    });
  });

  it('rejects insecure, unsupported, or lookalike domains', () => {
    expect(parsePromoterProfileUrl('http://instagram.com/creator')).toBeNull();
    expect(parsePromoterProfileUrl('https://instagram.com.attacker.example/creator')).toBeNull();
    expect(parsePromoterProfileUrl('https://youtube.com/watch?v=video-id')).toBeNull();
  });
});
